package com.interview.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.interview.entity.UserAction;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户行为Mapper
 */
@Mapper
public interface UserActionMapper extends BaseMapper<UserAction> {
}
