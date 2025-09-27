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
  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
    
    {/* Income Card */}
    <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 border-l-4 border-green-500 
                    hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start xs:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2 leading-tight">
            Total Income ({year})
          </h3>
          <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 break-words leading-tight">
            {formatCurrency(totalIncome)}
          </p>
          {totalIncome > 0 && (
            <div className="mt-1.5 xs:mt-2 flex items-center text-xs xs:text-sm text-green-600">
              <DollarSign size={14} className="xs:w-4 xs:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">Revenue Generated</span>
            </div>
          )}
        </div>
        <div className="p-2 xs:p-2.5 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
          <DollarSign size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
      </div>
    </div>

    {/* Expenses Card */}
    <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 border-l-4 border-red-500 
                    hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start xs:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2 leading-tight">
            Total Expenses ({year})
          </h3>
          <p className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 break-words leading-tight">
            {formatCurrency(totalExpenses)}
          </p>
          {totalExpenses > 0 && (
            <div className="mt-1.5 xs:mt-2 flex items-center text-xs xs:text-sm text-red-600">
              <CreditCard size={14} className="xs:w-4 xs:h-4 mr-1 flex-shrink-0" />
              <span className="truncate">Total Spent</span>
            </div>
          )}
        </div>
        <div className="p-2 xs:p-2.5 sm:p-3 bg-red-100 rounded-full flex-shrink-0">
          <CreditCard size={18} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-red-600" />
        </div>
      </div>
    </div>

    {/* Balance Card */}
    <div className={`bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 border-l-4 
                     hover:shadow-md transition-shadow duration-200
                     xs:col-span-2 lg:col-span-1 ${
      balance >= 0 ? 'border-green-500' : 'border-red-500'
    }`}>
      <div className="flex items-start xs:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-xs xs:text-sm font-medium text-gray-500 mb-1 xs:mb-2 leading-tight">
            Net Balance ({year})
          </h3>
          <p className={`text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold break-words leading-tight ${getBalanceColor(balance)}`}>
            {formatCurrency(balance)}
          </p>
          <div className="mt-1.5 xs:mt-2 flex items-center text-xs xs:text-sm">
            <span className="mr-1 flex-shrink-0">
              {getBalanceIcon(balance)}
            </span>
            <span className={`truncate ${getBalanceColor(balance)}`}>
              {balance > 0 ? 'Surplus' : balance < 0 ? 'Deficit' : 'Break Even'}
            </span>
          </div>
        </div>
        <div className={`p-2 xs:p-2.5 sm:p-3 rounded-full flex-shrink-0 ${
          balance >= 0 ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <span className="block w-[18px] h-[18px] xs:w-5 xs:h-5 sm:w-6 sm:h-6">
            {getBalanceIcon(balance)}
          </span>
        </div>
      </div>
    </div>

    {/* Mobile-Only Additional Info Cards */}
    <div className="xs:hidden col-span-1 space-y-3">
      {/* Quick Stats Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
        <h4 className="text-xs font-medium text-blue-800 mb-2">Quick Stats</h4>
        <div className="space-y-1 text-xs text-blue-700">
          <div className="flex justify-between">
            <span>Period:</span>
            <span className="font-medium">{year}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {balance > 0 ? 'Positive' : balance < 0 ? 'Negative' : 'Even'}
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Tablet-Only Performance Indicator */}
    {/* <div className="hidden xs:block lg:hidden col-span-2">
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Financial Performance ({year})
            </h4>
            <p className="text-xs text-gray-600">
              {balance > 0 
                ? `Positive cash flow of ${formatCurrency(balance)}` 
                : balance < 0 
                ? `Cash deficit of ${formatCurrency(Math.abs(balance))}` 
                : 'Balanced budget achieved'
              }
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            balance > 0 
              ? 'bg-green-100 text-green-800' 
              : balance < 0 
              ? 'bg-red-100 text-red-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {balance > 0 ? 'Surplus' : balance < 0 ? 'Deficit' : 'Balanced'}
          </div>
        </div>
      </div>
    </div> */}
  </div>
);
};

export default SummaryCards;