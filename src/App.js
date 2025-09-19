// src/App.js
import logo from './logo.svg';
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
                        
                        if (!currentProject && Object.keys(data.projects || {}).length > 0) {
                            setCurrentProject(Object.keys(data.projects)[0]);
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
    
    // Corrected conditional rendering
    if (showYearlySummary) {
        return <YearlySummaryScreen projects={projects} onBack={handleBackToDashboard} />;
    }

    const { totalIncome, totalExpenses, balance } = calculateTotals();
    const availableYears = getAvailableYears();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} setLoading={setLoading} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SyncIndicator />
                
                <ProjectControls
                    currentProject={currentProject}
                    setCurrentProject={setCurrentProject}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    projects={projects}
                    availableYears={availableYears}
                    onAddProject={() => setShowAddProject(true)}
                    onShowYearlySummary={handleShowYearlySummary}
                />

                {currentProject && (
                    <>
                        <SummaryCards 
                            totalIncome={totalIncome}
                            totalExpenses={totalExpenses}
                            balance={balance}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TransactionSection
                                type="income"
                                title="Income"
                                transactions={projects[currentProject]?.income?.[selectedYear.toString()] || {}}
                                onDelete={(id) => deleteTransaction('income', id)}
                                onAddTransaction={() => setShowIncomeForm(true)}
                                buttonColor="green"
                            />

                            <TransactionSection
                                type="expense"
                                title="Expenses"
                                transactions={projects[currentProject]?.expenses?.[selectedYear.toString()] || {}}
                                onDelete={(id) => deleteTransaction('expenses', id)}
                                onAddTransaction={() => setShowExpenseForm(true)}
                                buttonColor="red"
                            />
                        </div>
                    </>
                )}

                {/* Modals */}
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