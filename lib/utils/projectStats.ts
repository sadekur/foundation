// Pure helpers for deriving stats from the { income, expenses } project data shape.
// Kept free of component state so they're reusable and easy to memoize.

import type { Projects, ProjectData, YearTransactions } from "@/types";

export const getProjectYearKeys = (projectData?: ProjectData): Set<string> =>
  new Set([
    ...Object.keys(projectData?.income || {}),
    ...Object.keys(projectData?.expenses || {}),
  ]);

export const getProjectYears = (projectData?: ProjectData): number[] => {
  if (!projectData) return [];
  return Array.from(getProjectYearKeys(projectData))
    .map(Number)
    .sort((a, b) => b - a);
};

const sumAmounts = (yearData: YearTransactions | undefined): number =>
  Object.values(yearData || {}).reduce((sum, transaction) => sum + transaction.amount, 0);

export interface Totals {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export const calculateTotals = (
  projects: Projects,
  currentProject: string,
  selectedYear: number
): Totals => {
  if (!currentProject || !projects[currentProject]) {
    return { totalIncome: 0, totalExpenses: 0, balance: 0 };
  }

  const year = selectedYear.toString();
  const projectData = projects[currentProject];

  const totalIncome = sumAmounts(projectData.income?.[year]);
  const totalExpenses = sumAmounts(projectData.expenses?.[year]);

  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
};

export interface ProjectTotals extends Totals {
  years: number[];
}

export const calculateProjectTotals = (
  projects: Projects,
  projectName: string
): ProjectTotals => {
  if (!projectName || !projects[projectName]) {
    return { totalIncome: 0, totalExpenses: 0, balance: 0, years: [] };
  }

  const projectData = projects[projectName];
  const allYears = getProjectYears(projectData);

  let totalIncome = 0;
  let totalExpenses = 0;

  allYears.forEach((year) => {
    const yearStr = year.toString();
    totalIncome += sumAmounts(projectData.income?.[yearStr]);
    totalExpenses += sumAmounts(projectData.expenses?.[yearStr]);
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    years: allYears,
  };
};

export const getAvailableYears = (projects: Projects, currentProject: string): number[] => {
  if (!currentProject || !projects[currentProject]) {
    return [new Date().getFullYear()];
  }

  const projectYears = getProjectYears(projects[currentProject]);
  return projectYears.length > 0 ? projectYears : [new Date().getFullYear()];
};
