package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 学习统计VO
 */
@Data
@Schema(description = "学习统计信息")
public class StudyStatsVO {

    @Schema(description = "总学习天数")
    private Integer totalDays;

    @Schema(description = "总学习时长(分钟)")
    private Integer totalTime;

    @Schema(description = "总学习知识点数")
    private Integer totalKnowledge;

    @Schema(description = "总刷题数")
    private Integer totalQuestions;

    @Schema(description = "连续打卡天数")
    private Integer streak;
}
