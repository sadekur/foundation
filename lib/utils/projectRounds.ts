// Pure helpers for viewing a project by round (1st conference, 2nd conference, …) instead of by
// calendar year — one round's income and spending often straddle a new year.
// Transactions carry no round tag: each belongs to the latest round that started on or before its
// date, and anything dated before the first round's start falls into the first round.

import type { ProjectData, ProjectRound, Transaction, YearTransactions } from "@/types";

export const sortRounds = (rounds: ProjectRound[] = []): ProjectRound[] =>
  [...rounds].sort((a, b) => a.startDate.localeCompare(b.startDate));

// Dates are YYYY-MM-DD strings, so plain string comparison orders them correctly.
const findRoundIndex = (sortedRounds: ProjectRound[], date: string): number => {
  let index = 0;
  sortedRounds.forEach((round, i) => {
    if (round.startDate <= date) index = i;
  });
  return index;
};

export const findRoundForDate = (rounds: ProjectRound[] = [], date: string): ProjectRound | undefined => {
  const sorted = sortRounds(rounds);
  return sorted[findRoundIndex(sorted, date)];
};

const flattenYears = (byYear: Record<string, YearTransactions> = {}): Transaction[] =>
  Object.values(byYear).flatMap((yearData) => Object.values(yearData));

export interface RoundSummary {
  round: ProjectRound;
  income: YearTransactions;
  expenses: YearTransactions;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  // Sum of this and every earlier round's balance — what the fund actually stood at after it.
  runningBalance: number;
  transactionCount: number;
  firstDate?: string;
  lastDate?: string;
}

// One summary per round, oldest first. Empty when the project has no rounds.
export const calculateRoundSummaries = (projectData?: ProjectData): RoundSummary[] => {
  const rounds = sortRounds(projectData?.rounds);
  if (!projectData || rounds.length === 0) return [];

  const summaries: RoundSummary[] = rounds.map((round) => ({
    round,
    income: {},
    expenses: {},
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    runningBalance: 0,
    transactionCount: 0,
  }));

  (["income", "expenses"] as const).forEach((type) => {
    flattenYears(projectData[type]).forEach((transaction) => {
      const summary = summaries[findRoundIndex(rounds, transaction.date)];
      summary[type][transaction.id] = transaction;
      if (type === "income") summary.totalIncome += transaction.amount;
      else summary.totalExpenses += transaction.amount;
      summary.transactionCount += 1;
      if (!summary.firstDate || transaction.date < summary.firstDate) summary.firstDate = transaction.date;
      if (!summary.lastDate || transaction.date > summary.lastDate) summary.lastDate = transaction.date;
    });
  });

  let running = 0;
  summaries.forEach((summary) => {
    summary.balance = summary.totalIncome - summary.totalExpenses;
    running += summary.balance;
    summary.runningBalance = running;
  });

  return summaries;
};

const formatMonth = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

// "Nov 2024 – Aug 2025", from the round's actual first and last transactions.
export const formatRoundDates = (summary: RoundSummary): string => {
  if (!summary.firstDate || !summary.lastDate) return "No transactions yet";
  const first = formatMonth(summary.firstDate);
  const last = formatMonth(summary.lastDate);
  return first === last ? first : `${first} – ${last}`;
};
