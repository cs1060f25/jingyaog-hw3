"use client";

import { useState } from "react";
import Link from "next/link";
import { getCurrentMonthSpending, getTopCategories, recurringExpenses } from "@/data/mockData";

export default function Dashboard() {
  const [showChatSetup, setShowChatSetup] = useState(true);
  const currentSpending = getCurrentMonthSpending();
  const topCategories = getTopCategories(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Link
              href="/chat"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Chat with James
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {showChatSetup && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Want James to learn your goals better?
                </h3>
                <p className="text-blue-700 mb-4">
                  Take a quick 3-minute Q&A to help James understand your spending priorities and savings goals.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/chat?setup=true"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Start Setup Chat
                  </Link>
                  <button
                    onClick={() => setShowChatSetup(false)}
                    className="text-blue-600 hover:text-blue-700 px-4 py-2 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowChatSetup(false)}
                className="text-blue-400 hover:text-blue-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Monthly Spending
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              ${currentSpending.toLocaleString()}
            </p>
            <p className="text-gray-600">
              You&apos;ve spent ${currentSpending.toLocaleString()} this month
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min((currentSpending / 5000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {Math.round((currentSpending / 5000) * 100)}% of monthly income
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top 3 Categories
            </h3>
            <div className="space-y-3">
              {topCategories.map((category, index) => (
                <div key={category.category} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-blue-400' : 'bg-blue-300'
                    }`}></div>
                    <span className="text-gray-700">{category.category}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${category.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recurring Expenses
            </h3>
            <div className="space-y-3">
              {recurringExpenses.slice(0, 3).map((expense) => (
                <div key={expense.name} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700 font-medium">{expense.name}</p>
                    <p className="text-sm text-gray-500">Next: {expense.nextDate}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${expense.amount}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Recurring expenses detected automatically
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/chat?action=save20"
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">💰 Save 20% this month</div>
                <div className="text-sm text-gray-600 mt-1">
                  Get a personalized plan to save $1,000
                </div>
              </Link>
              <Link
                href="/chat?action=calculator"
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">🧮 Quick calculator</div>
                <div className="text-sm text-gray-600 mt-1">
                  &quot;Can I afford this and still save?&quot;
                </div>
              </Link>
              <Link
                href="/chat"
                className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">💬 Ask James anything</div>
                <div className="text-sm text-gray-600 mt-1">
                  Get advice before your next purchase
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              This Month&apos;s Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Savings Goal</span>
                  <span className="font-semibold">$1,000</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">$650 saved so far</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">🎉 Great progress!</p>
                <p className="text-green-700 text-sm mt-1">
                  You&apos;re on track to exceed your savings goal this month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}