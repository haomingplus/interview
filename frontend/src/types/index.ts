// 用户相关类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  bio?: string;
  role: "user" | "admin" | "vip";
  createdAt: string;
  studyDays: number;
  totalStudyTime: number;
  questionsSolved: number;
}

// 知识点相关类型
export interface Knowledge {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  difficulty: "easy" | "medium" | "hard";
  viewCount: number;
  likeCount: number;
  collectCount: number;
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
}

export type KnowledgeCategory =
  | "algorithm"
  | "data-structure"
  | "system-design"
  | "database"
  | "network"
  | "os"
  | "frontend"
  | "backend"
  | "devops"
  | "other";

export const CATEGORY_LABELS: Record<KnowledgeCategory, string> = {
  algorithm: "算法",
  "data-structure": "数据结构",
  "system-design": "系统设计",
  database: "数据库",
  network: "计算机网络",
  os: "操作系统",
  frontend: "前端",
  backend: "后端",
  devops: "DevOps",
  other: "其他",
};

// 题目相关类型
export interface Question {
  id: string;
  title: string;
  content: string;
  answer?: string;
  category: KnowledgeCategory;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  company?: string;
  source?: string;
  viewCount: number;
  likeCount: number;
  collectCount: number;
  isLiked: boolean;
  isCollected: boolean;
  isSolved: boolean;
  createdAt: string;
}

// 学习计划相关类型
export interface StudyPlan {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "paused";
  progress: number;
  tasks: StudyTask[];
  createdAt: string;
}

export interface StudyTask {
  id: string;
  planId: string;
  title: string;
  type: "knowledge" | "question" | "interview";
  targetId?: string;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
}

// 学习记录相关类型
export interface StudyRecord {
  id: string;
  userId: string;
  date: string;
  studyTime: number;
  knowledgeCount: number;
  questionCount: number;
  isCheckedIn: boolean;
}

// 社区动态相关类型
export interface Post {
  id: string;
  content: string;
  images?: string[];
  type: "experience" | "knowledge" | "question" | "discussion";
  author: User;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: User;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  replies?: Comment[];
  parentId?: string;
}

// 通知相关类型
export interface Notification {
  id: string;
  type: "system" | "like" | "comment" | "follow" | "reminder";
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

// API 响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 搜索相关类型
export interface SearchParams {
  keyword?: string;
  category?: KnowledgeCategory;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
