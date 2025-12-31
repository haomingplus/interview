package com.interview.controller;

import com.interview.common.PageResult;
import com.interview.common.Result;
import com.interview.dto.KnowledgeDTO;
import com.interview.dto.SearchDTO;
import com.interview.security.CustomUserDetails;
import com.interview.service.KnowledgeService;
import com.interview.vo.KnowledgeVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 知识点控制器
 */
@Tag(name = "知识库", description = "知识点相关接口")
@RestController
@RequestMapping("/knowledge")
@RequiredArgsConstructor
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @Operation(summary = "分页查询知识点")
    @GetMapping
    public Result<PageResult<KnowledgeVO>> getPage(
            SearchDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user != null ? user.getId() : null;
        return Result.success(knowledgeService.getPage(dto, userId));
    }

    @Operation(summary = "获取知识点详情")
    @GetMapping("/{id}")
    public Result<KnowledgeVO> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user != null ? user.getId() : null;
        return Result.success(knowledgeService.getById(id, userId));
    }

    @Operation(summary = "创建知识点")
    @PostMapping
    public Result<KnowledgeVO> create(
            @Valid @RequestBody KnowledgeDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(knowledgeService.create(dto, user.getId()));
    }

    @Operation(summary = "更新知识点")
    @PutMapping("/{id}")
    public Result<KnowledgeVO> update(
            @PathVariable Long id,
            @Valid @RequestBody KnowledgeDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(knowledgeService.update(id, dto, user.getId()));
    }

    @Operation(summary = "删除知识点")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        knowledgeService.delete(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "点赞/取消点赞")
    @PostMapping("/{id}/like")
    public Result<Void> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        knowledgeService.toggleLike(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "收藏/取消收藏")
    @PostMapping("/{id}/collect")
    public Result<Void> toggleCollect(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        knowledgeService.toggleCollect(id, user.getId());
        return Result.success();
    }
}
