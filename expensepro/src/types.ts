export type Category = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  createdAt: string;
}

export interface SummaryData {
  total: number;
  monthly: number;
  topCategory: string;
  categoryData: { name: string; value: number }[];
  dailyData: { date: string; amount: number }[];
}
