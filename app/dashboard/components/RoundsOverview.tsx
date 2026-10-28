import { formatTaka } from "@/lib/utils/formatTaka";
import { formatRoundDates, type RoundSummary } from "@/lib/utils/projectRounds";

interface RoundsOverviewProps {
  roundSummaries: RoundSummary[];
  selectedRoundId: string | null; // null = year view, no card highlighted
  onSelectRound: (roundId: string) => void;
}

const balanceColor = (amount: number) => (amount >= 0 ? "text-green-600" : "text-red-600");

// One card per round, oldest first, with the balance carried forward after each — the same
// "1st time / 2nd time / 3rd time" reading as the spreadsheet. Clicking a card opens that round.
const RoundsOverview = ({ roundSummaries, selectedRoundId, onSelectRound }: RoundsOverviewProps) => (
  <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 mb-4 sm:mb-6">
    <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Rounds</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {roundSummaries.map((summary) => {
        const isSelected = summary.round.id === selectedRoundId;
        return (
          <button
            key={summary.round.id}
            type="button"
            onClick={() => onSelectRound(summary.round.id)}
            className={`text-left rounded-lg border p-3 sm:p-4 transition-colors ${
              isSelected ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
            aria-pressed={isSelected}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-gray-900">{summary.round.name}</span>
              <span className="text-xs text-gray-500 whitespace-nowrap">{formatRoundDates(summary)}</span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-gray-500">Income</dt>
                <dd className="font-medium text-green-600">{formatTaka(summary.totalIncome)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Expenses</dt>
                <dd className="font-medium text-red-600">{formatTaka(summary.totalExpenses)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Balance</dt>
                <dd className={`font-medium ${balanceColor(summary.balance)}`}>{formatTaka(summary.balance)}</dd>
              </div>
            </dl>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs">
              <span className="text-gray-500">Fund balance after this round</span>
              <span className={`font-semibold ${balanceColor(summary.runningBalance)}`}>
                {formatTaka(summary.runningBalance)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default RoundsOverview;
