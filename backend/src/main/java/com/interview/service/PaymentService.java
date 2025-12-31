package com.interview.service;

import com.interview.dto.CreateOrderDTO;
import com.interview.vo.OrderVO;
import com.interview.vo.PaymentVO;
import com.interview.vo.VipProductVO;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

/**
 * 支付服务接口
 */
public interface PaymentService {

    /**
     * 获取VIP产品列表
     */
    List<VipProductVO> getProducts();

    /**
     * 创建订单并获取支付信息
     */
    PaymentVO createOrder(CreateOrderDTO dto, Long userId);

    /**
     * 获取用户订单列表
     */
    List<OrderVO> getUserOrders(Long userId);

    /**
     * 获取订单详情
     */
    OrderVO getOrderDetail(String orderNo, Long userId);

    /**
     * 取消订单
     */
    void cancelOrder(String orderNo, Long userId);

    /**
     * 处理微信支付回调
     */
    String handleWeChatNotify(HttpServletRequest request);

    /**
     * 处理支付宝回调
     */
    String handleAlipayNotify(Map<String, String> params);

    /**
     * 查询订单支付状态
     */
    OrderVO queryOrderStatus(String orderNo, Long userId);
}
