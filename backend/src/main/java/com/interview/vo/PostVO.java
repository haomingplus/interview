package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 帖子VO
 */
@Data
@Schema(description = "帖子信息")
public class PostVO {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "内容")
    private String content;

    @Schema(description = "图片列表")
    private List<String> images;

    @Schema(description = "类型")
    private String type;

    @Schema(description = "作者信息")
    private UserVO author;

    @Schema(description = "点赞数")
    private Integer likeCount;

    @Schema(description = "评论数")
    private Integer commentCount;

    @Schema(description = "分享数")
    private Integer shareCount;

    @Schema(description = "是否已点赞")
    private Boolean isLiked;

    @Schema(description = "是否已收藏")
    private Boolean isCollected;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
