// src/App.js
import './App.css';
import React, { useState, useEffect } from 'react';

// Import Firebase functions
import { auth, db } from './firebase';
import {  
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';

// Import components
import LoginScreen from './components/LoginScreen';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import SyncIndicator from './components/SyncIndicator';
import ProjectControls from './components/ProjectControls';
import SummaryCards from './components/SummaryCards';
import TransactionSection from './components/TransactionSection';
import AddProjectModal from './components/AddProjectModal';
import TransactionFormModal from './components/TransactionFormModal';
import YearlySummaryScreen from './components/YearlySummaryScreen';


const FoundationApp = () => {
    const [user, setUser] = useState(null);
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
    const [showYearlySummary, setShowYearlySummary] = useState(false);
    const [newProjectYear, setNewProjectYear] = useState(new Date().getFullYear());

    // Authentication and data listener
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);
            
            if (user) {
                const foundationDocRef = doc(db, 'foundations', 'as-salsabil');
                
                const unsubscribeData = onSnapshot(foundationDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setProjects(data.projects || {});
                        
                        // Set current project if none selected
                        if (!currentProject && Object.keys(data.projects || {}).length > 0) {
                            const firstProject = Object.keys(data.projects)[0];
                            setCurrentProject(firstProject);
                            
                            // Set year to most recent year with data for this project
                            const projectYears = getProjectYears(data.projects[firstProject]);
                            if (projectYears.length > 0) {
                                setSelectedYear(Math.max(...projectYears));
                            }
                        }
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

    // Helper function to get all years for a project
    const getProjectYears = (projectData) => {
        if (!projectData) return [];
        
        const incomeYears = Object.keys(projectData.income || {}).map(Number);
        const expenseYears = Object.keys(projectData.expenses || {}).map(Number);
        const allYears = [...new Set([...incomeYears, ...expenseYears])];
        
        return allYears.sort((a, b) => b - a);
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
                    expenses: {},
                    createdAt: new Date().toISOString(),
                    createdYear: newProjectYear
                }
            };
            
            setProjects(updatedProjects);
            await saveToFirebase(updatedProjects);
            setCurrentProject(newProjectName.trim());
            setSelectedYear(newProjectYear);
            setNewProjectName('');
            setNewProjectYear(new Date().getFullYear());
            setShowAddProject(false);
        }
    };

    const addTransaction = async (type) => {
        if (!transactionForm.date || !transactionForm.donor || !transactionForm.amount) {
            alert('Please fill all fields');
            return;
        }

        const transactionDate = new Date(transactionForm.date);
        const year = transactionDate.getFullYear().toString();
        const transactionId = Date.now().toString();
        
        const transaction = {
            id: transactionId,
            date: transactionForm.date,
            donor: transactionForm.donor,
            amount: parseFloat(transactionForm.amount),
            year: parseInt(year),
            createdAt: new Date().toISOString()
        };

        // Initialize project structure if it doesn't exist
        const currentProjectData = projects[currentProject] || { income: {}, expenses: {} };
        
        const updatedProjects = {
            ...projects,
            [currentProject]: {
                ...currentProjectData,
                [type]: {
                    ...currentProjectData[type],
                    [year]: {
                        ...currentProjectData[type][year],
                        [transactionId]: transaction
                    }
                }
            }
        };

        setProjects(updatedProjects);
        await saveToFirebase(updatedProjects);
        
        // Update selected year to the transaction year if different
        if (parseInt(year) !== selectedYear) {
            setSelectedYear(parseInt(year));
        }
        
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
        
        const incomeData = projectData.income?.[year] || {};
        const expenseData = projectData.expenses?.[year] || {};

        const totalIncome = Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
        const totalExpenses = Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
        const balance = totalIncome - totalExpenses;

        return { totalIncome, totalExpenses, balance };
    };

    // Calculate totals for all years of current project
    const calculateProjectTotals = (projectName) => {
        if (!projectName || !projects[projectName]) {
            return { totalIncome: 0, totalExpenses: 0, balance: 0, years: [] };
        }

        const projectData = projects[projectName];
        const allYears = getProjectYears(projectData);
        
        let totalIncome = 0;
        let totalExpenses = 0;
        
        allYears.forEach(year => {
            const yearStr = year.toString();
            const incomeData = projectData.income?.[yearStr] || {};
            const expenseData = projectData.expenses?.[yearStr] || {};
            
            totalIncome += Object.values(incomeData).reduce((sum, transaction) => sum + transaction.amount, 0);
            totalExpenses += Object.values(expenseData).reduce((sum, transaction) => sum + transaction.amount, 0);
        });

        return { 
            totalIncome, 
            totalExpenses, 
            balance: totalIncome - totalExpenses,
            years: allYears
        };
    };

    const getAvailableYears = () => {
        if (!currentProject || !projects[currentProject]) {
            return [new Date().getFullYear()];
        }
        
        const projectYears = getProjectYears(projects[currentProject]);
        return projectYears.length > 0 ? projectYears : [new Date().getFullYear()];
    };

    // Handle project change - update year to most recent year with data
    const handleProjectChange = (newProject) => {
        setCurrentProject(newProject);
        if (projects[newProject]) {
            const projectYears = getProjectYears(projects[newProject]);
            if (projectYears.length > 0) {
                setSelectedYear(Math.max(...projectYears));
            } else {
                setSelectedYear(new Date().getFullYear());
            }
        }
    };

    // Handle modal actions
    const handleAddProjectCancel = () => {
        setShowAddProject(false);
        setNewProjectName('');
        setNewProjectYear(new Date().getFullYear());
    };

    const handleShowYearlySummary = () => {
        setShowYearlySummary(true);
    };

    const handleBackToDashboard = () => {
        setShowYearlySummary(false);
    };

    const handleTransactionFormCancel = () => {
        setShowIncomeForm(false);
        setShowExpenseForm(false);
        setTransactionForm({ date: '', donor: '', amount: '' });
    };

    const handleTransactionSubmit = () => {
        const type = showIncomeForm ? 'income' : 'expenses';
        addTransaction(type);
    };

    // Render conditions
    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <LoginScreen />;
    }
    
    if (showYearlySummary) {
        return <YearlySummaryScreen projects={projects} onBack={handleBackToDashboard} />;
    }

    const { totalIncome, totalExpenses, balance } = calculateTotals();
    const availableYears = getAvailableYears();
    const projectTotals = calculateProjectTotals(currentProject);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} setLoading={setLoading} />

            {/* Main Container - Responsive padding and max-width */}
            <div className="w-full max-w-none xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
                {/* Sync Indicator */}
                <div className="mb-4 sm:mb-6">
                    <SyncIndicator />
                </div>
                
                {/* Project Controls - Responsive */}
                <div className="mb-6 sm:mb-8">
                    <ProjectControls
                        currentProject={currentProject}
                        setCurrentProject={handleProjectChange}
                        selectedYear={selectedYear}
                        setSelectedYear={setSelectedYear}
                        projects={projects}
                        availableYears={availableYears}
                        onAddProject={() => setShowAddProject(true)}
                        onShowYearlySummary={handleShowYearlySummary}
                    />
                </div>

                {currentProject && (
                    <>
                        {/* Current Year Summary - Responsive */}
                        <div className="mb-4 sm:mb-6">
                            <SummaryCards 
                                totalIncome={totalIncome}
                                totalExpenses={totalExpenses}
                                balance={balance}
                                year={selectedYear}
                            />
                        </div>

                        {/* Project Total Summary (All Years) - Responsive */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 xs:p-4 sm:p-6 mb-4 sm:mb-6 overflow-x-auto">
                            <h3 className="text-sm sm:text-base font-medium text-blue-800 mb-3 sm:mb-4">
                                Total for "{currentProject}" (All Years: {projectTotals.years.join(', ') || 'No data'})
                            </h3>
                            
                            {/* Desktop Layout (3 columns) */}
                            <div className="hidden sm:grid sm:grid-cols-3 gap-4 text-sm">
                                <div className="flex flex-col space-y-1">
                                    <span className="text-blue-600 font-medium">Total Income:</span>
                                    <span className="text-green-600 font-bold text-base lg:text-lg">
                                        ${projectTotals.totalIncome.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="text-blue-600 font-medium">Total Expenses:</span>
                                    <span className="text-red-600 font-bold text-base lg:text-lg">
                                        ${projectTotals.totalExpenses.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <span className="text-blue-600 font-medium">Net Balance:</span>
                                    <span className={`font-bold text-base lg:text-lg ${projectTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${projectTotals.balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Layout (Stacked) */}
                            <div className="sm:hidden space-y-3">
                                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                                    <span className="text-blue-600 font-medium text-sm">Total Income:</span>
                                    <span className="text-green-600 font-bold text-base">
                                        ${projectTotals.totalIncome.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-blue-200 pb-2">
                                    <span className="text-blue-600 font-medium text-sm">Total Expenses:</span>
                                    <span className="text-red-600 font-bold text-base">
                                        ${projectTotals.totalExpenses.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-600 font-medium text-sm">Net Balance:</span>
                                    <span className={`font-bold text-base ${projectTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${projectTotals.balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Sections - Responsive Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            <div className="w-full">
                                <TransactionSection
                                    type="income"
                                    title={`Income (${selectedYear})`}
                                    transactions={projects[currentProject]?.income?.[selectedYear.toString()] || {}}
                                    onDelete={(id) => deleteTransaction('income', id)}
                                    onAddTransaction={() => setShowIncomeForm(true)}
                                    buttonColor="green"
                                />
                            </div>

                            <div className="w-full">
                                <TransactionSection
                                    type="expense"
                                    title={`Expenses (${selectedYear})`}
                                    transactions={projects[currentProject]?.expenses?.[selectedYear.toString()] || {}}
                                    onDelete={(id) => deleteTransaction('expenses', id)}
                                    onAddTransaction={() => setShowExpenseForm(true)}
                                    buttonColor="red"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Modals - These should be responsive by default */}
                <AddProjectModal
                    show={showAddProject}
                    projectName={newProjectName}
                    setProjectName={setNewProjectName}
                    selectedYear={newProjectYear}
                    setSelectedYear={setNewProjectYear}
                    onAdd={addProject}
                    onCancel={handleAddProjectCancel}
                />

                <TransactionFormModal
                    show={showIncomeForm}
                    type="income"
                    formData={transactionForm}
                    setFormData={setTransactionForm}
                    onSubmit={handleTransactionSubmit}
                    onCancel={handleTransactionFormCancel}
                />

                <TransactionFormModal
                    show={showExpenseForm}
                    type="expense"
                    formData={transactionForm}
                    setFormData={setTransactionForm}
                    onSubmit={handleTransactionSubmit}
                    onCancel={handleTransactionFormCancel}
                />
            </div>
        </div>
    );
};

export default FoundationApp;