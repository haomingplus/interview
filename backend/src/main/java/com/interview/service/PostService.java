package com.interview.service;

import com.interview.common.PageResult;
import com.interview.dto.PostDTO;
import com.interview.dto.SearchDTO;
import com.interview.vo.PostVO;

/**
 * 帖子服务接口
 */
public interface PostService {

    PageResult<PostVO> getPage(SearchDTO dto, Long userId);

    PostVO getById(Long id, Long userId);

    PostVO create(PostDTO dto, Long authorId);

    void delete(Long id, Long userId);

    void toggleLike(Long id, Long userId);

    void toggleCollect(Long id, Long userId);
}
