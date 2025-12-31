package com.interview.service;

import com.interview.dto.LoginDTO;
import com.interview.dto.RegisterDTO;
import com.interview.vo.LoginVO;
import com.interview.vo.UserVO;

/**
 * 认证服务接口
 */
public interface AuthService {

    /**
     * 用户登录
     */
    LoginVO login(LoginDTO dto);

    /**
     * 用户注册
     */
    UserVO register(RegisterDTO dto);

    /**
     * 刷新令牌
     */
    LoginVO refreshToken(String refreshToken);

    /**
     * 发送验证码
     */
    void sendCode(String phone);

    /**
     * 手机号登录
     */
    LoginVO loginByPhone(String phone, String code);
}
