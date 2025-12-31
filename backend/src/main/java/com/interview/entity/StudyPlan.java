package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

/**
 * 学习计划实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("study_plan")
@Schema(description = "学习计划")
public class StudyPlan extends BaseEntity {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "计划标题")
    private String title;

    @Schema(description = "计划描述")
    private String description;

    @Schema(description = "开始日期")
    private LocalDate startDate;

    @Schema(description = "结束日期")
    private LocalDate endDate;

    @Schema(description = "状态: active, completed, paused")
    private String status;

    @Schema(description = "进度百分比")
    private Integer progress;
}
