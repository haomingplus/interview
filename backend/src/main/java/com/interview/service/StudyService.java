package com.interview.service;

import com.interview.dto.StudyPlanDTO;
import com.interview.vo.StudyPlanVO;
import com.interview.vo.StudyRecordVO;
import com.interview.vo.StudyStatsVO;

import java.time.LocalDate;
import java.util.List;

/**
 * 学习服务接口
 */
public interface StudyService {

    // 学习计划相关
    List<StudyPlanVO> getPlans(Long userId);

    StudyPlanVO getPlanById(Long id, Long userId);

    StudyPlanVO createPlan(StudyPlanDTO dto, Long userId);

    StudyPlanVO updatePlan(Long id, StudyPlanDTO dto, Long userId);

    void deletePlan(Long id, Long userId);

    void updatePlanStatus(Long id, String status, Long userId);

    void updatePlanProgress(Long id, Integer progress, Long userId);

    // 学习记录相关
    StudyRecordVO getTodayRecord(Long userId);

    StudyRecordVO checkIn(Long userId);

    List<StudyRecordVO> getRecords(Long userId, LocalDate startDate, LocalDate endDate);

    void updateStudyTime(Long userId, Integer minutes);

    // 统计相关
    StudyStatsVO getStats(Long userId);
}
