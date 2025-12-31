import { useState, useEffect } from "react";
import type { Knowledge, Question, Post, User, StudyRecord } from "@/types";

// Mock 当前用户
export const mockUser: User = {
  id: "1",
  username: "developer",
  email: "dev@example.com",
  nickname: "前端开发者",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=developer",
  bio: "专注于前端开发和系统设计，正在准备大厂面试",
  role: "vip",
  createdAt: "2024-01-01",
  studyDays: 128,
  totalStudyTime: 3680,
  questionsSolved: 256,
};

// Mock 知识点数据
export const mockKnowledgeList: Knowledge[] = [
  {
    id: "1",
    title: "React Hooks 完全指南",
    content: "# React Hooks\n\nReact Hooks 是 React 16.8 引入的新特性，让你在不编写 class 的情况下使用 state 以及其他的 React 特性。\n\n## useState\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\n## useEffect\n\n用于处理副作用，如数据获取、订阅或手动更改 DOM。",
    category: "frontend",
    tags: ["React", "Hooks", "前端框架"],
    difficulty: "medium",
    viewCount: 1520,
    likeCount: 328,
    collectCount: 156,
    isLiked: false,
    isCollected: true,
    createdAt: "2024-12-20",
    updatedAt: "2024-12-25",
  },
  {
    id: "2",
    title: "二叉树遍历算法详解",
    content: "# 二叉树遍历\n\n二叉树遍历是面试中的高频考点，包括前序、中序、后序和层序遍历。\n\n## 前序遍历\n\n根 -> 左 -> 右\n\n```javascript\nfunction preorder(root) {\n  if (!root) return [];\n  return [root.val, ...preorder(root.left), ...preorder(root.right)];\n}\n```",
    category: "algorithm",
    tags: ["二叉树", "递归", "迭代"],
    difficulty: "medium",
    viewCount: 2350,
    likeCount: 512,
    collectCount: 289,
    isLiked: true,
    isCollected: true,
    createdAt: "2024-12-18",
    updatedAt: "2024-12-22",
  },
  {
    id: "3",
    title: "MySQL 索引优化实战",
    content: "# MySQL 索引优化\n\n索引是提高数据库查询性能的关键。\n\n## 索引类型\n\n- B+树索引\n- 哈希索引\n- 全文索引\n\n## 最左前缀原则\n\n联合索引遵循最左前缀原则...",
    category: "database",
    tags: ["MySQL", "索引", "性能优化"],
    difficulty: "hard",
    viewCount: 1890,
    likeCount: 445,
    collectCount: 267,
    isLiked: false,
    isCollected: false,
    createdAt: "2024-12-15",
    updatedAt: "2024-12-20",
  },
  {
    id: "4",
    title: "TCP 三次握手与四次挥手",
    content: "# TCP 连接管理\n\n## 三次握手\n\n1. 客户端发送 SYN\n2. 服务端返回 SYN+ACK\n3. 客户端发送 ACK\n\n## 四次挥手\n\n断开连接需要四次挥手...",
    category: "network",
    tags: ["TCP", "网络协议", "计算机网络"],
    difficulty: "medium",
    viewCount: 3200,
    likeCount: 678,
    collectCount: 445,
    isLiked: true,
    isCollected: false,
    createdAt: "2024-12-10",
    updatedAt: "2024-12-15",
  },
  {
    id: "5",
    title: "Redis 缓存策略详解",
    content: "# Redis 缓存\n\n## 缓存穿透\n\n查询不存在的数据，解决方案：布隆过滤器\n\n## 缓存击穿\n\n热点key过期，解决方案：互斥锁\n\n## 缓存雪崩\n\n大量key同时过期，解决方案：过期时间加随机值",
    category: "database",
    tags: ["Redis", "缓存", "高并发"],
    difficulty: "hard",
    viewCount: 2780,
    likeCount: 589,
    collectCount: 378,
    isLiked: false,
    isCollected: true,
    createdAt: "2024-12-08",
    updatedAt: "2024-12-12",
  },
];

