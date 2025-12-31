package com.interview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

/**
 * 题目DTO
 */
@Data
@Schema(description = "题目请求")
public class QuestionDTO {

    @NotBlank(message = "标题不能为空")
    @Schema(description = "标题")
    private String title;

    @NotBlank(message = "内容不能为空")
    @Schema(description = "题目内容(Markdown)")
    private String content;

    @Schema(description = "参考答案(Markdown)")
    private String answer;

    @NotBlank(message = "分类不能为空")
    @Schema(description = "分类")
    private String category;

    @Schema(description = "难度: easy, medium, hard")
    private String difficulty;

    @Schema(description = "标签")
    private List<String> tags;

    @Schema(description = "来源公司")
    private String company;

    @Schema(description = "题目来源")
    private String source;
}
