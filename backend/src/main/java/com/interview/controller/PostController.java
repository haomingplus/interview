package com.interview.controller;

import com.interview.common.PageResult;
import com.interview.common.Result;
import com.interview.dto.PostDTO;
import com.interview.dto.SearchDTO;
import com.interview.security.CustomUserDetails;
import com.interview.service.PostService;
import com.interview.vo.PostVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * 社区帖子控制器
 */
@Tag(name = "社区", description = "社区帖子相关接口")
@RestController
@RequestMapping("/community/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @Operation(summary = "分页查询帖子")
    @GetMapping
    public Result<PageResult<PostVO>> getPage(
            SearchDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user != null ? user.getId() : null;
        return Result.success(postService.getPage(dto, userId));
    }

    @Operation(summary = "获取帖子详情")
    @GetMapping("/{id}")
    public Result<PostVO> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user != null ? user.getId() : null;
        return Result.success(postService.getById(id, userId));
    }

    @Operation(summary = "发布帖子")
    @PostMapping
    public Result<PostVO> create(
            @Valid @RequestBody PostDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(postService.create(dto, user.getId()));
    }

    @Operation(summary = "删除帖子")
    @DeleteMapping("/{id}")
    public Result<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        postService.delete(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "点赞/取消点赞")
    @PostMapping("/{id}/like")
    public Result<Void> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        postService.toggleLike(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "收藏/取消收藏")
    @PostMapping("/{id}/collect")
    public Result<Void> toggleCollect(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        postService.toggleCollect(id, user.getId());
        return Result.success();
    }
}