// Mock 题目数据
export const mockQuestionList: Question[] = [
  {
    id: "1",
    title: "实现一个 LRU 缓存",
    content: "设计和实现一个 LRU (最近最少使用) 缓存机制。它应该支持以下操作：获取数据 get 和写入数据 put。\n\nget(key) - 如果密钥存在于缓存中，则获取密钥的值（总是正数），否则返回 -1。\n\nput(key, value) - 如果密钥不存在，则写入其数据值。当缓存容量达到上限时，它应该在写入新数据之前删除最近最少使用的数据值。",
    answer: "使用 Map + 双向链表实现...",
    category: "algorithm",
    difficulty: "medium",
    tags: ["LRU", "缓存", "数据结构"],
    company: "字节跳动",
    source: "LeetCode 146",
    viewCount: 4520,
    likeCount: 892,
    collectCount: 567,
    isLiked: true,
    isCollected: true,
    isSolved: true,
    createdAt: "2024-12-20",
  },
  {
    id: "2",
    title: "说说 Vue 和 React 的区别",
    content: "请从以下几个方面对比 Vue 和 React：\n\n1. 核心思想\n2. 数据绑定\n3. 组件化\n4. 生态系统\n5. 学习曲线\n6. 性能优化",
    category: "frontend",
    difficulty: "medium",
    tags: ["Vue", "React", "框架对比"],
    company: "腾讯",
    viewCount: 3890,
    likeCount: 756,
    collectCount: 489,
    isLiked: false,
    isCollected: true,
    isSolved: false,
    createdAt: "2024-12-18",
  },
  {
    id: "3",
    title: "如何设计一个高并发系统？",
    content: "假设你需要设计一个日活千万的社交应用，请说说你的设计思路，包括但不限于：\n\n1. 架构设计\n2. 数据库设计\n3. 缓存策略\n4. 消息队列\n5. 负载均衡\n6. 限流熔断",
    category: "system-design",
    difficulty: "hard",
    tags: ["系统设计", "高并发", "架构"],
    company: "阿里巴巴",
    viewCount: 5670,
    likeCount: 1023,
    collectCount: 789,
    isLiked: true,
    isCollected: false,
    isSolved: false,
    createdAt: "2024-12-15",
  },
];

// Mock 社区动态
export const mockPosts: Post[] = [
  {
    id: "1",
    content: "刚拿到字节跳动的 offer！分享一下我的面试经验：\n\n一面主要考察基础，问了很多 JavaScript 原型链和闭包的问题。二面是算法，写了两道中等难度的题目。三面是系统设计，设计一个短链接服务。\n\n总结：基础要扎实，算法要多刷，系统设计要有思路！",
    type: "experience",
    author: {
      id: "2",
      username: "bytedancer",
      email: "byte@example.com",
      nickname: "字节人",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bytedancer",
      role: "vip",
      createdAt: "2024-01-01",
      studyDays: 200,
      totalStudyTime: 5000,
      questionsSolved: 500,
    },
    likeCount: 328,
    commentCount: 56,
    shareCount: 23,
    isLiked: true,
    isCollected: true,
    createdAt: "2024-12-28T10:30:00",
  },
  {
    id: "2",
    content: "今天学习了 React 18 的新特性，Concurrent Mode 真的很强大！useTransition 和 useDeferredValue 可以有效提升用户体验。\n\n推荐大家去看看官方文档，写得很清楚。",
    type: "knowledge",
    author: {
      id: "3",
      username: "reactfan",
      email: "react@example.com",
      nickname: "React 爱好者",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reactfan",
      role: "user",
      createdAt: "2024-03-01",
      studyDays: 90,
      totalStudyTime: 2000,
      questionsSolved: 150,
    },
    likeCount: 156,
    commentCount: 23,
    shareCount: 12,
    isLiked: false,
    isCollected: false,
    createdAt: "2024-12-28T09:15:00",
  },
  {
    id: "3",
    content: "请问大家，MySQL 的 MVCC 机制是如何实现的？面试被问到了，回答得不太好，想深入了解一下。",
    type: "question",
    author: {
      id: "4",
      username: "sqllearner",
      email: "sql@example.com",
      nickname: "数据库小白",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sqllearner",
      role: "user",
      createdAt: "2024-06-01",
      studyDays: 45,
      totalStudyTime: 800,
      questionsSolved: 60,
    },
    likeCount: 45,
    commentCount: 18,
    shareCount: 5,
    isLiked: false,
    isCollected: true,
    createdAt: "2024-12-28T08:00:00",
  },
];

// Mock 学习记录
export const mockStudyRecords: StudyRecord[] = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  userId: "1",
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  studyTime: Math.floor(Math.random() * 120) + 30,
  knowledgeCount: Math.floor(Math.random() * 10) + 1,
  questionCount: Math.floor(Math.random() * 8) + 1,
  isCheckedIn: i < 7 || Math.random() > 0.3,
}));

// Hooks
export function useMockUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);
  }, []);

  return { user, loading };
}

export function useMockKnowledge() {
  const [data, setData] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(mockKnowledgeList);
      setLoading(false);
    }, 800);
  }, []);

  return { data, loading };
}

export function useMockQuestions() {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(mockQuestionList);
      setLoading(false);
    }, 800);
  }, []);

  return { data, loading };
}

export function useMockPosts() {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(mockPosts);
      setLoading(false);
    }, 600);
  }, []);

  return { data, loading };
}
