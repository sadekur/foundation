import { useMemo, useState } from "react";
import { parseProjectsImport } from "@/lib/utils/importProjects";
import type { Projects } from "@/types";

interface ImportProjectsModalProps {
  show: boolean;
  existingProjects: Projects;
  onImport: (imported: Projects) => Promise<void>;
  onCancel: () => void;
}

const EXAMPLE = `{
  "projects": {
    "Zakat": {
      "income":   [["2024-04-06", "Donor name", 1000]],
      "expenses": [["2025-02-28", "What it was spent on", 1000]]
    }
  }
}`;

const ImportProjectsModal = ({ show, existingProjects, onImport, onCancel }: ImportProjectsModalProps) => {
  const [raw, setRaw] = useState("");
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(() => {
    if (!raw.trim()) return null;
    try {
      return { ok: true as const, ...parseProjectsImport(raw, existingProjects) };
    } catch (error) {
      return { ok: false as const, error: (error as Error).message };
    }
  }, [raw, existingProjects]);

  if (!show) return null;

  const handleFile = async (file: File | undefined) => {
    if (file) setRaw(await file.text());
  };

  const handleClose = () => {
    setRaw("");
    onCancel();
  };

  const handleImport = async () => {
    if (!parsed?.ok) return;
    setSaving(true);
    try {
      await onImport(parsed.projects);
      setRaw("");
    } finally {
      setSaving(false);
    }
  };

  const replacing = parsed?.ok ? parsed.summaries.filter((s) => s.replacesExisting).length : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-1">Import Projects</h3>
        <p className="text-sm text-gray-500 mb-4">
          Paste or upload project data as JSON. Each imported project <strong>replaces</strong> any existing project
          with the same name; all other projects are left untouched.
        </p>

        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={EXAMPLE}
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500"
          aria-label="Import JSON"
        />
        <input
          type="file"
          accept="application/json,.json"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="mt-2 block text-sm text-gray-600"
          aria-label="Upload import JSON file"
        />

        {parsed && !parsed.ok && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{parsed.error}</div>
        )}

        {parsed?.ok && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-3 font-medium">Project</th>
                  <th className="py-2 pr-3 font-medium text-right">Income</th>
                  <th className="py-2 pr-3 font-medium text-right">Expenses</th>
                  <th className="py-2 pr-3 font-medium text-right">Balance</th>
                  <th className="py-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {parsed.summaries.map((s) => (
                  <tr key={s.name} className="border-b last:border-0">
                    <td className="py-2 pr-3">{s.name}</td>
                    <td className="py-2 pr-3 text-right text-green-600">
                      {s.totalIncome.toLocaleString()} <span className="text-gray-400">({s.incomeCount})</span>
                    </td>
                    <td className="py-2 pr-3 text-right text-red-600">
                      {s.totalExpenses.toLocaleString()} <span className="text-gray-400">({s.expenseCount})</span>
                    </td>
                    <td
                      className={`py-2 pr-3 text-right font-medium ${
                        s.totalIncome - s.totalExpenses >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(s.totalIncome - s.totalExpenses).toLocaleString()}
                    </td>
                    <td className="py-2 text-xs">
                      {s.replacesExisting ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">replaces</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">new</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleImport}
            disabled={!parsed?.ok || saving}
            className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving
              ? "Importing…"
              : parsed?.ok
                ? `Import ${parsed.summaries.length} project${parsed.summaries.length !== 1 ? "s" : ""}${
                    replacing ? ` (${replacing} replaced)` : ""
                  }`
                : "Import"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportProjectsModal;
