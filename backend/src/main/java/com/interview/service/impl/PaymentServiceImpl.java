package com.interview.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ijpay.alipay.AliPayApi;
import com.ijpay.alipay.AliPayApiConfig;
import com.ijpay.alipay.AliPayApiConfigKit;
import com.ijpay.core.kit.WxPayKit;
import com.ijpay.wxpay.WxPayApi;
import com.ijpay.wxpay.enums.WxDomain;
import com.ijpay.wxpay.model.UnifiedOrderModel;
import com.interview.common.ResultCode;
import com.interview.config.PaymentConfig;
import com.interview.dto.CreateOrderDTO;
import com.interview.entity.Order;
import com.interview.entity.User;
import com.interview.entity.VipProduct;
import com.interview.exception.BusinessException;
import com.interview.mapper.OrderMapper;
import com.interview.mapper.UserMapper;
import com.interview.mapper.VipProductMapper;
import com.interview.service.PaymentService;
import com.interview.vo.OrderVO;
import com.interview.vo.PaymentVO;
import com.interview.vo.VipProductVO;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 支付服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentConfig paymentConfig;
    private final OrderMapper orderMapper;
    private final VipProductMapper vipProductMapper;
    private final UserMapper userMapper;

    @PostConstruct
    public void init() {
        // 初始化支付宝配置
        PaymentConfig.AlipayConfig alipay = paymentConfig.getAlipay();
        AliPayApiConfig aliPayApiConfig = AliPayApiConfig.builder()
                .setAppId(alipay.getAppId())
                .setPrivateKey(alipay.getPrivateKey())
                .setAliPayPublicKey(alipay.getPublicKey())
                .setCharset(alipay.getCharset())
                .setSignType(alipay.getSignType())
                .setServiceUrl(alipay.getGatewayUrl())
                .build();
        AliPayApiConfigKit.setThreadLocalAliPayApiConfig(aliPayApiConfig);
    }

    @Override
    public List<VipProductVO> getProducts() {
        List<VipProduct> products = vipProductMapper.selectList(
                new LambdaQueryWrapper<VipProduct>()
                        .eq(VipProduct::getStatus, 1)
                        .orderByAsc(VipProduct::getSort));

        return products.stream()
                .map(this::toProductVO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PaymentVO createOrder(CreateOrderDTO dto, Long userId) {
        // 获取产品信息
        VipProduct product = vipProductMapper.selectById(dto.getProductId());
        if (product == null || product.getStatus() != 1) {
            throw new BusinessException(ResultCode.PARAM_ERROR, "产品不存在或已下架");
        }

        // 创建订单
        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setProductType("vip_" + product.getType());
        order.setProductName(product.getName());
        order.setAmount(product.getPrice());
        order.setPayType(dto.getPayType());
        order.setStatus("pending");
        orderMapper.insert(order);

        // 创建支付
        PaymentVO paymentVO = new PaymentVO();
        paymentVO.setOrderNo(order.getOrderNo());
        paymentVO.setPayType(dto.getPayType());

        try {
            if ("wechat".equals(dto.getPayType())) {
                // 微信支付
                String qrCode = createWeChatPay(order);
                paymentVO.setQrCode(qrCode);
            } else if ("alipay".equals(dto.getPayType())) {
                // 支付宝支付
                String form = createAlipay(order);
                paymentVO.setForm(form);
            }
        } catch (Exception e) {
            log.error("创建支付失败", e);
            throw new BusinessException(ResultCode.SERVER_ERROR, "创建支付失败");
        }

        return paymentVO;
    }

    @Override
    public List<OrderVO> getUserOrders(Long userId) {
        List<Order> orders = orderMapper.selectList(
                new LambdaQueryWrapper<Order>()
                        .eq(Order::getUserId, userId)
                        .orderByDesc(Order::getCreatedAt));

        return orders.stream()
                .map(this::toOrderVO)
                .collect(Collectors.toList());
    }

    @Override
    public OrderVO getOrderDetail(String orderNo, Long userId) {
        Order order = getOrderByNo(orderNo, userId);
        return toOrderVO(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancelOrder(String orderNo, Long userId) {
        Order order = getOrderByNo(orderNo, userId);
        if (!"pending".equals(order.getStatus())) {
            throw new BusinessException(ResultCode.PARAM_ERROR, "订单状态不允许取消");
        }
        order.setStatus("cancelled");
        orderMapper.updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String handleWeChatNotify(HttpServletRequest request) {
        try {
            String xmlResult = WxPayKit.readData(request);
            Map<String, String> params = WxPayKit.xmlToMap(xmlResult);

            String returnCode = params.get("return_code");
            String resultCode = params.get("result_code");

            if ("SUCCESS".equals(returnCode) && "SUCCESS".equals(resultCode)) {
                String orderNo = params.get("out_trade_no");
                String transactionId = params.get("transaction_id");

                // 处理订单
                handlePaySuccess(orderNo, transactionId, "wechat");

                return WxPayKit.toXml(Map.of(
                        "return_code", "SUCCESS",
                        "return_msg", "OK"
                ));
            }
        } catch (Exception e) {
            log.error("微信支付回调处理失败", e);
        }
        return WxPayKit.toXml(Map.of(
                "return_code", "FAIL",
                "return_msg", "ERROR"
        ));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String handleAlipayNotify(Map<String, String> params) {
        try {
            boolean verify = AliPayApi.rsaCheckV1(params,
                    paymentConfig.getAlipay().getPublicKey(),
                    paymentConfig.getAlipay().getCharset(),
                    paymentConfig.getAlipay().getSignType());

            if (verify) {
                String tradeStatus = params.get("trade_status");
                if ("TRADE_SUCCESS".equals(tradeStatus) || "TRADE_FINISHED".equals(tradeStatus)) {
                    String orderNo = params.get("out_trade_no");
                    String tradeNo = params.get("trade_no");

                    handlePaySuccess(orderNo, tradeNo, "alipay");
                    return "success";
                }
            }
        } catch (Exception e) {
            log.error("支付宝回调处理失败", e);
        }
        return "failure";
    }

    @Override
    public OrderVO queryOrderStatus(String orderNo, Long userId) {
        Order order = getOrderByNo(orderNo, userId);
        // TODO: 可以调用支付平台API查询实时状态
        return toOrderVO(order);
    }

    // ========== 私有方法 ==========

    private String generateOrderNo() {
        return "ORD" + System.currentTimeMillis() + IdUtil.fastSimpleUUID().substring(0, 6).toUpperCase();
    }

    private String createWeChatPay(Order order) throws Exception {
        PaymentConfig.WeChatConfig config = paymentConfig.getWechat();

        Map<String, String> params = UnifiedOrderModel.builder()
                .appid(config.getAppId())
                .mch_id(config.getMchId())
                .nonce_str(WxPayKit.generateStr())
                .body(order.getProductName())
                .out_trade_no(order.getOrderNo())
                .total_fee(order.getAmount().multiply(new BigDecimal("100")).intValue() + "")
                .spbill_create_ip("127.0.0.1")
                .notify_url(config.getNotifyUrl())
                .trade_type("NATIVE")
                .build()
                .createSign(config.getApiKey(), false);

        String xmlResult = WxPayApi.pushOrder(false, WxDomain.CHINA.toString(), params);
        Map<String, String> result = WxPayKit.xmlToMap(xmlResult);

        if ("SUCCESS".equals(result.get("return_code")) && "SUCCESS".equals(result.get("result_code"))) {
            return result.get("code_url");
        }

        throw new BusinessException(ResultCode.SERVER_ERROR, "微信支付创建失败: " + result.get("return_msg"));
    }

    private String createAlipay(Order order) throws Exception {
        PaymentConfig.AlipayConfig config = paymentConfig.getAlipay();

        Map<String, String> params = new HashMap<>();
        params.put("out_trade_no", order.getOrderNo());
        params.put("total_amount", order.getAmount().toString());
        params.put("subject", order.getProductName());
        params.put("product_code", "FAST_INSTANT_TRADE_PAY");

        return AliPayApi.tradePrecreatePayToResponse(
                JSONUtil.toJsonStr(params),
                config.getNotifyUrl()
        ).getQrCode();
    }

    private void handlePaySuccess(String orderNo, String tradeNo, String payType) {
        Order order = orderMapper.selectOne(
                new LambdaQueryWrapper<Order>()
                        .eq(Order::getOrderNo, orderNo));

        if (order == null || !"pending".equals(order.getStatus())) {
            return;
        }

        // 更新订单状态
        order.setTradeNo(tradeNo);
        order.setStatus("paid");
        order.setPaidAt(LocalDateTime.now());

        // 计算过期时间
        VipProduct product = vipProductMapper.selectOne(
                new LambdaQueryWrapper<VipProduct>()
                        .eq(VipProduct::getType, order.getProductType().replace("vip_", "")));

        if (product != null && product.getDurationDays() != null) {
            order.setExpiredAt(LocalDateTime.now().plusDays(product.getDurationDays()));
        }

        orderMapper.updateById(order);

        // 更新用户VIP状态
        User user = userMapper.selectById(order.getUserId());
        if (user != null) {
            user.setRole("vip");
            userMapper.updateById(user);
        }

        log.info("订单支付成功: orderNo={}, tradeNo={}, payType={}", orderNo, tradeNo, payType);
    }

    private Order getOrderByNo(String orderNo, Long userId) {
        Order order = orderMapper.selectOne(
                new LambdaQueryWrapper<Order>()
                        .eq(Order::getOrderNo, orderNo)
                        .eq(Order::getUserId, userId));

        if (order == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "订单不存在");
        }
        return order;
    }

    private VipProductVO toProductVO(VipProduct product) {
        VipProductVO vo = new VipProductVO();
        BeanUtil.copyProperties(product, vo);

        if (product.getFeatures() != null) {
            vo.setFeatures(JSONUtil.toList(product.getFeatures(), String.class));
        }

        if (product.getOriginalPrice() != null && product.getOriginalPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discount = product.getPrice()
                    .divide(product.getOriginalPrice(), 2, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            vo.setDiscountPercent(100 - discount.intValue());
        }

        return vo;
    }

    private OrderVO toOrderVO(Order order) {
        OrderVO vo = new OrderVO();
        BeanUtil.copyProperties(order, vo);
        return vo;
    }
}
