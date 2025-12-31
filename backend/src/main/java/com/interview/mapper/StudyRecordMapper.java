package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.StudyRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 学习记录Mapper
 */
@Mapper
public interface StudyRecordMapper extends BaseMapper<StudyRecord> {
}
