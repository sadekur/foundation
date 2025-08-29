// src/components/TransactionSection.js
import React from 'react';
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
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onAddTransaction}
            className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors ${colorClasses[buttonColor]}`}
          >
            <Plus size={16} />
            Add {title}
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <TransactionTable
          transactions={transactions}
          onDelete={onDelete}
          type={type}
        />
      </div>
    </div>
  );
};

export default TransactionSection;