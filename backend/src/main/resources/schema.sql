-- 面试知识库管理系统数据库初始化脚本

CREATE DATABASE IF NOT EXISTS interview DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE interview;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(255) COMMENT '密码',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '手机号',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar` VARCHAR(500) COMMENT '头像URL',
    `bio` VARCHAR(500) COMMENT '个人简介',
    `role` VARCHAR(20) NOT NULL DEFAULT 'user' COMMENT '角色: user, vip, admin',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    `study_days` INT NOT NULL DEFAULT 0 COMMENT '学习天数',
    `total_study_time` INT NOT NULL DEFAULT 0 COMMENT '总学习时长(分钟)',
    `questions_solved` INT NOT NULL DEFAULT 0 COMMENT '已解决题目数',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 知识点表
CREATE TABLE IF NOT EXISTS `knowledge` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `content` LONGTEXT NOT NULL COMMENT '内容(Markdown)',
    `category` VARCHAR(50) NOT NULL COMMENT '分类',
    `tags` JSON COMMENT '标签',
    `difficulty` VARCHAR(20) NOT NULL DEFAULT 'medium' COMMENT '难度: easy, medium, hard',
    `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
    `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
    `collect_count` INT NOT NULL DEFAULT 0 COMMENT '收藏数',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-草稿, 1-发布',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_difficulty` (`difficulty`),
    KEY `idx_author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识点表';

-- 题目表
CREATE TABLE IF NOT EXISTS `question` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `content` LONGTEXT NOT NULL COMMENT '题目内容(Markdown)',
    `answer` LONGTEXT COMMENT '参考答案(Markdown)',
    `category` VARCHAR(50) NOT NULL COMMENT '分类',
    `difficulty` VARCHAR(20) NOT NULL DEFAULT 'medium' COMMENT '难度: easy, medium, hard',
    `tags` JSON COMMENT '标签',
    `company` VARCHAR(100) COMMENT '来源公司',
    `source` VARCHAR(100) COMMENT '题目来源',
    `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
    `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
    `collect_count` INT NOT NULL DEFAULT 0 COMMENT '收藏数',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-草稿, 1-发布',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_category` (`category`),
    KEY `idx_difficulty` (`difficulty`),
    KEY `idx_company` (`company`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='题目表';

-- 学习计划表
CREATE TABLE IF NOT EXISTS `study_plan` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `title` VARCHAR(100) NOT NULL COMMENT '计划标题',
    `description` VARCHAR(500) COMMENT '计划描述',
    `start_date` DATE NOT NULL COMMENT '开始日期',
    `end_date` DATE COMMENT '结束日期',
    `status` VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态: active, completed, paused',
    `progress` INT NOT NULL DEFAULT 0 COMMENT '进度百分比',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习计划表';

-- 学习记录表
CREATE TABLE IF NOT EXISTS `study_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `date` DATE NOT NULL COMMENT '日期',
    `study_time` INT NOT NULL DEFAULT 0 COMMENT '学习时长(分钟)',
    `knowledge_count` INT NOT NULL DEFAULT 0 COMMENT '学习知识点数',
    `question_count` INT NOT NULL DEFAULT 0 COMMENT '刷题数',
    `checked_in` TINYINT NOT NULL DEFAULT 0 COMMENT '是否打卡',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_date` (`user_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习记录表';

-- 帖子表
CREATE TABLE IF NOT EXISTS `post` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `content` TEXT NOT NULL COMMENT '内容',
    `images` JSON COMMENT '图片列表',
    `type` VARCHAR(20) NOT NULL COMMENT '类型: experience, knowledge, question, discussion',
    `author_id` BIGINT NOT NULL COMMENT '作者ID',
    `like_count` INT NOT NULL DEFAULT 0 COMMENT '点赞数',
    `comment_count` INT NOT NULL DEFAULT 0 COMMENT '评论数',
    `share_count` INT NOT NULL DEFAULT 0 COMMENT '分享数',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0-删除, 1-正常',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    KEY `idx_type` (`type`),
    KEY `idx_author_id` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子表';

-- 用户行为表(点赞/收藏/已做)
CREATE TABLE IF NOT EXISTS `user_action` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `target_id` BIGINT NOT NULL COMMENT '目标ID',
    `target_type` VARCHAR(20) NOT NULL COMMENT '目标类型: knowledge, question, post',
    `action_type` VARCHAR(20) NOT NULL COMMENT '行为类型: like, collect, solve',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_target_action` (`user_id`, `target_id`, `target_type`, `action_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为表';

-- 插入测试管理员账号 (密码: admin123)
INSERT INTO `user` (`username`, `password`, `email`, `nickname`, `role`, `status`) VALUES
('admin', '$2a$10$EqKhQzfzaJpFhI4qJB.8YOXBRXnhP.BYnJqXqjv8iUVqhIoAqE7Xi', 'admin@example.com', '管理员', 'admin', 1);
