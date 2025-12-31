package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.LoginDTO;
import com.interview.dto.RegisterDTO;
import com.interview.service.AuthService;
import com.interview.vo.LoginVO;
import com.interview.vo.UserVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@Tag(name = "认证", description = "登录注册相关接口")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "用户登录")
    @PostMapping("/login")
    public Result<LoginVO> login(@Valid @RequestBody LoginDTO dto) {
        return Result.success(authService.login(dto));
    }

    @Operation(summary = "用户注册")
    @PostMapping("/register")
    public Result<UserVO> register(@Valid @RequestBody RegisterDTO dto) {
        return Result.success(authService.register(dto));
    }

    @Operation(summary = "刷新令牌")
    @PostMapping("/refresh")
    public Result<LoginVO> refreshToken(@RequestParam String refreshToken) {
        return Result.success(authService.refreshToken(refreshToken));
    }

    @Operation(summary = "发送验证码")
    @PostMapping("/send-code")
    public Result<Void> sendCode(@RequestParam String phone) {
        authService.sendCode(phone);
        return Result.success();
    }

    @Operation(summary = "手机号登录")
    @PostMapping("/login-phone")
    public Result<LoginVO> loginByPhone(@RequestParam String phone, @RequestParam String code) {
        return Result.success(authService.loginByPhone(phone, code));
    }
}
