package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDate;

/**
 * 学习记录VO
 */
@Data
@Schema(description = "学习记录信息")
public class StudyRecordVO {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "日期")
    private LocalDate date;

    @Schema(description = "学习时长(分钟)")
    private Integer studyTime;

    @Schema(description = "学习知识点数")
    private Integer knowledgeCount;

    @Schema(description = "刷题数")
    private Integer questionCount;

    @Schema(description = "是否打卡")
    private Boolean checkedIn;
}
