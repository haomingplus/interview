package com.interview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 创建订单DTO
 */
@Data
@Schema(description = "创建订单请求")
public class CreateOrderDTO {

    @NotNull(message = "产品ID不能为空")
    @Schema(description = "产品ID")
    private Long productId;

    @NotBlank(message = "支付方式不能为空")
    @Schema(description = "支付方式: wechat, alipay")
    private String payType;
}
