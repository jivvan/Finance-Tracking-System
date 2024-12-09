import { create } from "zustand";

export const useStore = create((set) => ({
  dashSummary: {},
  transactions: [],
  categories: [],
  accounts: [],
  goals: [],
  contributions: [],
  setDashSummary: (summary) => set((state) => ({ dashSummary: summary })),
  setTransactions: (transactions) => set((state) => ({ transactions })),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),
  addCategory: (category) =>
    set((state) => ({ categories: [category, ...state.categories] })),
  addAccount: (account) =>
    set((state) => ({ accounts: [account, ...state.accounts] })),
  addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
  addContribution: (contribution) =>
    set((state) => ({ contributions: [contribution, ...state.contributions] })),
}));

export function getColorPerProgress(progress, lower_better = false) {
  if (lower_better) {
    progress = 100 - progress;
  }
  if (progress >= 75) return "cyan";
  if (progress >= 50) return "green";
  if (progress >= 25) return "yellow";
  return "red";
}
