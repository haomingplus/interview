package com.interview.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.RandomUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.interview.common.ResultCode;
import com.interview.dto.LoginDTO;
import com.interview.dto.RegisterDTO;
import com.interview.entity.User;
import com.interview.exception.BusinessException;
import com.interview.mapper.UserMapper;
import com.interview.security.JwtTokenProvider;
import com.interview.service.AuthService;
import com.interview.vo.LoginVO;
import com.interview.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String SMS_CODE_PREFIX = "sms:code:";

    @Override
    public LoginVO login(LoginDTO dto) {
        // 认证
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword()));

        // 生成令牌
        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(dto.getUsername());

        // 获取用户信息
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>()
                        .eq(User::getUsername, dto.getUsername())
                        .or()
                        .eq(User::getEmail, dto.getUsername())
                        .or()
                        .eq(User::getPhone, dto.getUsername()));

        // 构建响应
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setRefreshToken(refreshToken);
        vo.setUser(toUserVO(user));

        return vo;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVO register(RegisterDTO dto) {
        // 检查用户名是否存在
        Long count = userMapper.selectCount(
                new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()));
        if (count > 0) {
            throw new BusinessException(ResultCode.USER_EXIST);
        }

        // 检查邮箱是否存在
        count = userMapper.selectCount(
                new LambdaQueryWrapper<User>().eq(User::getEmail, dto.getEmail()));
        if (count > 0) {
            throw new BusinessException(ResultCode.EMAIL_EXIST);
        }

        // 创建用户
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getUsername());
        user.setRole("user");
        user.setStatus(1);
        user.setStudyDays(0);
        user.setTotalStudyTime(0);
        user.setQuestionsSolved(0);

        userMapper.insert(user);

        return toUserVO(user);
    }

    @Override
    public LoginVO refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BusinessException(ResultCode.TOKEN_INVALID);
        }

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String newToken = jwtTokenProvider.generateToken(username);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(username);

        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, username));

        LoginVO vo = new LoginVO();
        vo.setToken(newToken);
        vo.setRefreshToken(newRefreshToken);
        vo.setUser(toUserVO(user));

        return vo;
    }

    @Override
    public void sendCode(String phone) {
        // 生成6位验证码
        String code = RandomUtil.randomNumbers(6);

        // 存储到Redis，5分钟有效
        redisTemplate.opsForValue().set(SMS_CODE_PREFIX + phone, code, 5, TimeUnit.MINUTES);

        // TODO: 调用阿里云短信服务发送验证码
        log.info("发送验证码到 {}: {}", phone, code);
    }

    @Override
    public LoginVO loginByPhone(String phone, String code) {
        // 验证验证码
        String cachedCode = (String) redisTemplate.opsForValue().get(SMS_CODE_PREFIX + phone);
        if (cachedCode == null || !cachedCode.equals(code)) {
            throw new BusinessException(ResultCode.CODE_ERROR);
        }

        // 删除验证码
        redisTemplate.delete(SMS_CODE_PREFIX + phone);

        // 查找用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getPhone, phone));

        if (user == null) {
            // 自动注册
            user = new User();
            user.setUsername("user_" + phone.substring(7));
            user.setPhone(phone);
            user.setNickname("用户" + phone.substring(7));
            user.setRole("user");
            user.setStatus(1);
            user.setStudyDays(0);
            user.setTotalStudyTime(0);
            user.setQuestionsSolved(0);
            userMapper.insert(user);
        }

        // 生成令牌
        String token = jwtTokenProvider.generateToken(user.getUsername());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setRefreshToken(refreshToken);
        vo.setUser(toUserVO(user));

        return vo;
    }

    private UserVO toUserVO(User user) {
        UserVO vo = new UserVO();
        BeanUtil.copyProperties(user, vo);
        return vo;
    }
}
