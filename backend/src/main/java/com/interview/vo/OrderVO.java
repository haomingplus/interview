package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单VO
 */
@Data
@Schema(description = "订单信息")
public class OrderVO {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "产品类型")
    private String productType;

    @Schema(description = "产品名称")
    private String productName;

    @Schema(description = "订单金额")
    private BigDecimal amount;

    @Schema(description = "支付方式")
    private String payType;

    @Schema(description = "状态")
    private String status;

    @Schema(description = "支付时间")
    private LocalDateTime paidAt;

    @Schema(description = "过期时间")
    private LocalDateTime expiredAt;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
