import type { ProjectData, Projects, Transaction, TransactionType } from "@/types";

// Bulk-import format, one entry per project (e.g. one per Google Sheet tab):
//   { "projects": { "<name>": { "income": [[date, donor, amount], ...], "expenses": [...] } } }
// `date` is YYYY-MM-DD (same as the transaction form's <input type="date">). For expenses,
// `donor` holds the description, matching how the expense form reuses that field.
type ImportRow = [string, string, number];

export interface ImportSummary {
  name: string;
  incomeCount: number;
  expenseCount: number;
  totalIncome: number;
  totalExpenses: number;
  replacesExisting: boolean;
}

export interface ParsedImport {
  projects: Projects;
  summaries: ImportSummary[];
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toTransactions = (
  rows: unknown,
  label: string,
  idPrefix: string,
  createdAt: string
): Record<string, Record<string, Transaction>> => {
  if (!Array.isArray(rows)) throw new Error(`${label}: expected an array of [date, donor, amount] rows`);

  const byYear: Record<string, Record<string, Transaction>> = {};
  rows.forEach((row, i) => {
    const [date, donor, amount] = (Array.isArray(row) ? row : []) as ImportRow;
    if (typeof date !== "string" || !DATE_RE.test(date)) {
      throw new Error(`${label} row ${i + 1}: invalid date ${JSON.stringify(date)} (expected YYYY-MM-DD)`);
    }
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      throw new Error(`${label} row ${i + 1}: invalid amount ${JSON.stringify(amount)}`);
    }

    const year = date.slice(0, 4);
    const id = `${idPrefix}${String(i).padStart(4, "0")}`;
    byYear[year] = byYear[year] || {};
    byYear[year][id] = {
      id,
      date,
      donor: String(donor ?? "").trim() || "—",
      amount,
      year: Number(year),
      createdAt,
    };
  });
  return byYear;
};

const sumAmounts = (byYear: Record<string, Record<string, Transaction>>) =>
  Object.values(byYear).reduce(
    (acc, txs) => {
      Object.values(txs).forEach((t) => {
        acc.count += 1;
        acc.total += t.amount;
      });
      return acc;
    },
    { count: 0, total: 0 }
  );

// Parses and validates pasted import JSON. Throws with a row-level message on bad input so the
// modal can show exactly what's wrong instead of writing partial data.
export const parseProjectsImport = (raw: string, existing: Projects): ParsedImport => {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Not valid JSON");
  }

  const input = (data as { projects?: unknown })?.projects;
  if (!input || typeof input !== "object") throw new Error('Missing top-level "projects" object');

  const createdAt = new Date().toISOString();
  const base = Date.now().toString();
  const projects: Projects = {};
  const summaries: ImportSummary[] = [];

  Object.entries(input as Record<string, Record<TransactionType, unknown>>).forEach(([rawName, p], pi) => {
    const name = rawName.trim();
    if (!name) throw new Error("A project has an empty name");

    const income = toTransactions(p?.income ?? [], `${name} / income`, `${base}${pi}i`, createdAt);
    const expenses = toTransactions(p?.expenses ?? [], `${name} / expenses`, `${base}${pi}e`, createdAt);
    const years = [...Object.keys(income), ...Object.keys(expenses)].map(Number);

    const project: ProjectData = {
      income,
      expenses,
      createdAt,
      createdYear: years.length ? Math.min(...years) : new Date().getFullYear(),
    };
    projects[name] = project;

    const inc = sumAmounts(income);
    const exp = sumAmounts(expenses);
    summaries.push({
      name,
      incomeCount: inc.count,
      expenseCount: exp.count,
      totalIncome: inc.total,
      totalExpenses: exp.total,
      replacesExisting: Boolean(existing[name]),
    });
  });

  if (!summaries.length) throw new Error("No projects found in the import");
  return { projects, summaries };
};
