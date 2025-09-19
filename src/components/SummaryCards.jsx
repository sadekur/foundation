// src/components/SummaryCards.js
import { CreditCard, DollarSign, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

const SummaryCards = ({ 
  totalIncome, 
  totalExpenses, 
  balance, 
  year 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0) return <TrendingUp size={20} className="text-green-500" />;
    if (balance < 0) return <TrendingDown size={20} className="text-red-500" />;
    return <Minus size={20} className="text-gray-500" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Income Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Income ({year})
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
            {totalIncome > 0 && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <DollarSign size={16} className="mr-1" />
                <span>Revenue Generated</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <DollarSign size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Expenses ({year})
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
            {totalExpenses > 0 && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <CreditCard size={16} className="mr-1" />
                <span>Total Spent</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <CreditCard size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
        balance >= 0 ? 'border-green-500' : 'border-red-500'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Net Balance ({year})
            </h3>
            <p className={`text-3xl font-bold ${getBalanceColor(balance)}`}>
              {formatCurrency(balance)}
            </p>
            <div className="mt-2 flex items-center text-sm">
              {getBalanceIcon(balance)}
              <span className={`ml-1 ${getBalanceColor(balance)}`}>
                {balance > 0 ? 'Surplus' : balance < 0 ? 'Deficit' : 'Break Even'}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${
            balance >= 0 ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {getBalanceIcon(balance)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;