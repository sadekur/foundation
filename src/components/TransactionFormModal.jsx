// src/components/TransactionFormModal.js
import React from 'react';

const TransactionFormModal = ({ 
  show, 
  type, // 'income' or 'expense'
  formData, 
  setFormData, 
  onSubmit, 
  onCancel 
}) => {
  if (!show) return null;

  const isIncome = type === 'income';
  const title = isIncome ? 'Income' : 'Expense';
  const buttonColor = isIncome ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Add {title}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isIncome ? 'Donor' : 'Expense For'}
            </label>
            <input
              type="text"
              value={formData.donor}
              onChange={(e) => handleInputChange('donor', e.target.value)}
              placeholder={isIncome ? "Enter donor name" : "Enter expense description"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (৳)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className={`flex-1 text-white p-3 rounded-lg transition-colors ${buttonColor}`}
            >
              Add {title}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;