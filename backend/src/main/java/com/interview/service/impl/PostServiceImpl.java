package com.interview.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.common.PageResult;
import com.interview.common.ResultCode;
import com.interview.dto.PostDTO;
import com.interview.dto.SearchDTO;
import com.interview.entity.Post;
import com.interview.entity.User;
import com.interview.entity.UserAction;
import com.interview.exception.BusinessException;
import com.interview.mapper.PostMapper;
import com.interview.mapper.UserActionMapper;
import com.interview.mapper.UserMapper;
import com.interview.service.PostService;
import com.interview.vo.PostVO;
import com.interview.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 帖子服务实现
 */
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final UserMapper userMapper;
    private final UserActionMapper userActionMapper;

    @Override
    public PageResult<PostVO> getPage(SearchDTO dto, Long userId) {
        Page<Post> page = new Page<>(dto.getPage(), dto.getPageSize());

        LambdaQueryWrapper<Post> wrapper = new LambdaQueryWrapper<Post>()
                .eq(Post::getStatus, 1)
                .like(StringUtils.hasText(dto.getKeyword()), Post::getContent, dto.getKeyword())
                .eq(StringUtils.hasText(dto.getCategory()), Post::getType, dto.getCategory())
                .orderByDesc(Post::getCreatedAt);

        Page<Post> result = postMapper.selectPage(page, wrapper);

        List<PostVO> voList = result.getRecords().stream()
                .map(p -> toVO(p, userId))
                .collect(Collectors.toList());

        return PageResult.of(voList, result);
    }

    @Override
    public PostVO getById(Long id, Long userId) {
        Post post = postMapper.selectById(id);
        if (post == null || post.getStatus() == 0) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return toVO(post, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PostVO create(PostDTO dto, Long authorId) {
        Post post = new Post();
        post.setContent(dto.getContent());
        post.setType(dto.getType());
        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            post.setImages(JSONUtil.toJsonStr(dto.getImages()));
        }
        post.setAuthorId(authorId);
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setShareCount(0);
        post.setStatus(1);

        postMapper.insert(post);

        return toVO(post, authorId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id, Long userId) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!post.getAuthorId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        postMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void toggleLike(Long id, Long userId) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }

        UserAction action = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "post")
                        .eq(UserAction::getActionType, "like"));

        if (action != null) {
            userActionMapper.deleteById(action.getId());
            post.setLikeCount(post.getLikeCount() - 1);
        } else {
            action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("post");
            action.setActionType("like");
            userActionMapper.insert(action);
            post.setLikeCount(post.getLikeCount() + 1);
        }

        postMapper.updateById(post);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void toggleCollect(Long id, Long userId) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }

        UserAction action = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "post")
                        .eq(UserAction::getActionType, "collect"));

        if (action != null) {
            userActionMapper.deleteById(action.getId());
        } else {
            action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("post");
            action.setActionType("collect");
            userActionMapper.insert(action);
        }

        postMapper.updateById(post);
    }

    private PostVO toVO(Post post, Long userId) {
        PostVO vo = new PostVO();
        BeanUtil.copyProperties(post, vo);

        // 解析图片
        if (StringUtils.hasText(post.getImages())) {
            vo.setImages(JSONUtil.toList(post.getImages(), String.class));
        }

        // 获取作者信息
        User author = userMapper.selectById(post.getAuthorId());
        if (author != null) {
            UserVO userVO = new UserVO();
            BeanUtil.copyProperties(author, userVO);
            vo.setAuthor(userVO);
        }

        // 检查是否已点赞/收藏
        if (userId != null) {
            vo.setIsLiked(userActionMapper.selectCount(
                    new LambdaQueryWrapper<UserAction>()
                            .eq(UserAction::getUserId, userId)
                            .eq(UserAction::getTargetId, post.getId())
                            .eq(UserAction::getTargetType, "post")
                            .eq(UserAction::getActionType, "like")) > 0);

            vo.setIsCollected(userActionMapper.selectCount(
                    new LambdaQueryWrapper<UserAction>()
                            .eq(UserAction::getUserId, userId)
                            .eq(UserAction::getTargetId, post.getId())
                            .eq(UserAction::getTargetType, "post")
                            .eq(UserAction::getActionType, "collect")) > 0);
        } else {
            vo.setIsLiked(false);
            vo.setIsCollected(false);
        }

        return vo;
    }
}
