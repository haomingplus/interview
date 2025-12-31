package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

/**
 * 学习记录实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("study_record")
@Schema(description = "学习记录")
public class StudyRecord extends BaseEntity {

    @Schema(description = "用户ID")
    private Long userId;

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
