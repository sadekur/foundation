// src/components/TransactionTable.js
import React from "react";
import { Trash2 } from "lucide-react";

const TransactionTable = ({ transactions, onDelete, type }) => {
  const transactionList = Object.values(transactions || {});

  if (transactionList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type} records found for this year</p>
        <p className="text-sm mt-2">
          Add your first {type} entry using the button above
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[400px]">
        <thead>
          <tr className="border-b">
            <th className="text-left p-1.5 xs:p-2 sm:p-3 font-medium text-gray-700 text-xs xs:text-sm">
              Date
            </th>
            <th className="text-left p-1.5 xs:p-2 sm:p-3 font-medium text-gray-700 text-xs xs:text-sm">
              {type === "income" ? "Donor" : "Description"}
            </th>
            <th className="text-left p-1.5 xs:p-2 sm:p-3 font-medium text-gray-700 text-xs xs:text-sm">
              Amount (৳)
            </th>
            <th className="text-center p-1.5 xs:p-2 sm:p-3 font-medium text-gray-700 text-xs xs:text-sm w-16 xs:w-20">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactionList
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="p-1.5 xs:p-2 sm:p-3 text-xs xs:text-sm whitespace-nowrap">
                  {new Date(transaction.date).toLocaleDateString("en-BD")}
                </td>
                <td
                  className="p-1.5 xs:p-2 sm:p-3 text-xs xs:text-sm max-w-[120px] xs:max-w-[150px] sm:max-w-none truncate"
                  title={transaction.donor}
                >
                  {transaction.donor}
                </td>
                <td className="p-1.5 xs:p-2 sm:p-3 font-medium text-xs xs:text-sm whitespace-nowrap">
                  ৳{transaction.amount.toLocaleString("en-BD")}
                </td>
                <td className="p-1.5 xs:p-2 sm:p-3 text-center">
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 xs:p-1.5 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    title="Delete transaction"
                    aria-label="Delete transaction"
                  >
                    <Trash2 size={14} className="xs:w-4 xs:h-4" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 font-semibold bg-gray-50">
            <td colSpan="2" className="p-1.5 xs:p-2 sm:p-3 text-xs xs:text-sm">
              Total:
            </td>
            <td className="p-1.5 xs:p-2 sm:p-3 text-xs xs:text-sm whitespace-nowrap">
              ৳
              {transactionList
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString("en-BD")}
            </td>
            <td className="p-1.5 xs:p-2 sm:p-3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;
