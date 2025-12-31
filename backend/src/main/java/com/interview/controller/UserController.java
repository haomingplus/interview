package com.interview.controller;

import cn.hutool.core.bean.BeanUtil;
import com.interview.common.Result;
import com.interview.entity.User;
import com.interview.mapper.UserMapper;
import com.interview.security.CustomUserDetails;
import com.interview.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@Tag(name = "用户", description = "用户相关接口")
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserMapper userMapper;

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/profile")
    public Result<UserVO> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        User entity = userMapper.selectById(user.getId());
        UserVO vo = new UserVO();
        BeanUtil.copyProperties(entity, vo);
        return Result.success(vo);
    }

    @Operation(summary = "更新用户信息")
    @PutMapping("/profile")
    public Result<UserVO> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestBody UserVO dto) {
        User entity = userMapper.selectById(user.getId());
        if (dto.getNickname() != null) entity.setNickname(dto.getNickname());
        if (dto.getAvatar() != null) entity.setAvatar(dto.getAvatar());
        if (dto.getBio() != null) entity.setBio(dto.getBio());
        userMapper.updateById(entity);

        UserVO vo = new UserVO();
        BeanUtil.copyProperties(entity, vo);
        return Result.success(vo);
    }
}
