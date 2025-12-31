package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.StudyPlan;
import org.apache.ibatis.annotations.Mapper;

/**
 * 学习计划Mapper
 */
@Mapper
public interface StudyPlanMapper extends BaseMapper<StudyPlan> {
}
