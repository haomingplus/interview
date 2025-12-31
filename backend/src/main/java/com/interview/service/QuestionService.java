package com.interview.service;

import com.interview.common.PageResult;
import com.interview.dto.QuestionDTO;
import com.interview.dto.SearchDTO;
import com.interview.vo.QuestionVO;

/**
 * 题目服务接口
 */
public interface QuestionService {

    PageResult<QuestionVO> getPage(SearchDTO dto, Long userId);

    QuestionVO getById(Long id, Long userId);

    QuestionVO create(QuestionDTO dto, Long authorId);

    QuestionVO update(Long id, QuestionDTO dto, Long userId);

    void delete(Long id, Long userId);

    void toggleLike(Long id, Long userId);

    void toggleCollect(Long id, Long userId);

    void markSolved(Long id, Long userId);
}
