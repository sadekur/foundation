"use client";

import { useState, useEffect, useMemo } from "react";
import type { User } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Header from "./Header";
import Footer from "./Footer";
import SyncIndicator from "./SyncIndicator";
import ProjectControls from "./ProjectControls";
import SummaryCards from "./SummaryCards";
import TransactionSection from "./TransactionSection";
import AddProjectModal from "./AddProjectModal";
import EditProjectModal from "./EditProjectModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import TransactionFormModal from "./TransactionFormModal";
import YearlySummaryScreen from "./YearlySummaryScreen";
import { getProjectYears, calculateTotals, calculateProjectTotals, getAvailableYears } from "@/lib/utils/projectStats";
import type { Projects, TransactionFormData, TransactionType } from "@/types";

interface FoundationDashboardProps {
  user: User;
}

const FoundationDashboard = ({ user }: FoundationDashboardProps) => {
  const [currentProject, setCurrentProject] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [projects, setProjects] = useState<Projects>({});
  const [newProjectName, setNewProjectName] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [editProjectName, setEditProjectName] = useState("");
  const [showDeleteProjectConfirm, setShowDeleteProjectConfirm] = useState(false);

  // Transaction form state
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [transactionForm, setTransactionForm] = useState<TransactionFormData>({
    date: "",
    donor: "",
    amount: "",
  });
  const [showYearlySummary, setShowYearlySummary] = useState(false);
  const [newProjectYear, setNewProjectYear] = useState(new Date().getFullYear());

  // Realtime data listener — starts as soon as the dashboard mounts (parent already gated on auth)
  useEffect(() => {
    const foundationDocRef = doc(db, "foundations", "as-salsabil");

    const unsubscribe = onSnapshot(
      foundationDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const loadedProjects: Projects = data.projects || {};
          setProjects(loadedProjects);

          // Functional update — no stale closure on currentProject
          setCurrentProject((prev) => {
            if (!prev && Object.keys(loadedProjects).length > 0) {
              const firstProject = Object.keys(loadedProjects)[0];
              const projectYears = getProjectYears(loadedProjects[firstProject]);
              if (projectYears.length > 0) {
                setSelectedYear(Math.max(...projectYears));
              }
              return firstProject;
            }
            return prev; // keep whatever is already selected
          });
        }
      },
      (error) => {
        console.error("Error listening to document:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveToFirebase = async (updatedProjects: Projects) => {
    try {
      const foundationDocRef = doc(db, "foundations", "as-salsabil");
      await setDoc(foundationDocRef, {
        projects: updatedProjects,
        lastUpdated: new Date().toISOString(),
      }); // ← no merge:true — overwrites the document so deletes actually stick
    } catch (error) {
      alert("Failed to save data: " + (error as Error).message);
    }
  };

  const addProject = async () => {
    if (newProjectName.trim()) {
      const updatedProjects: Projects = {
        ...projects,
        [newProjectName.trim()]: {
          income: {},
          expenses: {},
          createdAt: new Date().toISOString(),
          createdYear: newProjectYear,
        },
      };

      setProjects(updatedProjects);
      await saveToFirebase(updatedProjects);
      setCurrentProject(newProjectName.trim());
      setSelectedYear(newProjectYear);
      setNewProjectName("");
      setNewProjectYear(new Date().getFullYear());
      setShowAddProject(false);
    }
  };

  const renameProject = async (oldName: string, newNameRaw: string) => {
    const newName = newNameRaw.trim();
    if (!newName || newName === oldName) {
      setShowEditProject(false);
      return;
    }
    if (projects[newName]) {
      alert("A project with this name already exists");
      return;
    }

    const updatedProjects = { ...projects };
    updatedProjects[newName] = updatedProjects[oldName];
    delete updatedProjects[oldName];

    // Update projects and currentProject together (before the await) so
    // there's never a render where currentProject points at a key that
    // no longer exists in projects.
    setProjects(updatedProjects);
    if (currentProject === oldName) {
      setCurrentProject(newName);
    }
    setShowEditProject(false);
    setEditProjectName("");

    await saveToFirebase(updatedProjects);
  };

  const deleteProject = async (projectName: string) => {
    const updatedProjects = { ...projects };
    delete updatedProjects[projectName];

    setProjects(updatedProjects);
    if (currentProject === projectName) {
      setCurrentProject("");
      setSelectedYear(new Date().getFullYear());
    }
    setShowDeleteProjectConfirm(false);

    await saveToFirebase(updatedProjects);
  };

  const addTransaction = async (type: TransactionType) => {
    if (!transactionForm.date || !transactionForm.donor || !transactionForm.amount) {
      alert("Please fill all fields");
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
      createdAt: new Date().toISOString(),
    };

    // Initialize project structure if it doesn't exist
    const currentProjectData = projects[currentProject] || { income: {}, expenses: {} };

    const updatedProjects: Projects = {
      ...projects,
      [currentProject]: {
        ...currentProjectData,
        [type]: {
          ...currentProjectData[type],
          [year]: {
            ...currentProjectData[type][year],
            [transactionId]: transaction,
          },
        },
      },
    };

    setProjects(updatedProjects);
    await saveToFirebase(updatedProjects);

    // Update selected year to the transaction year if different
    if (parseInt(year) !== selectedYear) {
      setSelectedYear(parseInt(year));
    }

    setTransactionForm({ date: "", donor: "", amount: "" });
    setShowIncomeForm(false);
    setShowExpenseForm(false);
  };

  const deleteTransaction = async (type: TransactionType, transactionId: string) => {
    const year = selectedYear.toString();

    // Deep copy — shallow spread doesn't protect nested objects
    const updatedProjects: Projects = JSON.parse(JSON.stringify(projects));

    if (updatedProjects[currentProject]?.[type]?.[year]) {
      delete updatedProjects[currentProject][type][year][transactionId];
      if (Object.keys(updatedProjects[currentProject][type][year]).length === 0) {
        delete updatedProjects[currentProject][type][year];
      }
    }

    setProjects(updatedProjects);
    await saveToFirebase(updatedProjects);
  };

  // Derived stats — memoized so they only recompute when the underlying
  // data actually changes, not on every keystroke/render (e.g. while a
  // transaction form is open and unrelated state is updating).
  const { totalIncome, totalExpenses, balance } = useMemo(
    () => calculateTotals(projects, currentProject, selectedYear),
    [projects, currentProject, selectedYear]
  );
  const availableYears = useMemo(() => getAvailableYears(projects, currentProject), [projects, currentProject]);
  const projectTotals = useMemo(() => calculateProjectTotals(projects, currentProject), [projects, currentProject]);

  // Handle project change - update year to most recent year with data
  const handleProjectChange = (newProject: string) => {
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
    setNewProjectName("");
    setNewProjectYear(new Date().getFullYear());
  };

  const handleEditProjectOpen = () => {
    setEditProjectName(currentProject);
    setShowEditProject(true);
  };

  const handleEditProjectCancel = () => {
    setShowEditProject(false);
    setEditProjectName("");
  };

  const handleEditProjectSave = () => {
    renameProject(currentProject, editProjectName);
  };

  const handleDeleteProjectCancel = () => {
    setShowDeleteProjectConfirm(false);
  };

  const handleDeleteProjectConfirm = () => {
    deleteProject(currentProject);
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
    setTransactionForm({ date: "", donor: "", amount: "" });
  };

  const handleTransactionSubmit = () => {
    const type: TransactionType = showIncomeForm ? "income" : "expenses";
    addTransaction(type);
  };

  if (showYearlySummary) {
    return <YearlySummaryScreen projects={projects} onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

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
            onEditProject={handleEditProjectOpen}
            onDeleteProject={() => setShowDeleteProjectConfirm(true)}
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
                &quot;{currentProject}&quot; (All Years: {projectTotals.years.join(", ") || "No data"})
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
                  <span className={`font-bold text-base lg:text-lg ${projectTotals.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
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
                  <span className={`font-bold text-base ${projectTotals.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
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
                  onDelete={(id) => deleteTransaction("income", id)}
                  onAddTransaction={() => setShowIncomeForm(true)}
                  buttonColor="green"
                />
              </div>

              <div className="w-full">
                <TransactionSection
                  type="expense"
                  title={`Expenses (${selectedYear})`}
                  transactions={projects[currentProject]?.expenses?.[selectedYear.toString()] || {}}
                  onDelete={(id) => deleteTransaction("expenses", id)}
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

        <EditProjectModal
          show={showEditProject}
          projectName={editProjectName}
          setProjectName={setEditProjectName}
          onSave={handleEditProjectSave}
          onCancel={handleEditProjectCancel}
        />

        <DeleteConfirmationModal
          show={showDeleteProjectConfirm}
          onCancel={handleDeleteProjectCancel}
          onConfirm={handleDeleteProjectConfirm}
          description={`Are you sure you want to delete "${currentProject}"? All of its income and expense records will be permanently deleted. This action cannot be undone.`}
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
      <Footer />
    </div>
  );
};

export default FoundationDashboard;