import { useState } from "react";
import { Trash2 } from "lucide-react";
import { formatRoundDates, type RoundSummary } from "@/lib/utils/projectRounds";

interface ManageRoundsModalProps {
  show: boolean;
  projectName: string;
  roundSummaries: RoundSummary[];
  onAdd: (name: string, startDate: string) => void;
  onDelete: (roundId: string) => void;
  onClose: () => void;
}

const ManageRoundsModal = ({ show, projectName, roundSummaries, onAdd, onDelete, onClose }: ManageRoundsModalProps) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate) return;
    onAdd(name.trim(), startDate);
    setName("");
    setStartDate("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold">Rounds — {projectName}</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Each income and expense belongs to the latest round that started on or before its date. Deleting a round
          keeps its transactions — they move into the previous round.
        </p>

        {roundSummaries.length > 0 ? (
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg mb-5">
            {roundSummaries.map((summary) => (
              <li key={summary.round.id} className="flex items-center justify-between gap-3 px-3 py-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900">{summary.round.name}</div>
                  <div className="text-xs text-gray-500">
                    Starts {new Date(summary.round.startDate).toLocaleDateString("en-GB")} · {formatRoundDates(summary)} ·{" "}
                    {summary.transactionCount} transactions
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(summary.round.id)}
                  className="flex-shrink-0 p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  aria-label={`Delete round ${summary.round.name}`}
                  title="Delete round"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-3 mb-5">
            This project has no rounds yet, so it&apos;s shown by year only. Add its first round to start tracking it
            round by round.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Start a new round</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Round name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 4th Conference"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Round
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageRoundsModal;
