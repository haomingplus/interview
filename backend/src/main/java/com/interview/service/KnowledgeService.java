package com.interview.service;

import com.interview.common.PageResult;
import com.interview.dto.KnowledgeDTO;
import com.interview.dto.SearchDTO;
import com.interview.vo.KnowledgeVO;

/**
 * 知识点服务接口
 */
public interface KnowledgeService {

    /**
     * 分页查询
     */
    PageResult<KnowledgeVO> getPage(SearchDTO dto, Long userId);

    /**
     * 获取详情
     */
    KnowledgeVO getById(Long id, Long userId);

    /**
     * 创建
     */
    KnowledgeVO create(KnowledgeDTO dto, Long authorId);

    /**
     * 更新
     */
    KnowledgeVO update(Long id, KnowledgeDTO dto, Long userId);

    /**
     * 删除
     */
    void delete(Long id, Long userId);

    /**
     * 点赞/取消点赞
     */
    void toggleLike(Long id, Long userId);

    /**
     * 收藏/取消收藏
     */
    void toggleCollect(Long id, Long userId);
}
