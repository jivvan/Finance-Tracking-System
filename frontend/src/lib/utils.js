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
    set((state) => ({
      accounts: [...state.accounts, account].sort((a, b) => a.name > b.name),
    })),
  deleteAccount: (accountId) =>
    set((state) => ({
      accounts: [...state.accounts.filter((acc) => acc.id !== accountId)],
    })),
  setAccounts: (accounts) => set((state) => ({ accounts })),
  updateAccount: (account) =>
    set((state) => ({
      accounts: [
        ...state.accounts.map((acc) => {
          if (acc.id === account.id) {
            acc.name = account.name;
            acc.balance = account.balance;
          }
          return acc;
        }),
      ],
    })),
  updateAccountBalance: (change, type) =>
    set((state) => ({
      accounts: [
        ...state.accounts.map((acc) => {
          if (type === "self") {
            if (parseInt(acc.id) === parseInt(change.id)) {
              acc.balance += parseFloat(change.amount);
            }
          } else if (type === "transfer") {
            change.from = parseInt(change.from);
            change.to = parseInt(change.to);
            if (acc.id === change.from) {
              acc.balance -= parseFloat(change.amount);
            }
            if (acc.id === change.to) {
              acc.balance += parseFloat(change.amount);
            }
          }
          acc = { ...acc };
          return acc;
        }),
      ],
    })),

  // goals
  goals: [],
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  setGoals: (goals) => set((state) => ({ goals })),
  updateGoalStatus: (change) =>
    set((state) => ({
      goals: [
        ...state.goals.map((goal) => {
          if (goal.id === change.id) {
            goal.current_amount += change.amount;
          }
          return goal;
        }),
      ],
    })),
  updateGoal: (goal) =>
    set((state) => ({
      goals: [
        ...state.goals.map((g) => {
          if (g.id === goal.id) {
            g.name = goal.name;
            g.target_amount = parseFloat(goal.target_amount);
          }
          return g;
        }),
      ],
    })),

  rehydrateFlag: false,
  rehydrate: () => set((state) => ({ rehydrateFlag: !state.rehydrateFlag })),

  dashChange: false,
  updateDash: () => set((state) => ({ dashChange: true })),
  updatedDash: () => set((state) => ({ dashChange: false })),
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
