package com.interview.controller;

import com.interview.common.Result;
import com.interview.dto.StudyPlanDTO;
import com.interview.security.CustomUserDetails;
import com.interview.service.StudyService;
import com.interview.vo.StudyPlanVO;
import com.interview.vo.StudyRecordVO;
import com.interview.vo.StudyStatsVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 学习控制器
 */
@Tag(name = "学习管理", description = "学习计划和记录相关接口")
@RestController
@RequestMapping("/study")
@RequiredArgsConstructor
public class StudyController {

    private final StudyService studyService;

    // ========== 学习计划 ==========

    @Operation(summary = "获取所有学习计划")
    @GetMapping("/plans")
    public Result<List<StudyPlanVO>> getPlans(
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.getPlans(user.getId()));
    }

    @Operation(summary = "获取学习计划详情")
    @GetMapping("/plans/{id}")
    public Result<StudyPlanVO> getPlanById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.getPlanById(id, user.getId()));
    }

    @Operation(summary = "创建学习计划")
    @PostMapping("/plans")
    public Result<StudyPlanVO> createPlan(
            @Valid @RequestBody StudyPlanDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.createPlan(dto, user.getId()));
    }

    @Operation(summary = "更新学习计划")
    @PutMapping("/plans/{id}")
    public Result<StudyPlanVO> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody StudyPlanDTO dto,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.updatePlan(id, dto, user.getId()));
    }

    @Operation(summary = "删除学习计划")
    @DeleteMapping("/plans/{id}")
    public Result<Void> deletePlan(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        studyService.deletePlan(id, user.getId());
        return Result.success();
    }

    @Operation(summary = "更新计划状态")
    @PutMapping("/plans/{id}/status")
    public Result<Void> updatePlanStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails user) {
        studyService.updatePlanStatus(id, body.get("status"), user.getId());
        return Result.success();
    }

    @Operation(summary = "更新计划进度")
    @PutMapping("/plans/{id}/progress")
    public Result<Void> updatePlanProgress(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal CustomUserDetails user) {
        studyService.updatePlanProgress(id, body.get("progress"), user.getId());
        return Result.success();
    }

    // ========== 学习记录 ==========

    @Operation(summary = "获取今日学习记录")
    @GetMapping("/today")
    public Result<StudyRecordVO> getTodayRecord(
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.getTodayRecord(user.getId()));
    }

    @Operation(summary = "打卡")
    @PostMapping("/check-in")
    public Result<StudyRecordVO> checkIn(
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.checkIn(user.getId()));
    }

    @Operation(summary = "获取学习记录")
    @GetMapping("/records")
    public Result<List<StudyRecordVO>> getRecords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.getRecords(user.getId(), startDate, endDate));
    }

    @Operation(summary = "更新学习时长")
    @PostMapping("/time")
    public Result<Void> updateStudyTime(
            @RequestBody Map<String, Integer> body,
            @AuthenticationPrincipal CustomUserDetails user) {
        studyService.updateStudyTime(user.getId(), body.get("minutes"));
        return Result.success();
    }

    // ========== 统计 ==========

    @Operation(summary = "获取学习统计")
    @GetMapping("/stats")
    public Result<StudyStatsVO> getStats(
            @AuthenticationPrincipal CustomUserDetails user) {
        return Result.success(studyService.getStats(user.getId()));
    }
}
