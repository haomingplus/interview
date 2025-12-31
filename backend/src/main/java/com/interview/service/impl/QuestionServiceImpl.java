package com.interview.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.interview.common.PageResult;
import com.interview.common.ResultCode;
import com.interview.dto.QuestionDTO;
import com.interview.dto.SearchDTO;
import com.interview.entity.Question;
import com.interview.entity.UserAction;
import com.interview.exception.BusinessException;
import com.interview.mapper.QuestionMapper;
import com.interview.mapper.UserActionMapper;
import com.interview.service.QuestionService;
import com.interview.vo.QuestionVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionMapper questionMapper;
    private final UserActionMapper userActionMapper;

    @Override
    public PageResult<QuestionVO> getPage(SearchDTO dto, Long userId) {
        Page<Question> page = new Page<>(dto.getPage(), dto.getPageSize());

        LambdaQueryWrapper<Question> wrapper = new LambdaQueryWrapper<Question>()
                .eq(Question::getStatus, 1)
                .like(StringUtils.hasText(dto.getKeyword()), Question::getTitle, dto.getKeyword())
                .eq(StringUtils.hasText(dto.getCategory()), Question::getCategory, dto.getCategory())
                .eq(StringUtils.hasText(dto.getDifficulty()), Question::getDifficulty, dto.getDifficulty())
                .orderByDesc(Question::getCreatedAt);

        Page<Question> result = questionMapper.selectPage(page, wrapper);

        List<QuestionVO> voList = result.getRecords().stream()
                .map(q -> toVO(q, userId))
                .collect(Collectors.toList());

        return PageResult.of(voList, result);
    }

    @Override
    public QuestionVO getById(Long id, Long userId) {
        Question question = questionMapper.selectById(id);
        if (question == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        question.setViewCount(question.getViewCount() + 1);
        questionMapper.updateById(question);
        return toVO(question, userId);
    }

    @Override
    @Transactional
    public QuestionVO create(QuestionDTO dto, Long authorId) {
        Question question = new Question();
        BeanUtil.copyProperties(dto, question);
        question.setTags(JSONUtil.toJsonStr(dto.getTags()));
        question.setAuthorId(authorId);
        question.setViewCount(0);
        question.setLikeCount(0);
        question.setCollectCount(0);
        question.setStatus(1);
        questionMapper.insert(question);
        return toVO(question, authorId);
    }

    @Override
    @Transactional
    public QuestionVO update(Long id, QuestionDTO dto, Long userId) {
        Question question = questionMapper.selectById(id);
        if (question == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (!question.getAuthorId().equals(userId)) throw new BusinessException(ResultCode.FORBIDDEN);

        BeanUtil.copyProperties(dto, question);
        question.setTags(JSONUtil.toJsonStr(dto.getTags()));
        questionMapper.updateById(question);
        return toVO(question, userId);
    }

    @Override
    public void delete(Long id, Long userId) {
        Question question = questionMapper.selectById(id);
        if (question == null) throw new BusinessException(ResultCode.NOT_FOUND);
        if (!question.getAuthorId().equals(userId)) throw new BusinessException(ResultCode.FORBIDDEN);
        questionMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void toggleLike(Long id, Long userId) {
        Question question = questionMapper.selectById(id);
        if (question == null) throw new BusinessException(ResultCode.NOT_FOUND);

        UserAction action = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "question")
                        .eq(UserAction::getActionType, "like"));

        if (action != null) {
            userActionMapper.deleteById(action.getId());
            question.setLikeCount(question.getLikeCount() - 1);
        } else {
            action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("question");
            action.setActionType("like");
            userActionMapper.insert(action);
            question.setLikeCount(question.getLikeCount() + 1);
        }
        questionMapper.updateById(question);
    }

    @Override
    @Transactional
    public void toggleCollect(Long id, Long userId) {
        Question question = questionMapper.selectById(id);
        if (question == null) throw new BusinessException(ResultCode.NOT_FOUND);

        UserAction action = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "question")
                        .eq(UserAction::getActionType, "collect"));

        if (action != null) {
            userActionMapper.deleteById(action.getId());
            question.setCollectCount(question.getCollectCount() - 1);
        } else {
            action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("question");
            action.setActionType("collect");
            userActionMapper.insert(action);
            question.setCollectCount(question.getCollectCount() + 1);
        }
        questionMapper.updateById(question);
    }

    @Override
    @Transactional
    public void markSolved(Long id, Long userId) {
        Question question = questionMapper.selectById(id);
        if (question == null) throw new BusinessException(ResultCode.NOT_FOUND);

        UserAction existing = userActionMapper.selectOne(
                new LambdaQueryWrapper<UserAction>()
                        .eq(UserAction::getUserId, userId)
                        .eq(UserAction::getTargetId, id)
                        .eq(UserAction::getTargetType, "question")
                        .eq(UserAction::getActionType, "solve"));

        if (existing == null) {
            UserAction action = new UserAction();
            action.setUserId(userId);
            action.setTargetId(id);
            action.setTargetType("question");
            action.setActionType("solve");
            userActionMapper.insert(action);
        }
    }

    private QuestionVO toVO(Question question, Long userId) {
        QuestionVO vo = new QuestionVO();
        BeanUtil.copyProperties(question, vo);

        if (StringUtils.hasText(question.getTags())) {
            vo.setTags(JSONUtil.toList(question.getTags(), String.class));
        }

        if (userId != null) {
            vo.setIsLiked(userActionMapper.selectCount(
                    new LambdaQueryWrapper<UserAction>()
                            .eq(UserAction::getUserId, userId)
                            .eq(UserAction::getTargetId, question.getId())
                            .eq(UserAction::getTargetType, "question")
                            .eq(UserAction::getActionType, "like")) > 0);

            vo.setIsCollected(userActionMapper.selectCount(
                    new LambdaQueryWrapper<UserAction>()
                            .eq(UserAction::getUserId, userId)
                            .eq(UserAction::getTargetId, question.getId())
                            .eq(UserAction::getTargetType, "question")
                            .eq(UserAction::getActionType, "collect")) > 0);

            vo.setIsSolved(userActionMapper.selectCount(
                    new LambdaQueryWrapper<UserAction>()
                            .eq(UserAction::getUserId, userId)
                            .eq(UserAction::getTargetId, question.getId())
                            .eq(UserAction::getTargetType, "question")
                            .eq(UserAction::getActionType, "solve")) > 0);
        } else {
            vo.setIsLiked(false);
            vo.setIsCollected(false);
            vo.setIsSolved(false);
        }

        return vo;
    }
}
