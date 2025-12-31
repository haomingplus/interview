package com.interview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

/**
 * 学习计划DTO
 */
@Data
@Schema(description = "学习计划请求")
public class StudyPlanDTO {

    @NotBlank(message = "计划标题不能为空")
    @Schema(description = "计划标题")
    private String title;

    @Schema(description = "计划描述")
    private String description;

    @NotNull(message = "开始日期不能为空")
    @Schema(description = "开始日期")
    private LocalDate startDate;

    @Schema(description = "结束日期")
    private LocalDate endDate;
}
