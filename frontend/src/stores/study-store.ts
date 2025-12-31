import { create } from "zustand";
import type { StudyPlan, StudyRecord } from "@/types";

interface StudyState {
  currentPlan: StudyPlan | null;
  todayRecord: StudyRecord | null;
  isStudying: boolean;
  studyStartTime: number | null;
  setCurrentPlan: (plan: StudyPlan | null) => void;
  setTodayRecord: (record: StudyRecord | null) => void;
  startStudy: () => void;
  stopStudy: () => number;
  updateTodayRecord: (data: Partial<StudyRecord>) => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  currentPlan: null,
  todayRecord: null,
  isStudying: false,
  studyStartTime: null,
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setTodayRecord: (record) => set({ todayRecord: record }),
  startStudy: () =>
    set({
      isStudying: true,
      studyStartTime: Date.now(),
    }),
  stopStudy: () => {
    const { studyStartTime, todayRecord } = get();
    if (!studyStartTime) return 0;

    const duration = Math.floor((Date.now() - studyStartTime) / 1000 / 60);
    set({
      isStudying: false,
      studyStartTime: null,
      todayRecord: todayRecord
        ? {
            ...todayRecord,
            studyTime: todayRecord.studyTime + duration,
          }
        : null,
    });
    return duration;
  },
  updateTodayRecord: (data) =>
    set((state) => ({
      todayRecord: state.todayRecord
        ? { ...state.todayRecord, ...data }
        : null,
    })),
}));
