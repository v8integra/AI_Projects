import { useState, useEffect, useMemo } from 'react';
import { Expense, Category, SummaryData } from '../types';
import { startOfMonth, isWithinInterval, parseISO, endOfMonth, format, subDays, isSameDay } from 'date-fns';

const STORAGE_KEY = 'expensepro_data';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse expenses', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const summary = useMemo((): SummaryData => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthly = expenses
      .filter((e) => isWithinInterval(parseISO(e.date), { start: monthStart, end: monthEnd }))
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));

    const topCategory = categoryData.length > 0
      ? categoryData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name
      : 'None';

    // Last 7 days for chart
    const dailyData = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(now, 6 - i);
      const amount = expenses
        .filter((e) => isSameDay(parseISO(e.date), date))
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        date: format(date, 'MMM dd'),
        amount,
      };
    });

    return { total, monthly, topCategory, categoryData, dailyData };
  }, [expenses]);

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    summary,
    isLoaded,
  };
}
