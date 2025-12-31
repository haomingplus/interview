package com.interview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 知识点DTO
 */
@Data
@Schema(description = "知识点请求")
public class KnowledgeDTO {

    @NotBlank(message = "标题不能为空")
    @Schema(description = "标题")
    private String title;

    @NotBlank(message = "内容不能为空")
    @Schema(description = "内容(Markdown)")
    private String content;

    @NotBlank(message = "分类不能为空")
    @Schema(description = "分类")
    private String category;

    @Schema(description = "标签")
    private List<String> tags;

    @Schema(description = "难度: easy, medium, hard")
    private String difficulty;
}
