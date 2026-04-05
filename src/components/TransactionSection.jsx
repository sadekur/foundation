// src/components/TransactionSection.js
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    return Object.values(transactions || {})
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return sortedTransactions;
    
    const query = searchQuery.toLowerCase();
    return sortedTransactions.filter(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('en-BD').toLowerCase();
      const donor = transaction.donor.toLowerCase();
      const amount = transaction.amount.toString();
      
      return date.includes(query) || donor.includes(query) || amount.includes(query);
    });
  }, [sortedTransactions, searchQuery]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setIsLoading(true);
    // Simulate small delay for loader visibility
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsLoading(false);
    }, 300);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Reset to page 1 when transactions or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions, searchQuery]);

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

      {/* Search Bar */}
      <div className="px-6 pt-4 pb-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by date, donor, or amount...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="p-6 pt-2">
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default TransactionSection;