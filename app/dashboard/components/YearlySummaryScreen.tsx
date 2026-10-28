"use client";

import { ArrowLeft, Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { Fragment, useState } from "react";
import { formatTaka } from "@/lib/utils/formatTaka";
import { calculateRoundSummaries, formatRoundDates, type RoundSummary } from "@/lib/utils/projectRounds";
import type { Projects } from "@/types";

interface YearlySummaryScreenProps {
  projects: Projects;
  onBack: () => void;
}

interface SummaryRow {
  project: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeTransactions: number;
  expenseTransactions: number;
  totalTransactions: number;
}

interface ProjectGroup {
  project: string;
  years: number[];
  rows: SummaryRow[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalTransactions: number;
}

// "2023–2026 · 4 yrs" when the years are consecutive, otherwise a short list — keeps the
// cell one line wide no matter how many years a project runs.
const formatYearRange = (years: number[]) => {
  if (years.length === 0) return "No data";
  if (years.length === 1) return String(years[0]);
  const sorted = [...years].sort((a, b) => a - b);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const consecutive = last - first === sorted.length - 1;
  return consecutive ? `${first}–${last} · ${sorted.length} yrs` : `${sorted.join(", ")}`;
};

const YearlySummaryScreen = ({ projects, onBack }: YearlySummaryScreenProps) => {
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleProject = (project: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(project)) next.delete(project);
      else next.add(project);
      return next;
    });
  };

  // A single filtered project is shown already expanded — there's nothing else to look at.
  const isExpanded = (project: string) => selectedProject === project || expandedProjects.has(project);

  // Projects that run in rounds expand round by round (all years only — a round can span
  // several years, so it can't be cut down to one); every other project expands by year.
  const getRounds = (project: string): RoundSummary[] =>
    selectedYear === "all" ? calculateRoundSummaries(projects[project]) : [];

  const calculateYearlySummaryData = (): SummaryRow[] => {
    const summaryData: SummaryRow[] = [];

    Object.keys(projects).forEach((projectName) => {
      const project = projects[projectName];
      const allYears = new Set([
        ...Object.keys(project.income || {}),
        ...Object.keys(project.expenses || {}),
      ]);

      allYears.forEach((year) => {
        const incomeData = project.income?.[year] || {};
        const expenseData = project.expenses?.[year] || {};

        const totalIncome = Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
        const balance = totalIncome - totalExpenses;

        const incomeTransactions = Object.keys(incomeData).length;
        const expenseTransactions = Object.keys(expenseData).length;
        const totalTransactions = incomeTransactions + expenseTransactions;

        summaryData.push({
          project: projectName,
          year: parseInt(year),
          totalIncome,
          totalExpenses,
          balance,
          incomeTransactions,
          expenseTransactions,
          totalTransactions,
        });
      });
    });

    return summaryData.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.project.localeCompare(b.project);
    });
  };

  const summaryData = calculateYearlySummaryData();

  // Filter data based on selections
  const filteredData = summaryData.filter((item) => {
    const projectMatch = selectedProject === "all" || item.project === selectedProject;
    const yearMatch = selectedYear === "all" || item.year === parseInt(selectedYear);
    return projectMatch && yearMatch;
  });

  // Roll the filtered per-year rows up into one group per project (rows stay newest-first).
  const projectGroups: ProjectGroup[] = Object.values(
    filteredData.reduce<Record<string, ProjectGroup>>((groups, item) => {
      const group = (groups[item.project] ??= {
        project: item.project,
        years: [],
        rows: [],
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        totalTransactions: 0,
      });
      group.years.push(item.year);
      group.rows.push(item);
      group.totalIncome += item.totalIncome;
      group.totalExpenses += item.totalExpenses;
      group.balance += item.balance;
      group.totalTransactions += item.totalTransactions;
      return groups;
    }, {})
  ).sort((a, b) => a.project.localeCompare(b.project));

  // Calculate grand totals from filtered data
  const grandTotals = filteredData.reduce(
    (totals, item) => ({
      income: totals.income + item.totalIncome,
      expenses: totals.expenses + item.totalExpenses,
      balance: totals.balance + item.balance,
      transactions: totals.transactions + item.totalTransactions,
    }),
    { income: 0, expenses: 0, balance: 0, transactions: 0 }
  );

  // Get unique years and projects for filters
  const allYears = [...new Set(summaryData.map((item) => item.year))].sort((a, b) => b - a);
  const allProjects = [...new Set(summaryData.map((item) => item.project))].sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-4 sm:py-6">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
            <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors
                          p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500
                          w-fit"
              >
                <ArrowLeft size={16} className="xs:w-5 xs:h-5" />
                <span className="text-sm xs:text-base">Back to Dashboard</span>
              </button>
              <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                Foundation Yearly Summary
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-none xs:max-w-sm sm:max-w-3xl md:max-w-5xl lg:max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">

        {/* Filters - Responsive */}
        <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 xs:gap-4 sm:items-end">
            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                Filter by Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                          border border-gray-300 rounded-md xs:rounded-lg
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          transition-all duration-200"
              >
                <option value="all">All Projects</option>
                {allProjects.map((project) => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-0 sm:min-w-[200px]">
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                Filter by Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                          border border-gray-300 rounded-md xs:rounded-lg
                          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                          transition-all duration-200"
              >
                <option value="all">All Years</option>
                {allYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6">
            <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2">Total Income</h3>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-green-600 break-words">
              {formatTaka(grandTotals.income)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6">
            <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2">Total Expenses</h3>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-red-600 break-words">
              {formatTaka(grandTotals.expenses)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6">
            <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2">Net Balance</h3>
            <p className={`text-lg xs:text-xl sm:text-2xl font-bold break-words ${grandTotals.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatTaka(grandTotals.balance)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6">
            <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2">Total Projects</h3>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-blue-600">
              {Object.keys(projects).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 xs:col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2">Total Transactions</h3>
            <p className="text-lg xs:text-xl sm:text-2xl font-bold text-purple-600">
              {grandTotals.transactions}
            </p>
          </div>
        </div>

        {/* Project Summary - one row per project; click a row to expand its year-by-year breakdown,
            so the table grows with the number of projects, not projects × years. */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-3 xs:px-4 sm:px-6 py-3 xs:py-4 border-b border-gray-200">
            <h2 className="text-base xs:text-lg font-semibold text-gray-900">
              {selectedYear === "all" ? "Project Summary (All Years)" : `Project Summary (${selectedYear})`}
            </h2>
            <p className="text-xs xs:text-sm text-gray-600 mt-1">
              {selectedProject !== "all" && `Project: ${selectedProject} • `}
              {selectedYear === "all"
                ? "Click a project to see its year-by-year breakdown"
                : `Showing each project's figures for ${selectedYear} only`}
            </p>
          </div>

          {projectGroups.length === 0 ? (
            <div className="p-6 xs:p-8 text-center text-gray-500">
              <Calendar size={32} className="xs:w-12 xs:h-12 mx-auto mb-3 xs:mb-4 text-gray-400" />
              <h3 className="text-base xs:text-lg font-medium mb-2">No Data Available</h3>
              <p className="text-sm xs:text-base">No data matches the selected filters or add some transactions to see yearly summaries.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-gray-200">
                {projectGroups.map((group) => {
                  const expandable = selectedYear === "all";
                  const isOpen = expandable && isExpanded(group.project);
                  return (
                    <div key={group.project} className="p-4 space-y-3">
                      <button
                        type="button"
                        onClick={() => expandable && toggleProject(group.project)}
                        className="w-full flex justify-between items-start gap-3 text-left"
                        aria-expanded={expandable ? isOpen : undefined}
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-sm">{group.project}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{formatYearRange(group.years)}</div>
                        </div>
                        {expandable && (
                          <ChevronDown
                            size={18}
                            className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        )}
                      </button>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Income:</span>
                          <div className="font-medium text-green-600">{formatTaka(group.totalIncome)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Expenses:</span>
                          <div className="font-medium text-red-600">{formatTaka(group.totalExpenses)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Balance:</span>
                          <div className={`font-medium ${group.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatTaka(group.balance)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Transactions:</span>
                          <div className="font-medium">{group.totalTransactions}</div>
                        </div>
                      </div>
                      {isOpen && (
                        <div className="rounded-md bg-gray-50 divide-y divide-gray-200 text-xs">
                          {group.rows.map((item) => (
                            <div key={item.year} className="grid grid-cols-4 gap-2 px-3 py-2">
                              <span className="font-medium text-gray-700">{item.year}</span>
                              <span className="text-green-600">{formatTaka(item.totalIncome)}</span>
                              <span className="text-red-600">{formatTaka(item.totalExpenses)}</span>
                              <span className={item.balance >= 0 ? "text-green-600" : "text-red-600"}>
                                {formatTaka(item.balance)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="p-4 bg-gray-50 grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div className="col-span-2 text-sm text-gray-900">Total</div>
                  <div className="text-green-600">{formatTaka(grandTotals.income)}</div>
                  <div className="text-red-600">{formatTaka(grandTotals.expenses)}</div>
                  <div className={grandTotals.balance >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatTaka(grandTotals.balance)}
                  </div>
                  <div>{grandTotals.transactions}</div>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedYear === "all" ? "Active Years" : "Year"}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Income
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expenses
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectGroups.map((group) => {
                      const expandable = selectedYear === "all";
                      const isOpen = expandable && isExpanded(group.project);
                      return (
                        <Fragment key={group.project}>
                          <tr
                            onClick={() => expandable && toggleProject(group.project)}
                            className={`${expandable ? "cursor-pointer hover:bg-indigo-50" : ""} ${isOpen ? "bg-indigo-50/60" : ""}`}
                            aria-expanded={expandable ? isOpen : undefined}
                          >
                            <td className="px-3 sm:px-6 py-4">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                {expandable ? (
                                  <ChevronRight
                                    size={16}
                                    className={`flex-shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}
                                  />
                                ) : (
                                  <span className="w-4 flex-shrink-0" />
                                )}
                                {group.project}
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                              {formatYearRange(group.years)}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm font-medium text-green-600 text-right whitespace-nowrap">
                              {formatTaka(group.totalIncome)}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm font-medium text-red-600 text-right whitespace-nowrap">
                              {formatTaka(group.totalExpenses)}
                            </td>
                            <td
                              className={`px-3 sm:px-6 py-4 text-sm font-medium text-right whitespace-nowrap ${
                                group.balance >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {formatTaka(group.balance)}
                            </td>
                            <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 text-right">{group.totalTransactions}</td>
                          </tr>
                          {isOpen &&
                            group.rows.map((item) => (
                              <tr key={item.year} className="bg-gray-50 text-xs">
                                <td className="px-3 sm:px-6 py-2" />
                                <td className="px-3 sm:px-6 py-2 font-medium text-gray-700">{item.year}</td>
                                <td className="px-3 sm:px-6 py-2 text-green-600 text-right whitespace-nowrap">
                                  {formatTaka(item.totalIncome)}
                                </td>
                                <td className="px-3 sm:px-6 py-2 text-red-600 text-right whitespace-nowrap">
                                  {formatTaka(item.totalExpenses)}
                                </td>
                                <td
                                  className={`px-3 sm:px-6 py-2 text-right whitespace-nowrap ${
                                    item.balance >= 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {formatTaka(item.balance)}
                                </td>
                                <td className="px-3 sm:px-6 py-2 text-gray-700 text-right">{item.totalTransactions}</td>
                              </tr>
                            ))}
                        </Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-100 border-t-2 border-gray-200">
                    <tr className="text-sm font-semibold">
                      <td className="px-3 sm:px-6 py-3 text-gray-900" colSpan={2}>
                        Total ({projectGroups.length} project{projectGroups.length !== 1 ? "s" : ""})
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-green-600 text-right whitespace-nowrap">
                        {formatTaka(grandTotals.income)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-red-600 text-right whitespace-nowrap">
                        {formatTaka(grandTotals.expenses)}
                      </td>
                      <td
                        className={`px-3 sm:px-6 py-3 text-right whitespace-nowrap ${
                          grandTotals.balance >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatTaka(grandTotals.balance)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 text-gray-900 text-right">{grandTotals.transactions}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearlySummaryScreen;
