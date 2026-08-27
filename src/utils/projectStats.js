// Pure helpers for deriving stats from the { income, expenses } project data shape.
// Kept free of component state so they're reusable and easy to memoize.

export const getProjectYearKeys = (projectData) =>
  new Set([
    ...Object.keys(projectData?.income || {}),
    ...Object.keys(projectData?.expenses || {}),
  ]);

export const getProjectYears = (projectData) => {
  if (!projectData) return [];
  return Array.from(getProjectYearKeys(projectData)).map(Number).sort((a, b) => b - a);
};

export const calculateTotals = (projects, currentProject, selectedYear) => {
  if (!currentProject || !projects[currentProject]) {
    return { totalIncome: 0, totalExpenses: 0, balance: 0 };
  }

  const year = selectedYear.toString();
  const projectData = projects[currentProject];

  const incomeData = projectData.income?.[year] || {};
  const expenseData = projectData.expenses?.[year] || {};

  const totalIncome = Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);

  return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
};

export const calculateProjectTotals = (projects, projectName) => {
  if (!projectName || !projects[projectName]) {
    return { totalIncome: 0, totalExpenses: 0, balance: 0, years: [] };
  }

  const projectData = projects[projectName];
  const allYears = getProjectYears(projectData);

  let totalIncome = 0;
  let totalExpenses = 0;

  allYears.forEach(year => {
    const yearStr = year.toString();
    const incomeData = projectData.income?.[yearStr] || {};
    const expenseData = projectData.expenses?.[yearStr] || {};

    totalIncome += Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
    totalExpenses += Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    years: allYears,
  };
};

export const getAvailableYears = (projects, currentProject) => {
  if (!currentProject || !projects[currentProject]) {
    return [new Date().getFullYear()];
  }

  const projectYears = getProjectYears(projects[currentProject]);
  return projectYears.length > 0 ? projectYears : [new Date().getFullYear()];
};
