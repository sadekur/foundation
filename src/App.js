import logo from './logo.svg';
import './App.css';

// Replace the mockFirebase with real Firebase imports
// src/App.js
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LogOut, Eye, EyeOff, Loader } from 'lucide-react';

// Import Firebase functions
import { auth, db } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot,
  getDoc 
} from 'firebase/firestore';

// Import components
import TransactionTable from './components/TransactionTable';

const FoundationApp = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [projects, setProjects] = useState({});
  const [newProjectName, setNewProjectName] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  
  // Transaction form state
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    date: '',
    donor: '',
    amount: ''
  });

  // Authentication and data listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Listen to real-time data updates
        const foundationDocRef = doc(db, 'foundations', 'as-salsabil');
        console.log('foundationDocRef', foundationDocRef);
        
        const unsubscribeData = onSnapshot(foundationDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProjects(data.projects || {});
            
            // Set current project if none selected
            if (!currentProject && Object.keys(data.projects || {}).length > 0) {
              setCurrentProject(Object.keys(data.projects)[0]);
            }
          } else {
            // Initialize with empty data if document doesn't exist
            initializeFoundationData();
          }
        }, (error) => {
          console.error('Error listening to document:', error);
        });

        return () => unsubscribeData();
      } else {
        setProjects({});
        setCurrentProject('');
      }
    });

    return () => unsubscribeAuth();
  }, [currentProject]);

  // Initialize foundation data if it doesn't exist
  const initializeFoundationData = async () => {
    try {
      const initialData = {
        projects: {
          'General Fund': {
            income: {},
            expenses: {}
          }
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      await setDoc(doc(db, 'foundations', 'as-salsabil'), initialData);
      setProjects(initialData.projects);
      setCurrentProject('General Fund');
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
    setLoading(false);
  };

  const saveToFirebase = async (updatedProjects) => {
    try {
      const foundationDocRef = doc(db, 'foundations', 'as-salsabil');
      await setDoc(foundationDocRef, {
        projects: updatedProjects,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      
      console.log('Data saved to Firebase successfully');
    } catch (error) {
      console.error('Failed to save data:', error);
      alert('Failed to save data: ' + error.message);
    }
  };

  const addProject = async () => {
    if (newProjectName.trim()) {
      const updatedProjects = {
        ...projects,
        [newProjectName.trim()]: {
          income: {},
          expenses: {}
        }
      };
      
      setProjects(updatedProjects);
      await saveToFirebase(updatedProjects);
      setCurrentProject(newProjectName.trim());
      setNewProjectName('');
      setShowAddProject(false);
    }
  };

  const addTransaction = async (type) => {
    if (!transactionForm.date || !transactionForm.donor || !transactionForm.amount) {
      alert('Please fill all fields');
      return;
    }

    const year = new Date(transactionForm.date).getFullYear().toString();
    const transactionId = Date.now().toString();
    const transaction = {
      id: transactionId,
      date: transactionForm.date,
      donor: transactionForm.donor,
      amount: parseFloat(transactionForm.amount),
      createdAt: new Date().toISOString()
    };

    const updatedProjects = {
      ...projects,
      [currentProject]: {
        ...projects[currentProject],
        [type]: {
          ...projects[currentProject][type],
          [year]: {
            ...projects[currentProject][type][year],
            [transactionId]: transaction
          }
        }
      }
    };

    setProjects(updatedProjects);
    await saveToFirebase(updatedProjects);
    
    setTransactionForm({ date: '', donor: '', amount: '' });
    setShowIncomeForm(false);
    setShowExpenseForm(false);
  };

  const deleteTransaction = async (type, transactionId) => {
    const year = selectedYear.toString();
    const updatedProjects = { ...projects };
    
    if (updatedProjects[currentProject][type][year]) {
      delete updatedProjects[currentProject][type][year][transactionId];
      if (Object.keys(updatedProjects[currentProject][type][year]).length === 0) {
        delete updatedProjects[currentProject][type][year];
      }
    }
    
    setProjects(updatedProjects);
    await saveToFirebase(updatedProjects);
  };

  const calculateTotals = () => {
    if (!currentProject || !projects[currentProject]) {
      return { totalIncome: 0, totalExpenses: 0, balance: 0 };
    }

    const year = selectedYear.toString();
    const projectData = projects[currentProject];
    
    const incomeData = projectData.income[year] || {};
    const expenseData = projectData.expenses[year] || {};

    const totalIncome = Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  };

  const getAvailableYears = () => {
    if (!currentProject || !projects[currentProject]) {
      return [new Date().getFullYear()];
    }
    
    const projectData = projects[currentProject];
    const incomeYears = Object.keys(projectData.income || {});
    const expenseYears = Object.keys(projectData.expenses || {});
    const allYears = [...new Set([...incomeYears, ...expenseYears])]
      .map(Number)
      .sort((a, b) => b - a);
    
    return allYears.length > 0 ? allYears : [new Date().getFullYear()];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-indigo-800 mb-2">As-Salsabil Foundation</h1>
            <p className="text-gray-600">Multi-Admin Access System</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter admin email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter password"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { totalIncome, totalExpenses, balance } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-indigo-800">As-Salsabil Foundation</h1>
              <p className="text-sm text-gray-600">Multi-Admin Dashboard - {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time sync indicator */}
        <div className="mb-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            Real-time sync active - Data shared across all admin devices
          </span>
        </div>

        {/* Project Selection and Year Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Project</label>
                <select
                  value={currentProject}
                  onChange={(e) => setCurrentProject(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {Object.keys(projects).map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
              Add Project
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {currentProject && (
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
        )}

        {currentProject && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Income</h2>
                  <button
                    onClick={() => setShowIncomeForm(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Income
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <TransactionTable
                  transactions={projects[currentProject]?.income?.[selectedYear.toString()] || {}}
                  onDelete={(id) => deleteTransaction('income', id)}
                  type="income"
                />
              </div>
            </div>

            {/* Expenses Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
                  <button
                    onClick={() => setShowExpenseForm(true)}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Expense
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <TransactionTable
                  transactions={projects[currentProject]?.expenses?.[selectedYear.toString()] || {}}
                  onDelete={(id) => deleteTransaction('expenses', id)}
                  type="expense"
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        {showAddProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Project</h3>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={addProject}
                  className="flex-1 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Project
                </button>
                <button
                  onClick={() => {
                    setShowAddProject(false);
                    setNewProjectName('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Forms */}
        {(showIncomeForm || showExpenseForm) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Add {showIncomeForm ? 'Income' : 'Expense'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {showIncomeForm ? 'Donor' : 'Expense For'}
                  </label>
                  <input
                    type="text"
                    value={transactionForm.donor}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, donor: e.target.value }))}
                    placeholder={showIncomeForm ? "Enter donor name" : "Enter expense description"}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (৳)</label>
                  <input
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => addTransaction(showIncomeForm ? 'income' : 'expenses')}
                  className={`flex-1 text-white p-3 rounded-lg transition-colors ${
                    showIncomeForm 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Add {showIncomeForm ? 'Income' : 'Expense'}
                </button>
                <button
                  onClick={() => {
                    setShowIncomeForm(false);
                    setShowExpenseForm(false);
                    setTransactionForm({ date: '', donor: '', amount: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoundationApp;