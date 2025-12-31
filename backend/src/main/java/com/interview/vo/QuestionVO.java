package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 题目VO
 */
@Data
@Schema(description = "题目信息")
public class QuestionVO {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "标题")
    private String title;

    @Schema(description = "题目内容")
    private String content;

    @Schema(description = "参考答案")
    private String answer;

    @Schema(description = "分类")
    private String category;

    @Schema(description = "难度")
    private String difficulty;

    @Schema(description = "标签")
    private List<String> tags;

    @Schema(description = "来源公司")
    private String company;

    @Schema(description = "题目来源")
    private String source;

    @Schema(description = "浏览次数")
    private Integer viewCount;

    @Schema(description = "点赞数")
    private Integer likeCount;

    @Schema(description = "收藏数")
    private Integer collectCount;

    @Schema(description = "是否已点赞")
    private Boolean isLiked;

    @Schema(description = "是否已收藏")
    private Boolean isCollected;

    @Schema(description = "是否已解决")
    private Boolean isSolved;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
