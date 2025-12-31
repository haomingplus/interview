package com.interview.common;

import lombok.Getter;

/**
 * 响应状态码枚举
 */
@Getter
public enum ResultCode {

    SUCCESS(200, "操作成功"),
    ERROR(500, "操作失败"),

    // 认证相关 401xx
    UNAUTHORIZED(40100, "未登录或token已过期"),
    TOKEN_INVALID(40101, "token无效"),
    TOKEN_EXPIRED(40102, "token已过期"),
    LOGIN_FAILED(40103, "用户名或密码错误"),
    ACCOUNT_DISABLED(40104, "账号已被禁用"),
    ACCOUNT_LOCKED(40105, "账号已被锁定"),

    // 权限相关 403xx
    FORBIDDEN(40300, "没有权限访问"),
    ACCESS_DENIED(40301, "访问被拒绝"),

    // 请求相关 400xx
    BAD_REQUEST(40000, "请求参数错误"),
    NOT_FOUND(40400, "资源不存在"),
    METHOD_NOT_ALLOWED(40500, "请求方法不支持"),

    // 业务相关 500xx
    USER_EXIST(50001, "用户已存在"),
    USER_NOT_EXIST(50002, "用户不存在"),
    PASSWORD_ERROR(50003, "密码错误"),
    CODE_ERROR(50004, "验证码错误"),
    CODE_EXPIRED(50005, "验证码已过期"),
    PHONE_EXIST(50006, "手机号已被注册"),
    EMAIL_EXIST(50007, "邮箱已被注册"),

    // 文件相关
    FILE_UPLOAD_ERROR(50100, "文件上传失败"),
    FILE_TYPE_ERROR(50101, "文件类型不支持"),
    FILE_SIZE_ERROR(50102, "文件大小超出限制"),

    // 支付相关
    PAY_ERROR(50200, "支付失败"),
    ORDER_NOT_EXIST(50201, "订单不存在"),
    ORDER_EXPIRED(50202, "订单已过期");

    private final Integer code;
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
