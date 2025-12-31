package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 订单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("`order`")
@Schema(description = "订单")
public class Order extends BaseEntity {

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "产品类型")
    private String productType;

    @Schema(description = "产品名称")
    private String productName;

    @Schema(description = "订单金额")
    private BigDecimal amount;

    @Schema(description = "支付方式: wechat, alipay")
    private String payType;

    @Schema(description = "第三方交易号")
    private String tradeNo;

    @Schema(description = "状态: pending, paid, cancelled, refunded")
    private String status;

    @Schema(description = "支付时间")
    private LocalDateTime paidAt;

    @Schema(description = "过期时间")
    private LocalDateTime expiredAt;
}
