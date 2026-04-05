// src/components/TransactionTable.js
import React, { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteConfirmationModal from "./common/DeleteConfirmationModal";

const TransactionTable = ({ 
  transactions, 
  onDelete, 
  type,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  startRecord = 0,
  endRecord = 0,
  onPreviousPage,
  onNextPage
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const transactionList = Array.isArray(transactions) ? transactions : Object.values(transactions || {});

  const handleDeleteClick = (transactionId) => {
    setSelectedTransactionId(transactionId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTransactionId) {
      onDelete(selectedTransactionId);
      setDeleteModalOpen(false);
      setSelectedTransactionId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedTransactionId(null);
  };

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
      {/* Record count display */}
      {totalItems > 0 && (
        <div className="mb-3 flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing {startRecord}-{endRecord} of {totalItems} records
          </span>
        </div>
      )}

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
          {transactionList.map((transaction) => (
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
                  onClick={() => handleDeleteClick(transaction.id)}
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
              Total (this page):
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

      {/* Pagination Controls */}
      {totalItems > 10 && (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
              }`}
              aria-label="Next page"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={deleteModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={type === "income" ? "income transaction" : "expense transaction"}
      />
    </div>
  );
};

export default TransactionTable;
