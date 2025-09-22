import { getCurrentMonthSpending, monthlyBudget, getCategoryTotals, getDiscretionarySpending } from "@/data/mockData";

export interface SavingsTarget {
  target: number;
  current: number;
  gap: number;
  percentage: number;
}

export interface CategoryCutSuggestion {
  category: string;
  currentSpending: number;
  suggestedCap: number;
  potentialSavings: number;
  reasoning: string;
}

export function calculateSavingsTarget(targetPercentage: number): SavingsTarget {
  const target = Math.round(monthlyBudget.income * (targetPercentage / 100));
  const totalSpending = getCurrentMonthSpending();
  const current = monthlyBudget.income - totalSpending;
  const gap = target - current;

  return {
    target,
    current,
    gap,
    percentage: targetPercentage
  };
}

export function generateCutSuggestions(targetGap: number): CategoryCutSuggestion[] {
  const categoryTotals = getCategoryTotals();
  const suggestions: CategoryCutSuggestion[] = [];

  // Focus on discretionary categories
  const discretionaryCategories = ['Dining', 'Shopping', 'Rideshare', 'Entertainment', 'Subscriptions'];

  for (const categoryData of categoryTotals) {
    if (discretionaryCategories.includes(categoryData.category) && categoryData.amount > 50) {
      let suggestedCap: number;
      let reasoning: string;

      switch (categoryData.category) {
        case 'Dining':
          suggestedCap = Math.max(categoryData.amount * 0.7, 120);
          reasoning = "Reduce delivery orders and cook more at home, while keeping restaurant outings";
          break;
        case 'Shopping':
          suggestedCap = Math.max(categoryData.amount * 0.6, 150);
          reasoning = "Focus on needs vs wants, wait 24 hours before non-essential purchases";
          break;
        case 'Rideshare':
          suggestedCap = Math.max(categoryData.amount * 0.6, 30);
          reasoning = "Use public transport or walk for shorter trips when possible";
          break;
        case 'Subscriptions':
          suggestedCap = Math.max(categoryData.amount * 0.5, 15);
          reasoning = "Cancel unused subscriptions and downgrade services you rarely use";
          break;
        default:
          suggestedCap = Math.max(categoryData.amount * 0.8, 50);
          reasoning = "Look for more cost-effective alternatives";
      }

      const potentialSavings = categoryData.amount - suggestedCap;

      if (potentialSavings > 10) {
        suggestions.push({
          category: categoryData.category,
          currentSpending: categoryData.amount,
          suggestedCap,
          potentialSavings,
          reasoning
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings);
}

export function canAffordPurchase(amount: number, maintainSavingsGoal: number = 1000): {
  canAfford: boolean;
  impact: string;
  suggestions: string[];
} {
  const currentSavings = monthlyBudget.income - getCurrentMonthSpending();
  const newSavings = currentSavings - amount;
  const canAfford = newSavings >= maintainSavingsGoal;

  let impact: string;
  const suggestions: string[] = [];

  if (canAfford) {
    impact = `You can afford this! You'll still save $${newSavings.toLocaleString()} this month.`;
  } else {
    const shortfall = maintainSavingsGoal - newSavings;
    impact = `This would reduce your savings to $${newSavings.toLocaleString()}, which is $${shortfall.toLocaleString()} short of your $${maintainSavingsGoal.toLocaleString()} goal.`;

    const cutSuggestions = generateCutSuggestions(shortfall);

    if (cutSuggestions.length > 0) {
      suggestions.push("To afford this while maintaining your savings goal, you could:");
      cutSuggestions.slice(0, 3).forEach(suggestion => {
        suggestions.push(`• Cap ${suggestion.category} at $${suggestion.suggestedCap} (save $${Math.round(suggestion.potentialSavings)})`);
      });
    }
  }

  return { canAfford, impact, suggestions };
}

export function calculateWeeklyBudget(category: string): number {
  const categoryTotals = getCategoryTotals();
  const categoryData = categoryTotals.find(c => c.category === category);

  if (!categoryData) return 0;

  // Assume we're 3 weeks into the month, calculate weekly average
  return Math.round(categoryData.amount / 3);
}

export function getMonthEndProjection(): {
  projectedSavings: number;
  onTrackMessage: string;
  adjustmentSuggestion?: string;
} {
  const currentSavings = monthlyBudget.income - getCurrentMonthSpending();

  // Assume we're 3 weeks into the month
  const daysElapsed = 21;
  const daysInMonth = 30;
  const remainingDays = daysInMonth - daysElapsed;

  // Project spending for remaining days based on discretionary spending rate
  const dailyDiscretionaryRate = getDiscretionarySpending() / daysElapsed;
  const projectedAdditionalSpending = dailyDiscretionaryRate * remainingDays;

  const projectedSavings = currentSavings - projectedAdditionalSpending;

  let onTrackMessage: string;
  let adjustmentSuggestion: string | undefined;

  if (projectedSavings >= 1000) {
    onTrackMessage = `🎉 You're on track to save $${Math.round(projectedSavings).toLocaleString()} this month!`;
  } else if (projectedSavings >= 800) {
    onTrackMessage = `⚠️ You're projected to save $${Math.round(projectedSavings).toLocaleString()} - close to your goal.`;
    adjustmentSuggestion = "Consider reducing discretionary spending by $50-100 this week to stay on track.";
  } else {
    onTrackMessage = `❌ You're projected to save only $${Math.round(projectedSavings).toLocaleString()} this month.`;
    const gap = 1000 - projectedSavings;
    adjustmentSuggestion = `You need to cut $${Math.round(gap).toLocaleString()} in spending to reach your goal.`;
  }

  return {
    projectedSavings: Math.round(projectedSavings),
    onTrackMessage,
    adjustmentSuggestion
  };
}