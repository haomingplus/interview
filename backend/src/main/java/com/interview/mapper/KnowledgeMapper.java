package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.Knowledge;
import org.apache.ibatis.annotations.Mapper;

/**
 * 知识点Mapper
 */
@Mapper
public interface KnowledgeMapper extends BaseMapper<Knowledge> {
}
