import { ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";


const YearlySummaryScreen = ({ 
  projects, 
  onBack 
}) => {
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

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
        
        // Add transaction count for better insights
        const incomeTransactions = Object.keys(incomeData).length;
        const expenseTransactions = Object.keys(expenseData).length;
        const totalTransactions = incomeTransactions + expenseTransactions;
        
        summaryData.push({
          project: projectName,
          year: parseInt(year),
          totalIncome,
          totalExpenses,
          balance,
          incomeTransactions,
          expenseTransactions,
          totalTransactions
        });
      });
    });
    
    // Sort by year (descending) then by project name
    return summaryData.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return a.project.localeCompare(b.project);
    });
  };

  const calculateProjectTotals = () => {
    const projectTotals = {};
    
    Object.keys(projects).forEach(projectName => {
      const project = projects[projectName];
      const allYears = new Set([
        ...Object.keys(project.income || {}),
        ...Object.keys(project.expenses || {})
      ]);
      
      let totalIncome = 0;
      let totalExpenses = 0;
      let totalIncomeTransactions = 0;
      let totalExpenseTransactions = 0;
      
      allYears.forEach(year => {
        const incomeData = project.income?.[year] || {};
        const expenseData = project.expenses?.[year] || {};
        
        totalIncome += Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
        totalExpenses += Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
        totalIncomeTransactions += Object.keys(incomeData).length;
        totalExpenseTransactions += Object.keys(expenseData).length;
      });
      
      projectTotals[projectName] = {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        years: Array.from(allYears).map(Number).sort((a, b) => b - a),
        totalIncomeTransactions,
        totalExpenseTransactions,
        totalTransactions: totalIncomeTransactions + totalExpenseTransactions
      };
    });
    
    return projectTotals;
  };

  const summaryData = calculateYearlySummaryData();
  const projectTotals = calculateProjectTotals();
  
  // Filter data based on selections
  const filteredData = summaryData.filter(item => {
    const projectMatch = selectedProject === 'all' || item.project === selectedProject;
    const yearMatch = selectedYear === 'all' || item.year === parseInt(selectedYear);
    return projectMatch && yearMatch;
  });
  
  // Calculate grand totals from filtered data
  const grandTotals = filteredData.reduce((totals, item) => ({
    income: totals.income + item.totalIncome,
    expenses: totals.expenses + item.totalExpenses,
    balance: totals.balance + item.balance,
    transactions: totals.transactions + item.totalTransactions
  }), { income: 0, expenses: 0, balance: 0, transactions: 0 });

  // Get unique years and projects for filters
  const allYears = [...new Set(summaryData.map(item => item.year))].sort((a, b) => b - a);
  const allProjects = [...new Set(summaryData.map(item => item.project))].sort();

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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Projects</option>
                {allProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Years</option>
                {allYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(grandTotals.income)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(grandTotals.expenses)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Net Balance</h3>
            <p className={`text-2xl font-bold ${grandTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(grandTotals.balance)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Projects</h3>
            <p className="text-2xl font-bold text-blue-600">{Object.keys(projects).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
            <p className="text-2xl font-bold text-purple-600">{grandTotals.transactions}</p>
          </div>
        </div>

        {/* Project Totals Summary */}
        {selectedProject === 'all' && selectedYear === 'all' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Project Totals (All Years Combined)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Years</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(projectTotals).map(([projectName, totals], index) => (
                    <tr key={projectName} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{totals.years.join(', ') || 'No data'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(totals.totalIncome)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">{formatCurrency(totals.totalExpenses)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${totals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(totals.balance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{totals.totalTransactions}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Yearly Summary Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedProject !== 'all' || selectedYear !== 'all' 
                ? `Filtered Results` 
                : 'Project-wise Yearly Summary'
              }
            </h2>
            {(selectedProject !== 'all' || selectedYear !== 'all') && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedProject !== 'all' && `Project: ${selectedProject}`}
                {selectedProject !== 'all' && selectedYear !== 'all' && ' • '}
                {selectedYear !== 'all' && `Year: ${selectedYear}`}
              </p>
            )}
          </div>
          
          {filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p>No data matches the selected filters or add some transactions to see yearly summaries.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={`${item.project}-${item.year}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.project}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.totalTransactions}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.year}</div>
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