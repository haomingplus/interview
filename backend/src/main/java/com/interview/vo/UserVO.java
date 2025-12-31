package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户VO
 */
@Data
@Schema(description = "用户信息")
public class UserVO {

    @Schema(description = "用户ID")
    private Long id;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "头像")
    private String avatar;

    @Schema(description = "个人简介")
    private String bio;

    @Schema(description = "角色")
    private String role;

    @Schema(description = "学习天数")
    private Integer studyDays;

    @Schema(description = "总学习时长")
    private Integer totalStudyTime;

    @Schema(description = "已解决题目数")
    private Integer questionsSolved;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
}
