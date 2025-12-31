package com.interview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 帖子DTO
 */
@Data
@Schema(description = "帖子请求")
public class PostDTO {

    @NotBlank(message = "内容不能为空")
    @Schema(description = "内容")
    private String content;

    @Schema(description = "图片列表")
    private List<String> images;

    @NotBlank(message = "类型不能为空")
    @Schema(description = "类型: experience, knowledge, question, discussion")
    private String type;
}
