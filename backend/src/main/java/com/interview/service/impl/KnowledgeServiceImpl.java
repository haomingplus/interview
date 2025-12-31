package com.interview.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.common.PageResult;
import com.interview.common.ResultCode;
import com.interview.dto.KnowledgeDTO;
import com.interview.dto.SearchDTO;
import com.interview.entity.Knowledge;
import com.interview.entity.User;
import com.interview.entity.UserAction;
import com.interview.exception.BusinessException;
import com.interview.mapper.KnowledgeMapper;
import com.interview.mapper.UserActionMapper;
import com.interview.mapper.UserMapper;
import com.interview.service.KnowledgeService;
import com.interview.vo.KnowledgeVO;
import com.interview.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 知识点服务实现
 */
@Service
@RequiredArgsConstructor
public class KnowledgeServiceImpl implements KnowledgeService {

    private final KnowledgeMapper knowledgeMapper;
    private final UserMapper userMapper;
    private final UserActionMapper userActionMapper;

    @Override
    public PageResult<KnowledgeVO> getPage(SearchDTO dto, Long userId) {
        Page<Knowledge> page = new Page<>(dto.getPage(), dto.getPageSize());

        LambdaQueryWrapper<Knowledge> wrapper = new LambdaQueryWrapper<Knowledge>()
                .eq(Knowledge::getStatus, 1)
                .like(StringUtils.hasText(dto.getKeyword()), Knowledge::getTitle, dto.getKeyword())
                .eq(StringUtils.hasText(dto.getCategory()), Knowledge::getCategory, dto.getCategory())
                .eq(StringUtils.hasText(dto.getDifficulty()), Knowledge::getDifficulty, dto.getDifficulty())
                .orderByDesc(Knowledge::getCreatedAt);

        Page<Knowledge> result = knowledgeMapper.selectPage(page, wrapper);

        List<KnowledgeVO> voList = result.getRecords().stream()
                .map(k -> toVO(k, userId))
                .collect(Collectors.toList());

        return PageResult.of(voList, result);
    }

    @Override
    public KnowledgeVO getById(Long id, Long userId) {
        Knowledge knowledge = knowledgeMapper.selectById(id);
        if (knowledge == null || knowledge.getDeleted() == 1) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }

        // 增加浏览次数
        knowledge.setViewCount(knowledge.getViewCount() + 1);
        knowledgeMapper.updateById(knowledge);

        return toVO(knowledge, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public KnowledgeVO create(KnowledgeDTO dto, Long authorId) {
        Knowledge knowledge = new Knowledge();
        BeanUtil.copyProperties(dto, knowledge);
        knowledge.setTags(JSONUtil.toJsonStr(dto.getTags()));
        knowledge.setAuthorId(authorId);
        knowledge.setViewCount(0);
        knowledge.setLikeCount(0);
        knowledge.setCollectCount(0);
        knowledge.setStatus(1);

        knowledgeMapper.insert(knowledge);

        return toVO(knowledge, authorId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public KnowledgeVO update(Long id, KnowledgeDTO dto, Long userId) {
        Knowledge knowledge = knowledgeMapper.selectById(id);
        if (knowledge == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!knowledge.getAuthorId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        BeanUtil.copyProperties(dto, knowledge);
        knowledge.setTags(JSONUtil.toJsonStr(dto.getTags()));
        knowledgeMapper.updateById(knowledge);

        return toVO(knowledge, userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(Long id, Long userId) {
        Knowledge knowledge = knowledgeMapper.selectById(id);
        if (knowledge == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!knowledge.getAuthorId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        knowledgeMapper.deleteById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void toggleLike(Long id, Long userId) {
        Knowledge knowledge = knowledgeMapper.selectById(id);
        if (knowledge == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }

        UserAction action = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "knowledge")
                        .eq(UserAction::getActionType, "like"));

        if (action != null) {
            // 取消点赞
            userActionMapper.deleteById(action.getId());
            knowledge.setLikeCount(knowledge.getLikeCount() - 1);
        } else {
            // 点赞
            action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("knowledge");
            action.setActionType("like");
            userActionMapper.insert(action);
            knowledge.setLikeCount(knowledge.getLikeCount() + 1);
        }

        knowledgeMapper.updateById(knowledge);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void toggleCollect(Long id, Long userId) {
        Knowledge knowledge = knowledgeMapper.selectById(id);
        if (knowledge == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }

        UserAction action = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "knowledge")
                        .eq(UserAction::getActionType, "collect"));

        if (action != null) {
            // 取消收藏
            userActionMapper.deleteById(action.getId());
            knowledge.setCollectCount(knowledge.getCollectCount() - 1);
        } else {
            // 收藏
            action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("knowledge");
            action.setActionType("collect");
            userActionMapper.insert(action);
            knowledge.setCollectCount(knowledge.getCollectCount() + 1);
        }

        knowledgeMapper.updateById(knowledge);
    }

    private KnowledgeVO toVO(Knowledge knowledge, Long userId) {
        KnowledgeVO vo = new KnowledgeVO();
        BeanUtil.copyProperties(knowledge, vo);

        // 解析标签
        if (StringUtils.hasText(knowledge.getTags())) {
            vo.setTags(JSONUtil.toList(knowledge.getTags(), String.class));
        }

        // 获取作者信息
        User author = userMapper.selectById(knowledge.getAuthorId());
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
                            .eq(UserAction::getTargetId, knowledge.getId())
                            .eq(UserAction::getTargetType, "knowledge")
                            .eq(UserAction::getActionType, "like")) > 0);

            vo.setIsCollected(userActionMapper.selectCount(
                    new LambdaQueryWrapper<UserAction>()
                            .eq(UserAction::getUserId, userId)
                            .eq(UserAction::getTargetId, knowledge.getId())
                            .eq(UserAction::getTargetType, "knowledge")
                            .eq(UserAction::getActionType, "collect")) > 0);
        } else {
            vo.setIsLiked(false);
            vo.setIsCollected(false);
        }

        return vo;
    }
}
