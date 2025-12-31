package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 学习计划VO
 */
@Data
@Schema(description = "学习计划信息")
public class StudyPlanVO {

    @Schema(description = "ID")
    private Long id;

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

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
