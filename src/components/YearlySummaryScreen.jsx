import { ArrowLeft, Calendar } from "lucide-react";

const YearlySummaryScreen = ({ 
  projects, 
  onBack 
}) => {
  const calculateYearlySummaryData = () => {
    const summaryData = [];
    
    Object.keys(projects).forEach(projectName => {
      const project = projects[projectName];
      const allYears = new Set([
        ...Object.keys(project.income || {}),
        ...Object.keys(project.expenses || {})
      ]);
      
      allYears.forEach(year => {
        const incomeData = project.income?.[year] || {};
        const expenseData = project.expenses?.[year] || {};
        
        const totalIncome = Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
        const balance = totalIncome - totalExpenses;
        
        summaryData.push({
          project: projectName,
          year: parseInt(year),
          totalIncome,
          totalExpenses,
          balance
        });
      });
    });
    
    // Sort by year (descending) then by project name
    return summaryData.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.project.localeCompare(b.project);
    });
  };

  const summaryData = calculateYearlySummaryData();
  
  // Calculate grand totals
  const grandTotals = summaryData.reduce((totals, item) => ({
    income: totals.income + item.totalIncome,
    expenses: totals.expenses + item.totalExpenses,
    balance: totals.balance + item.balance
  }), { income: 0, expenses: 0, balance: 0 });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Foundation Yearly Summary</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grand Totals Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income (All Years)</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.income)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses (All Years)</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.expenses)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Net Balance (All Years)</h3>
            <p className={`text-2xl font-bold ${grandTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(grandTotals.balance)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Projects</h3>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(projects).length}</p>
          </div>
        </div>

        {/* Yearly Summary Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Project-wise Yearly Summary</h2>
          </div>
          
          {summaryData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p>Add some transactions to see yearly summaries.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Income
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Expenses
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summaryData.map((item, index) => (
                    <tr key={`${item.project}-${item.year}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.project}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.year}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(item.totalIncome)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">{formatCurrency(item.totalExpenses)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${item.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(item.balance)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearlySummaryScreen;