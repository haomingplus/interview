package com.interview.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 支付信息VO
 */
@Data
@Schema(description = "支付信息")
public class PaymentVO {

    @Schema(description = "订单号")
    private String orderNo;

    @Schema(description = "支付方式")
    private String payType;

    @Schema(description = "支付参数(H5支付URL或Native支付二维码链接)")
    private String payUrl;

    @Schema(description = "二维码内容(用于生成二维码)")
    private String qrCode;

    @Schema(description = "支付宝表单(用于网页支付)")
    private String form;
}
