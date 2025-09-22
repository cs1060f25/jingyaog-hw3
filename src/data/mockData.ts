export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

export interface MonthlyBudget {
  income: number;
  fixed: number;
  essentials: number;
  discretionary: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  budget?: number;
}

export interface RecurringExpense {
  name: string;
  amount: number;
  category: string;
  nextDate: string;
}

export const monthlyBudget: MonthlyBudget = {
  income: 5000,
  fixed: 2200,
  essentials: 800,
  discretionary: 2000,
};

export const currentMonthTransactions: Transaction[] = [
  // Income
  { id: '1', amount: 5000, category: 'Salary', description: 'Monthly Salary', date: '2025-01-01', type: 'income' },

  // Fixed expenses
  { id: '2', amount: 1200, category: 'Rent', description: 'Monthly Rent', date: '2025-01-01', type: 'expense' },
  { id: '3', amount: 300, category: 'Utilities', description: 'Electric & Gas', date: '2025-01-05', type: 'expense' },
  { id: '4', amount: 150, category: 'Insurance', description: 'Health Insurance', date: '2025-01-01', type: 'expense' },
  { id: '5', amount: 350, category: 'Car Payment', description: 'Auto Loan', date: '2025-01-01', type: 'expense' },
  { id: '6', amount: 200, category: 'Phone', description: 'Mobile Plan', date: '2025-01-01', type: 'expense' },

  // Essentials
  { id: '7', amount: 450, category: 'Groceries', description: 'Weekly Groceries', date: '2025-01-15', type: 'expense' },
  { id: '8', amount: 80, category: 'Gas', description: 'Gas Station', date: '2025-01-10', type: 'expense' },
  { id: '9', amount: 120, category: 'Healthcare', description: 'Doctor Visit', date: '2025-01-12', type: 'expense' },
  { id: '10', amount: 150, category: 'Personal Care', description: 'Haircut & Pharmacy', date: '2025-01-08', type: 'expense' },

  // Discretionary - Dining
  { id: '11', amount: 45, category: 'Dining', description: 'Dinner at Italian Place', date: '2025-01-03', type: 'expense' },
  { id: '12', amount: 25, category: 'Dining', description: 'Lunch with coworkers', date: '2025-01-05', type: 'expense' },
  { id: '13', amount: 35, category: 'Dining', description: 'Weekend brunch', date: '2025-01-07', type: 'expense' },
  { id: '14', amount: 55, category: 'Dining', description: 'Date night dinner', date: '2025-01-14', type: 'expense' },
  { id: '15', amount: 28, category: 'Dining', description: 'Coffee shop', date: '2025-01-16', type: 'expense' },
  { id: '16', amount: 42, category: 'Dining', description: 'Thai takeout', date: '2025-01-18', type: 'expense' },

  // Discretionary - Shopping
  { id: '17', amount: 85, category: 'Shopping', description: 'New shoes', date: '2025-01-06', type: 'expense' },
  { id: '18', amount: 120, category: 'Shopping', description: 'Winter jacket', date: '2025-01-11', type: 'expense' },
  { id: '19', amount: 35, category: 'Shopping', description: 'Books', date: '2025-01-13', type: 'expense' },
  { id: '20', amount: 60, category: 'Shopping', description: 'Home decor', date: '2025-01-17', type: 'expense' },

  // Discretionary - Rideshare
  { id: '21', amount: 15, category: 'Rideshare', description: 'Uber to airport', date: '2025-01-04', type: 'expense' },
  { id: '22', amount: 12, category: 'Rideshare', description: 'Lyft downtown', date: '2025-01-09', type: 'expense' },
  { id: '23', amount: 18, category: 'Rideshare', description: 'Uber home from dinner', date: '2025-01-14', type: 'expense' },
  { id: '24', amount: 22, category: 'Rideshare', description: 'Lyft to meeting', date: '2025-01-19', type: 'expense' },

  // Subscriptions
  { id: '25', amount: 15.99, category: 'Subscriptions', description: 'Spotify Premium', date: '2025-01-01', type: 'expense' },
  { id: '26', amount: 18.99, category: 'Subscriptions', description: 'Netflix', date: '2025-01-05', type: 'expense' },
  { id: '27', amount: 29.99, category: 'Subscriptions', description: 'Gym Membership', date: '2025-01-01', type: 'expense' },
];

export const recurringExpenses: RecurringExpense[] = [
  { name: 'Spotify Premium', amount: 15.99, category: 'Subscriptions', nextDate: '2025-02-01' },
  { name: 'Netflix', amount: 18.99, category: 'Subscriptions', nextDate: '2025-02-05' },
  { name: 'Gym Membership', amount: 29.99, category: 'Subscriptions', nextDate: '2025-02-01' },
  { name: 'Monthly Rent', amount: 1200, category: 'Rent', nextDate: '2025-02-01' },
  { name: 'Car Payment', amount: 350, category: 'Car Payment', nextDate: '2025-02-01' },
];

export function getCurrentMonthSpending(): number {
  return currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getCategoryTotals(): CategorySpending[] {
  const categoryTotals: { [key: string]: number } = {};

  currentMonthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function getTopCategories(limit: number = 3): CategorySpending[] {
  return getCategoryTotals().slice(0, limit);
}

export function getDiscretionarySpending(): number {
  const discretionaryCategories = ['Dining', 'Shopping', 'Rideshare', 'Entertainment'];
  return currentMonthTransactions
    .filter(t => t.type === 'expense' && discretionaryCategories.includes(t.category))
    .reduce((sum, t) => sum + t.amount, 0);
}

export function calculateSavingsTarget(percentage: number): number {
  return Math.round(monthlyBudget.income * (percentage / 100));
}

export function calculateCurrentSavings(): number {
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return totalIncome - totalExpenses;
}