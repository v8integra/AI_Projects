/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SummaryCards } from './components/SummaryCards';
import { Charts } from './components/Charts';
import { Expense } from './types';
import { Plus, Wallet, PieChart as PieChartIcon, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { expenses, addExpense, updateExpense, deleteExpense, summary, isLoaded } = useExpenses();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses'>('dashboard');

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(undefined);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">ExpensePro</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'dashboard' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <PieChartIcon className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('expenses')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'expenses' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ListIcon className="w-4 h-4" />
                Expenses
              </button>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Financial Overview</h1>
                <p className="text-gray-500 mt-1">Track your spending habits and manage your budget.</p>
              </header>

              <SummaryCards summary={summary} />
              <Charts summary={summary} />
              
              <div className="mt-8">
                <ExpenseList 
                  expenses={expenses.slice(0, 5)} 
                  onDelete={deleteExpense} 
                  onEdit={handleEdit} 
                />
                {expenses.length > 5 && (
                  <button
                    onClick={() => setActiveTab('expenses')}
                    className="w-full mt-4 py-3 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    View All Expenses
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">All Expenses</h1>
                <p className="text-gray-500 mt-1">Manage and filter your full transaction history.</p>
              </header>

              <ExpenseList 
                expenses={expenses} 
                onDelete={deleteExpense} 
                onEdit={handleEdit} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-200 px-2 py-2 rounded-2xl shadow-2xl flex items-center gap-1 z-40">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-3 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500'
          }`}
        >
          <PieChartIcon className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`p-3 rounded-xl transition-all ${
            activeTab === 'expenses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500'
          }`}
        >
          <ListIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <ExpenseForm
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          initialData={editingExpense}
        />
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-sm text-gray-400">
          © 2026 ExpensePro. All data is stored locally in your browser.
        </p>
      </footer>
    </div>
  );
}

