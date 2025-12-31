package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * VIP产品实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("vip_product")
@Schema(description = "VIP产品")
public class VipProduct extends BaseEntity {

    @Schema(description = "产品名称")
    private String name;

    @Schema(description = "类型: monthly, yearly, lifetime")
    private String type;

    @Schema(description = "价格")
    private BigDecimal price;

    @Schema(description = "原价")
    private BigDecimal originalPrice;

    @Schema(description = "有效期天数")
    private Integer durationDays;

    @Schema(description = "描述")
    private String description;

    @Schema(description = "功能特性(JSON)")
    private String features;

    @Schema(description = "排序")
    private Integer sort;

    @Schema(description = "状态: 0-下架, 1-上架")
    private Integer status;
}
