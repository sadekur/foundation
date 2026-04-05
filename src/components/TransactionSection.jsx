// src/components/TransactionSection.js
import React, { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TransactionTable from './TransactionTable';

const TransactionSection = ({
  type,
  title,
  transactions,
  onDelete,
  onAddTransaction,
  buttonColor
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  // Sort and paginate transactions
  const sortedTransactions = useMemo(() => {
    return Object.values(transactions || {})
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const totalItems = sortedTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedTransactions.slice(startIndex, endIndex);
  }, [sortedTransactions, currentPage, itemsPerPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when transactions change
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const startRecord = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-base md:text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onAddTransaction}
            className={`flex items-center gap-2 text-sm md:text-lg text-white px-[6px] py-2 md:px-4 md:py-2 rounded-lg transition-colors ${colorClasses[buttonColor]}`}
          >
            <Plus size={16} className="text-white" />
            Add {title}
          </button>
        </div>
      </div>

      <div className="p-6">
        <TransactionTable
          transactions={paginatedTransactions}
          onDelete={onDelete}
          type={type}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startRecord={startRecord}
          endRecord={endRecord}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      </div>
    </div>
  );
};

export default TransactionSection;