"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getCountFromServer } from "firebase/firestore";
import { ArrowDownLeft, ArrowUpRight, Images, Wallet } from "lucide-react";
import { db } from "@/lib/firebase";
import { formatTaka } from "@/lib/utils/formatTaka";
import { calculateProjectTotals, calculateTotals, getRecentTransactions } from "@/lib/utils/projectStats";
import type { Projects } from "@/types";
import PageHeader from "./PageHeader";
import SyncIndicator from "./SyncIndicator";
import { saveSelectedProject } from "./selectedProject";

const RECENT_TRANSACTION_COUNT = 8;
const CARD_CLASS = "bg-white rounded-lg shadow-sm";
const LINK_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

const balanceColor = (balance: number) => {
  if (balance > 0) return "text-green-600";
  if (balance < 0) return "text-red-600";
  return "text-gray-600";
};

const StatCard = ({ label, value, valueClass, className = "" }: { label: string; value: string; valueClass: string; className?: string }) => (
  <div className={`${CARD_CLASS} p-4 ${className}`}>
    <p className="text-xs sm:text-sm text-gray-500">{label}</p>
    <p className={`mt-1 text-lg sm:text-xl font-bold ${valueClass}`}>{value}</p>
  </div>
);

interface OverviewScreenProps {
  projects: Projects;
}

const OverviewScreen = ({ projects }: OverviewScreenProps) => {
  const [galleryCount, setGalleryCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCountFromServer(collection(db, "gallery"))
      .then((snapshot) => {
        if (!cancelled) setGalleryCount(snapshot.data().count);
      })
      .catch((error) => console.error("Error counting gallery items:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const projectRows = useMemo(
    () =>
      Object.keys(projects)
        .sort((a, b) => a.localeCompare(b))
        .map((name) => ({ name, ...calculateProjectTotals(projects, name) })),
    [projects]
  );

  const allTime = useMemo(() => {
    const totalIncome = projectRows.reduce((sum, row) => sum + row.totalIncome, 0);
    const totalExpenses = projectRows.reduce((sum, row) => sum + row.totalExpenses, 0);
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  }, [projectRows]);

  const thisYear = useMemo(() => {
    const yearTotals = Object.keys(projects).map((name) => calculateTotals(projects, name, currentYear));
    const totalIncome = yearTotals.reduce((sum, totals) => sum + totals.totalIncome, 0);
    const totalExpenses = yearTotals.reduce((sum, totals) => sum + totals.totalExpenses, 0);
    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
  }, [projects, currentYear]);

  const recentTransactions = useMemo(() => getRecentTransactions(projects, RECENT_TRANSACTION_COUNT), [projects]);

  return (
    <>
      <PageHeader
        title="Overview"
        description="All projects, all years, at a glance."
        actions={
          <div className="flex flex-col xs:flex-row xs:items-center gap-2">
            <SyncIndicator />
            <div className="grid grid-cols-2 xs:flex gap-2">
              <Link href="/dashboard/finance" className={`${LINK_BUTTON_CLASS} bg-emerald-700 text-white hover:bg-emerald-800`}>
                <Wallet size={16} />
                Finances
              </Link>
              <Link
                href="/dashboard/gallery"
                className={`${LINK_BUTTON_CLASS} bg-white border border-gray-300 text-gray-700 hover:bg-gray-100`}
              >
                <Images size={16} />
                Gallery
              </Link>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard label="Total Income" value={formatTaka(allTime.totalIncome)} valueClass="text-green-600" />
        <StatCard label="Total Expenses" value={formatTaka(allTime.totalExpenses)} valueClass="text-red-600" />
        <StatCard
          label="Net Balance"
          value={formatTaka(allTime.balance)}
          valueClass={balanceColor(allTime.balance)}
          className="col-span-2 lg:col-span-1"
        />
        <StatCard label="Projects" value={String(projectRows.length)} valueClass="text-gray-900" />
        <StatCard
          label="Gallery Items"
          value={galleryCount === null ? "—" : String(galleryCount)}
          valueClass="text-gray-900"
        />
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 sm:mb-6">
        <h2 className="text-sm font-medium text-emerald-800 mb-2">This Year ({currentYear})</h2>
        <dl className="grid grid-cols-1 xs:grid-cols-3 gap-2 text-sm">
          <div className="flex justify-between xs:block">
            <dt className="text-emerald-700">Income</dt>
            <dd className="font-bold text-green-600">{formatTaka(thisYear.totalIncome)}</dd>
          </div>
          <div className="flex justify-between xs:block">
            <dt className="text-emerald-700">Expenses</dt>
            <dd className="font-bold text-red-600">{formatTaka(thisYear.totalExpenses)}</dd>
          </div>
          <div className="flex justify-between xs:block">
            <dt className="text-emerald-700">Balance</dt>
            <dd className={`font-bold ${balanceColor(thisYear.balance)}`}>{formatTaka(thisYear.balance)}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6 items-start">
        <section className={`${CARD_CLASS} xl:col-span-3 min-w-0`}>
          <h2 className="px-4 sm:px-6 py-4 border-b text-base font-semibold text-gray-800">Projects</h2>
          {projectRows.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No projects yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-gray-500 border-b">
                    <th scope="col" className="px-4 sm:px-6 py-3 text-left font-medium">Project</th>
                    <th scope="col" className="px-3 py-3 text-right font-medium">Income</th>
                    <th scope="col" className="px-3 py-3 text-right font-medium">Expenses</th>
                    <th scope="col" className="px-4 sm:px-6 py-3 text-right font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projectRows.map((row) => (
                    <tr key={row.name} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-3">
                        <Link
                          href="/dashboard/finance"
                          onClick={() => saveSelectedProject(row.name)}
                          className="font-medium text-emerald-800 hover:underline"
                        >
                          {row.name}
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-right text-green-600 whitespace-nowrap">{formatTaka(row.totalIncome)}</td>
                      <td className="px-3 py-3 text-right text-red-600 whitespace-nowrap">{formatTaka(row.totalExpenses)}</td>
                      <td className={`px-4 sm:px-6 py-3 text-right font-semibold whitespace-nowrap ${balanceColor(row.balance)}`}>
                        {formatTaka(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className={`${CARD_CLASS} xl:col-span-2 min-w-0`}>
          <h2 className="px-4 sm:px-6 py-4 border-b text-base font-semibold text-gray-800">Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentTransactions.map(({ project, type, transaction }) => {
                const isIncome = type === "income";
                const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
                return (
                  <li key={`${type}-${project}-${transaction.id}`} className="flex items-center gap-3 px-4 sm:px-6 py-3">
                    <span
                      className={`flex items-center justify-center shrink-0 w-8 h-8 rounded-full ${
                        isIncome ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      }`}
                      title={isIncome ? "Income" : "Expense"}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{transaction.donor}</p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(transaction.date).toLocaleDateString("en-BD")} · {project}
                      </p>
                    </div>
                    <span className={`shrink-0 text-sm font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                      {isIncome ? "+" : "-"}
                      {formatTaka(transaction.amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default OverviewScreen;
