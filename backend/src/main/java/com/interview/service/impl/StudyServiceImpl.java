package com.interview.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.interview.common.ResultCode;
import com.interview.dto.StudyPlanDTO;
import com.interview.entity.StudyPlan;
import com.interview.entity.StudyRecord;
import com.interview.entity.User;
import com.interview.exception.BusinessException;
import com.interview.mapper.StudyPlanMapper;
import com.interview.mapper.StudyRecordMapper;
import com.interview.mapper.UserMapper;
import com.interview.service.StudyService;
import com.interview.vo.StudyPlanVO;
import com.interview.vo.StudyRecordVO;
import com.interview.vo.StudyStatsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 学习服务实现
 */
@Service
@RequiredArgsConstructor
public class StudyServiceImpl implements StudyService {

    private final StudyPlanMapper studyPlanMapper;
    private final StudyRecordMapper studyRecordMapper;
    private final UserMapper userMapper;

    // ========== 学习计划相关 ==========

    @Override
    public List<StudyPlanVO> getPlans(Long userId) {
        List<StudyPlan> plans = studyPlanMapper.selectList(
                new LambdaQueryWrapper<StudyPlan>()
                        .eq(StudyPlan::getUserId, userId)
                        .orderByDesc(StudyPlan::getCreatedAt));

        return plans.stream()
                .map(this::toVO)
                .collect(Collectors.toList());
    }

    @Override
    public StudyPlanVO getPlanById(Long id, Long userId) {
        StudyPlan plan = studyPlanMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!plan.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }
        return toVO(plan);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StudyPlanVO createPlan(StudyPlanDTO dto, Long userId) {
        StudyPlan plan = new StudyPlan();
        BeanUtil.copyProperties(dto, plan);
        plan.setUserId(userId);
        plan.setStatus("active");
        plan.setProgress(0);

        studyPlanMapper.insert(plan);

        return toVO(plan);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StudyPlanVO updatePlan(Long id, StudyPlanDTO dto, Long userId) {
        StudyPlan plan = studyPlanMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!plan.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        BeanUtil.copyProperties(dto, plan);
        studyPlanMapper.updateById(plan);

        return toVO(plan);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deletePlan(Long id, Long userId) {
        StudyPlan plan = studyPlanMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!plan.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        studyPlanMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePlanStatus(Long id, String status, Long userId) {
        StudyPlan plan = studyPlanMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!plan.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        plan.setStatus(status);
        studyPlanMapper.updateById(plan);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePlanProgress(Long id, Integer progress, Long userId) {
        StudyPlan plan = studyPlanMapper.selectById(id);
        if (plan == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!plan.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        plan.setProgress(Math.min(100, Math.max(0, progress)));
        if (progress >= 100) {
            plan.setStatus("completed");
        }
        studyPlanMapper.updateById(plan);
    }

    // ========== 学习记录相关 ==========

    @Override
    public StudyRecordVO getTodayRecord(Long userId) {
        StudyRecord record = getOrCreateTodayRecord(userId);
        return toRecordVO(record);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public StudyRecordVO checkIn(Long userId) {
        StudyRecord record = getOrCreateTodayRecord(userId);

        if (!record.getCheckedIn()) {
            record.setCheckedIn(true);
            studyRecordMapper.updateById(record);

            // 更新用户学习天数
            User user = userMapper.selectById(userId);
            if (user != null) {
                user.setStudyDays(user.getStudyDays() + 1);
                userMapper.updateById(user);
            }
        }

        return toRecordVO(record);
    }

    @Override
    public List<StudyRecordVO> getRecords(Long userId, LocalDate startDate, LocalDate endDate) {
        List<StudyRecord> records = studyRecordMapper.selectList(
                new LambdaQueryWrapper<StudyRecord>()
                        .eq(StudyRecord::getUserId, userId)
                        .ge(StudyRecord::getDate, startDate)
                        .le(StudyRecord::getDate, endDate)
                        .orderByAsc(StudyRecord::getDate));

        return records.stream()
                .map(this::toRecordVO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStudyTime(Long userId, Integer minutes) {
        StudyRecord record = getOrCreateTodayRecord(userId);
        record.setStudyTime(record.getStudyTime() + minutes);
        studyRecordMapper.updateById(record);

        // 更新用户总学习时长
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setTotalStudyTime(user.getTotalStudyTime() + minutes);
            userMapper.updateById(user);
        }
    }

    // ========== 统计相关 ==========

    @Override
    public StudyStatsVO getStats(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }

        StudyStatsVO stats = new StudyStatsVO();
        stats.setTotalDays(user.getStudyDays());
        stats.setTotalTime(user.getTotalStudyTime());
        stats.setTotalQuestions(user.getQuestionsSolved());

        // 计算总知识点数(从记录中统计)
        List<StudyRecord> allRecords = studyRecordMapper.selectList(
                new LambdaQueryWrapper<StudyRecord>()
                        .eq(StudyRecord::getUserId, userId));
        int totalKnowledge = allRecords.stream()
                .mapToInt(r -> r.getKnowledgeCount() != null ? r.getKnowledgeCount() : 0)
                .sum();
        stats.setTotalKnowledge(totalKnowledge);

        // 计算连续打卡天数
        stats.setStreak(calculateStreak(userId));

        return stats;
    }

    // ========== 私有方法 ==========

    private StudyRecord getOrCreateTodayRecord(Long userId) {
        LocalDate today = LocalDate.now();
        StudyRecord record = studyRecordMapper.selectOne(
                new LambdaQueryWrapper<StudyRecord>()
                        .eq(StudyRecord::getUserId, userId)
                        .eq(StudyRecord::getDate, today));

        if (record == null) {
            record = new StudyRecord();
            record.setUserId(userId);
            record.setDate(today);
            record.setStudyTime(0);
            record.setKnowledgeCount(0);
            record.setQuestionCount(0);
            record.setCheckedIn(false);
            studyRecordMapper.insert(record);
        }

        return record;
    }

    private int calculateStreak(Long userId) {
        LocalDate today = LocalDate.now();
        int streak = 0;
        LocalDate checkDate = today;

        while (true) {
            StudyRecord record = studyRecordMapper.selectOne(
                    new LambdaQueryWrapper<StudyRecord>()
                            .eq(StudyRecord::getUserId, userId)
                            .eq(StudyRecord::getDate, checkDate)
                            .eq(StudyRecord::getCheckedIn, true));

            if (record != null) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else {
                break;
            }
        }

        return streak;
    }

    private StudyPlanVO toVO(StudyPlan plan) {
        StudyPlanVO vo = new StudyPlanVO();
        BeanUtil.copyProperties(plan, vo);
        return vo;
    }

    private StudyRecordVO toRecordVO(StudyRecord record) {
        StudyRecordVO vo = new StudyRecordVO();
        BeanUtil.copyProperties(record, vo);
        return vo;
    }
}
