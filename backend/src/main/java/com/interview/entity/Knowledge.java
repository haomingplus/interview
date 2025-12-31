package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 知识点实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("knowledge")
@Schema(description = "知识点")
public class Knowledge extends BaseEntity {

    @Schema(description = "标题")
    private String title;

    @Schema(description = "内容(Markdown)")
    private String content;

    @Schema(description = "分类")
    private String category;

    @Schema(description = "标签(JSON数组)")
    private String tags;

    @Schema(description = "难度: easy, medium, hard")
    private String difficulty;

    @Schema(description = "浏览次数")
    private Integer viewCount;

    @Schema(description = "点赞数")
    private Integer likeCount;

    @Schema(description = "收藏数")
    private Integer collectCount;

    @Schema(description = "作者ID")
    private Long authorId;

    @Schema(description = "状态: 0-草稿, 1-发布")
    private Integer status;
}
