package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * VIP产品VO
 */
@Data
@Schema(description = "VIP产品信息")
public class VipProductVO {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "产品名称")
    private String name;

    @Schema(description = "类型")
    private String type;

    @Schema(description = "价格")
    private BigDecimal price;

    @Schema(description = "原价")
    private BigDecimal originalPrice;

    @Schema(description = "有效期天数")
    private Integer durationDays;

    @Schema(description = "描述")
    private String description;

    @Schema(description = "功能特性")
    private List<String> features;

    @Schema(description = "折扣百分比")
    private Integer discountPercent;
}
