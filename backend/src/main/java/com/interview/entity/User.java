package com.interview.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.interview.common.BaseEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user")
@Schema(description = "用户")
public class User extends BaseEntity {

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "密码")
    private String password;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "个人简介")
    private String bio;

    @Schema(description = "角色: user, vip, admin")
    private String role;

    @Schema(description = "状态: 0-禁用, 1-正常")
    private Integer status;

    @Schema(description = "学习天数")
    private Integer studyDays;

    @Schema(description = "总学习时长(分钟)")
    private Integer totalStudyTime;

    @Schema(description = "已解决题目数")
    private Integer questionsSolved;
}
