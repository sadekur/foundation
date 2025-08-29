// src/components/SummaryCards.js
import React from 'react';

const SummaryCards = ({ totalIncome, totalExpenses, balance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
        <p className="text-2xl font-bold text-green-600">৳{totalIncome.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
        <p className="text-2xl font-bold text-red-600">৳{totalExpenses.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-600">Balance</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ৳{balance.toLocaleString()}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-600">Status</h3>
        <p className={`text-lg font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {balance >= 0 ? 'Surplus' : 'Deficit'}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;