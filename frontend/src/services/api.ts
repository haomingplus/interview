import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiResponse, PageResult } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config);
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }

  async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }
}

export const api = new ApiService();

// Auth API
export const authApi = {
  login: (data: { username: string; password: string }) =>
    api.post<{ user: import("@/types").User; token: string }>("/auth/login", data),
  register: (data: { username: string; email: string; password: string }) =>
    api.post<{ user: import("@/types").User; token: string }>("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post<{ token: string }>("/auth/refresh"),
  sendCode: (phone: string) => api.post("/auth/send-code", { phone }),
  loginByPhone: (data: { phone: string; code: string }) =>
    api.post<{ user: import("@/types").User; token: string }>("/auth/login-phone", data),
};

// Knowledge API
export const knowledgeApi = {
  getList: (params: import("@/types").SearchParams) =>
    api.get<PageResult<import("@/types").Knowledge>>("/knowledge", { params }),
  getById: (id: string) => api.get<import("@/types").Knowledge>(`/knowledge/${id}`),
  create: (data: Partial<import("@/types").Knowledge>) =>
    api.post<import("@/types").Knowledge>("/knowledge", data),
  update: (id: string, data: Partial<import("@/types").Knowledge>) =>
    api.put<import("@/types").Knowledge>(`/knowledge/${id}`, data),
  delete: (id: string) => api.delete(`/knowledge/${id}`),
  like: (id: string) => api.post(`/knowledge/${id}/like`),
  collect: (id: string) => api.post(`/knowledge/${id}/collect`),
};

// Question API
export const questionApi = {
  getList: (params: import("@/types").SearchParams) =>
    api.get<PageResult<import("@/types").Question>>("/questions", { params }),
  getById: (id: string) => api.get<import("@/types").Question>(`/questions/${id}`),
  create: (data: Partial<import("@/types").Question>) =>
    api.post<import("@/types").Question>("/questions", data),
  update: (id: string, data: Partial<import("@/types").Question>) =>
    api.put<import("@/types").Question>(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
  markSolved: (id: string) => api.post(`/questions/${id}/solved`),
  like: (id: string) => api.post(`/questions/${id}/like`),
  collect: (id: string) => api.post(`/questions/${id}/collect`),
};

// Study API
export const studyApi = {
  getPlans: () => api.get<import("@/types").StudyPlan[]>("/study/plans"),
  createPlan: (data: Partial<import("@/types").StudyPlan>) =>
    api.post<import("@/types").StudyPlan>("/study/plans", data),
  updatePlan: (id: string, data: Partial<import("@/types").StudyPlan>) =>
    api.put<import("@/types").StudyPlan>(`/study/plans/${id}`, data),
  deletePlan: (id: string) => api.delete(`/study/plans/${id}`),
  completeTask: (planId: string, taskId: string) =>
    api.post(`/study/plans/${planId}/tasks/${taskId}/complete`),
  getTodayRecord: () => api.get<import("@/types").StudyRecord>("/study/today"),
  checkIn: () => api.post<import("@/types").StudyRecord>("/study/check-in"),
  getRecords: (startDate: string, endDate: string) =>
    api.get<import("@/types").StudyRecord[]>("/study/records", {
      params: { startDate, endDate },
    }),
  getStats: () =>
    api.get<{
      totalDays: number;
      totalTime: number;
      totalKnowledge: number;
      totalQuestions: number;
      streak: number;
    }>("/study/stats"),
};

// Community API
export const communityApi = {
  getPosts: (params: { page: number; pageSize: number; type?: string }) =>
    api.get<PageResult<import("@/types").Post>>("/community/posts", { params }),
  getPostById: (id: string) => api.get<import("@/types").Post>(`/community/posts/${id}`),
  createPost: (data: { content: string; type: string; images?: string[] }) =>
    api.post<import("@/types").Post>("/community/posts", data),
  deletePost: (id: string) => api.delete(`/community/posts/${id}`),
  likePost: (id: string) => api.post(`/community/posts/${id}/like`),
  collectPost: (id: string) => api.post(`/community/posts/${id}/collect`),
  getComments: (postId: string) =>
    api.get<import("@/types").Comment[]>(`/community/posts/${postId}/comments`),
  addComment: (postId: string, content: string, parentId?: string) =>
    api.post<import("@/types").Comment>(`/community/posts/${postId}/comments`, {
      content,
      parentId,
    }),
  likeComment: (postId: string, commentId: string) =>
    api.post(`/community/posts/${postId}/comments/${commentId}/like`),
};

// User API
export const userApi = {
  getProfile: () => api.get<import("@/types").User>("/user/profile"),
  updateProfile: (data: Partial<import("@/types").User>) =>
    api.put<import("@/types").User>("/user/profile", data),
  uploadAvatar: (file: File) => api.upload<{ url: string }>("/user/avatar", file),
  getNotifications: (params: { page: number; pageSize: number }) =>
    api.get<PageResult<import("@/types").Notification>>("/user/notifications", { params }),
  markNotificationRead: (id: string) => api.post(`/user/notifications/${id}/read`),
  markAllNotificationsRead: () => api.post("/user/notifications/read-all"),
  getCollections: (type: "knowledge" | "question" | "post") =>
    api.get<PageResult<unknown>>(`/user/collections/${type}`),
};
