import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your personal financial coach —{" "}
            <span className="text-blue-600">smarter spending</span>{" "}
            without sacrifice.
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Meet James, your AI-powered financial coach who helps you save money
            while protecting the things you love most.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/onboarding"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              View Demo
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Smart Spending</h3>
              <p className="text-gray-600">
                James learns your spending patterns and suggests smart ways to save
                without cutting what matters most to you.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">Personalized Insights</h3>
              <p className="text-gray-600">
                Get tailored recommendations based on your goals, habits, and
                lifestyle to make saving feel effortless.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                See your progress in real-time and celebrate your wins as you
                reach your financial goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
