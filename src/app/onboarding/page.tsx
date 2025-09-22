"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OnboardingStep = "comfort" | "bank" | "card" | "success";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("comfort");
  const [comfortBalance, setComfortBalance] = useState("");
  const [bankConnected, setBankConnected] = useState(false);
  const [cardConnected, setCardConnected] = useState(false);
  const router = useRouter();

  const nextStep = () => {
    switch (currentStep) {
      case "comfort":
        setCurrentStep("bank");
        break;
      case "bank":
        setCurrentStep("card");
        break;
      case "card":
        setCurrentStep("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
        break;
    }
  };

  const handleConnectBank = () => {
    setBankConnected(true);
    setTimeout(() => {
      nextStep();
    }, 1000);
  };

  const handleConnectCard = () => {
    setCardConnected(true);
    setTimeout(() => {
      nextStep();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {currentStep === "comfort" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              What&apos;s your comfort balance?
            </h2>
            <p className="text-gray-600 mb-6">
              How much would you like to keep in your checking account as a buffer?
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comfort Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  value={comfortBalance}
                  onChange={(e) => setComfortBalance(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2,000"
                />
              </div>
            </div>
            <button
              onClick={nextStep}
              disabled={!comfortBalance}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "bank" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Connect your bank
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;ll use bank-level security to safely connect your accounts.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    🏦
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Chase Bank</p>
                    <p className="text-sm text-gray-500">Checking & Savings</p>
                  </div>
                </div>
                {bankConnected && (
                  <div className="text-green-500">✓</div>
                )}
              </div>
            </div>
            <button
              onClick={handleConnectBank}
              disabled={bankConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {bankConnected ? "Connected!" : "Connect Bank"}
            </button>
          </div>
        )}

        {currentStep === "card" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Connect your card
            </h2>
            <p className="text-gray-600 mb-6">
              Link your primary credit or debit card to track spending.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    💳
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Chase Sapphire</p>
                    <p className="text-sm text-gray-500">•••• •••• •••• 4321</p>
                  </div>
                </div>
                {cardConnected && (
                  <div className="text-green-500">✓</div>
                )}
              </div>
            </div>
            <button
              onClick={handleConnectCard}
              disabled={cardConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {cardConnected ? "Connected!" : "Connect Card"}
            </button>
          </div>
        )}

        {currentStep === "success" && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-3xl">🎉</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You&apos;re all set!
            </h2>
            <p className="text-gray-600 mb-6">
              James is now analyzing your spending patterns to provide personalized insights.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {["comfort", "bank", "card", "success"].map((step, index) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  ["comfort", "bank", "card", "success"].indexOf(currentStep) >= index
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}