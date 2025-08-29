// src/components/TransactionTable.js
import React from 'react';
import { Trash2 } from 'lucide-react';

const TransactionTable = ({ transactions, onDelete, type }) => {
  const transactionList = Object.values(transactions || {});

  if (transactionList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No {type} records found for this year</p>
        <p className="text-sm mt-2">Add your first {type} entry using the button above</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2 font-medium text-gray-700">Date</th>
            <th className="text-left p-2 font-medium text-gray-700">
              {type === 'income' ? 'Donor' : 'Description'}
            </th>
            <th className="text-left p-2 font-medium text-gray-700">Amount (৳)</th>
            <th className="text-left p-2 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactionList
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction) => (
            <tr key={transaction.id} className="border-b hover:bg-gray-50">
              <td className="p-2">
                {new Date(transaction.date).toLocaleDateString('en-BD')}
              </td>
              <td className="p-2">{transaction.donor}</td>
              <td className="p-2 font-medium">
                ৳{transaction.amount.toLocaleString('en-BD')}
              </td>
              <td className="p-2">
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                  title="Delete transaction"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 font-semibold bg-gray-50">
            <td colSpan="2" className="p-2">Total:</td>
            <td className="p-2">
              ৳{transactionList.reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-BD')}
            </td>
            <td className="p-2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TransactionTable;