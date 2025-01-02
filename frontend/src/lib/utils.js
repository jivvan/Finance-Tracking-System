import { create } from "zustand";

export const useStore = create((set) => ({
  // profile
  profile: {},
  setProfile: (profile) => set((state) => ({ profile })),

  // dashboard
  dashSummary: {},
  setDashSummary: (summary) => set((state) => ({ dashSummary: summary })),

  // transactions
  transactions: [],
  setTransactions: (transactions) => set((state) => ({ transactions })),
  addTransaction: (transaction) =>
    set((state) => ({ transactions: [transaction, ...state.transactions] })),

  // categories
  categories: [],
  addCategory: (category) =>
    set((state) => ({ categories: [category, ...state.categories] })),
  setCategories: (categories) => set((state) => ({ categories })),

  // accounts
  accounts: [],
  addAccount: (account) =>
    set((state) => ({ accounts: [account, ...state.accounts] })),
  setAccounts: (accounts) => set((state) => ({ accounts })),

  // goals
  goals: [],
  addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),
  setGoals: (goals) => set((state) => ({ goals })),

  rehydrateFlag: false,
  rehydrate: () => set((state) => ({ rehydrateFlag: !state.rehydrateFlag })),
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
