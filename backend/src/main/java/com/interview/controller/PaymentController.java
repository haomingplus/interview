package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.CreateOrderDTO;
import com.interview.security.CustomUserDetails;
import com.interview.service.PaymentService;
import com.interview.vo.OrderVO;
import com.interview.vo.PaymentVO;
import com.interview.vo.VipProductVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 支付控制器
 */
@Tag(name = "支付", description = "VIP购买和支付相关接口")
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "获取VIP产品列表")
    @GetMapping("/products")
    public Result<List<VipProductVO>> getProducts() {
        return Result.success(paymentService.getProducts());
    }

    @Operation(summary = "创建订单")
    @PostMapping("/orders")
    public Result<PaymentVO> createOrder(
            @Valid @RequestBody CreateOrderDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(paymentService.createOrder(dto, user.getId()));
    }

    @Operation(summary = "获取用户订单列表")
    @GetMapping("/orders")
    public Result<List<OrderVO>> getUserOrders(
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(paymentService.getUserOrders(user.getId()));
    }

    @Operation(summary = "获取订单详情")
    @GetMapping("/orders/{orderNo}")
    public Result<OrderVO> getOrderDetail(
            @PathVariable String orderNo,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(paymentService.getOrderDetail(orderNo, user.getId()));
    }

    @Operation(summary = "取消订单")
    @PostMapping("/orders/{orderNo}/cancel")
    public Result<Void> cancelOrder(
            @PathVariable String orderNo,
            @AuthenticationPrincipal CustomUserDetails user) {
        paymentService.cancelOrder(orderNo, user.getId());
        return Result.success();
    }

    @Operation(summary = "查询订单状态")
    @GetMapping("/orders/{orderNo}/status")
    public Result<OrderVO> queryOrderStatus(
            @PathVariable String orderNo,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(paymentService.queryOrderStatus(orderNo, user.getId()));
    }

    @Operation(summary = "微信支付回调")
    @PostMapping("/wechat/notify")
    public String wechatNotify(HttpServletRequest request) {
        return paymentService.handleWeChatNotify(request);
    }

    @Operation(summary = "支付宝回调")
    @PostMapping("/alipay/notify")
    public String alipayNotify(@RequestParam Map<String, String> params) {
        return paymentService.handleAlipayNotify(params);
    }
}
