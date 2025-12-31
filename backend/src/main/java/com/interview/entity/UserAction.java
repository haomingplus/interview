package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户收藏/点赞关联表
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_action")
@Schema(description = "用户行为记录")
public class UserAction extends BaseEntity {

    @Schema(description = "用户ID")
    private Long userId;

    @Schema(description = "目标ID")
    private Long targetId;

    @Schema(description = "目标类型: knowledge, question, post")
    private String targetType;

    @Schema(description = "行为类型: like, collect, solve")
    private String actionType;
}
