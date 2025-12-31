package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 社区帖子实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("post")
@Schema(description = "帖子")
public class Post extends BaseEntity {

    @Schema(description = "内容")
    private String content;

    @Schema(description = "图片(JSON数组)")
    private String images;

    @Schema(description = "类型: experience, knowledge, question, discussion")
    private String type;

    @Schema(description = "作者ID")
    private Long authorId;

    @Schema(description = "点赞数")
    private Integer likeCount;

    @Schema(description = "评论数")
    private Integer commentCount;

    @Schema(description = "分享数")
    private Integer shareCount;

    @Schema(description = "状态: 0-删除, 1-正常")
    private Integer status;
}
