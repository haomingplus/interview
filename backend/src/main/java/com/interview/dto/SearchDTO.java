package com.interview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

/**
 * 搜索请求DTO
 */
@Data
@Schema(description = "搜索请求")
public class SearchDTO {

    @Schema(description = "关键词")
    private String keyword;

    @Schema(description = "分类")
    private String category;

    @Schema(description = "难度")
    private String difficulty;

    @Schema(description = "标签")
    private List<String> tags;

    @Schema(description = "页码", example = "1")
    private Integer page = 1;

    @Schema(description = "每页数量", example = "10")
    private Integer pageSize = 10;

    @Schema(description = "排序字段")
    private String sortBy;

    @Schema(description = "排序方式: asc, desc")
    private String sortOrder = "desc";
}
