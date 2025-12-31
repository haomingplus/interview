package com.interview.controller;

import com.interview.common.PageResult;
import com.interview.common.Result;
import com.interview.dto.QuestionDTO;
import com.interview.dto.SearchDTO;
import com.interview.security.CustomUserDetails;
import com.interview.service.QuestionService;
import com.interview.vo.QuestionVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "题库", description = "题目相关接口")
@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @Operation(summary = "分页查询题目")
    @GetMapping
    public Result<PageResult<QuestionVO>> getPage(
            SearchDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user != null ? user.getId() : null;
        return Result.success(questionService.getPage(dto, userId));
    }

    @Operation(summary = "获取题目详情")
    @GetMapping("/{id}")
    public Result<QuestionVO> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user != null ? user.getId() : null;
        return Result.success(questionService.getById(id, userId));
    }

    @Operation(summary = "创建题目")
    @PostMapping
    public Result<QuestionVO> create(
            @Valid @RequestBody QuestionDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(questionService.create(dto, user.getId()));
    }

    @Operation(summary = "更新题目")
    @PutMapping("/{id}")
    public Result<QuestionVO> update(
            @PathVariable Long id,
            @Valid @RequestBody QuestionDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(questionService.update(id, dto, user.getId()));
    }

    @Operation(summary = "删除题目")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        questionService.delete(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "点赞/取消点赞")
    @PostMapping("/{id}/like")
    public Result<Void> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        questionService.toggleLike(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "收藏/取消收藏")
    @PostMapping("/{id}/collect")
    public Result<Void> toggleCollect(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        questionService.toggleCollect(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "标记为已解决")
    @PostMapping("/{id}/solved")
    public Result<Void> markSolved(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        questionService.markSolved(id, user.getId());
        return Result.success();
    }
}
