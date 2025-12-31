package com.interview.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 支付配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "payment")
public class PaymentConfig {

    private WeChatConfig wechat = new WeChatConfig();
    private AlipayConfig alipay = new AlipayConfig();

    @Data
    public static class WeChatConfig {
        private String appId;
        private String mchId;
        private String apiKey;
        private String apiKeyV3;
        private String certPath;
        private String notifyUrl;
    }

    @Data
    public static class AlipayConfig {
        private String appId;
        private String privateKey;
        private String publicKey;
        private String notifyUrl;
        private String returnUrl;
        private String gatewayUrl;
        private String charset;
        private String signType;
    }
}
