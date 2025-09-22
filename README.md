# James - Personal Financial Coach

A Next.js 14 application that serves as your AI-powered personal financial coach, helping you save money while protecting the things you love most.

The app is deployed on Vercel at *jingyaog-hw3.vercel.app*

## Features

- **Landing Page**: Compelling introduction to James with clear value proposition
- **Onboarding Flow**: Quick 2-minute setup to capture comfort balance and connect accounts (mocked)
- **Dashboard**: Financial snapshot with spending overview, top categories, and recurring expenses
- **AI Chat**: Powered by Google's Gemini 1.5 Flash for personalized financial advice
- **Smart Calculations**: Affordability checks, savings target planning, and spending suggestions

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 1.5 Flash API
- **Deployment**: Vercel Edge Functions

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/cs1060f25/jingyaog-hw3.git
cd jingyaog-hw3
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

To get a Google API key:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variable in Vercel dashboard:
   - Go to your project settings
   - Add `GOOGLE_API_KEY` with your Gemini API key

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Connect the repository to Vercel at [vercel.com](https://vercel.com)
3. Set the `GOOGLE_API_KEY` environment variable in project settings
4. Deploy automatically on each push

### Environment Variables for Production

In your Vercel dashboard, add:
- `GOOGLE_API_KEY`: Your Google Gemini API key

## Application Flow

### 1. Landing Page (`/`)
- Headline: "Your personal financial coach — smarter spending without sacrifice"
- Clear value proposition and feature highlights
- CTAs to onboarding and demo dashboard

### 2. Onboarding (`/onboarding`)
- **Step 1**: Capture comfort balance preference
- **Step 2**: Mock bank connection (Chase Bank)
- **Step 3**: Mock card connection (Chase Sapphire)
- **Step 4**: Success message with auto-redirect to dashboard

### 3. Dashboard (`/dashboard`)
- **Spending Overview**: "You've spent $4,350 this month"
- **Top Categories**: Rent ($1,200), Groceries ($450), Shopping ($300)
- **Recurring Expenses**: Spotify, Netflix, Gym membership
- **Setup Chat Prompt**: Optional 3-minute Q&A to learn user goals
- **Quick Actions**: Save 20%, calculator, general chat

### 4. Chat Interface (`/chat`)
- AI-powered conversations with James
- Streaming responses from Gemini API
- Context-aware financial advice
- Pre-filled prompts for common scenarios

## Mock Financial Data

The application includes realistic mock data:

- **Monthly Income**: $5,000
- **Fixed Expenses**: $2,200 (rent, utilities, insurance, car, phone)
- **Essential Expenses**: $800 (groceries, gas, healthcare, personal care)
- **Discretionary Budget**: $2,000
- **Current Spending**: $4,350 (65 transactions across categories)
- **Current Savings**: $650/month

## Key Financial Features

### Smart Saving Suggestions
- **20% Savings Goal**: $1,000/month target
- **Category Analysis**: Identifies overspending in dining ($230), shopping ($300), rideshare ($67)
- **Layered Approach**: Suggests multiple small cuts rather than eliminating categories

### Affordability Calculator
- Real-time purchase impact analysis
- Maintains savings goals while allowing purchases
- Suggests trade-offs to protect "joy spends"

### AI Coach Personality
James is designed to be:
- **Plain and kind**: No financial jargon, encouraging tone
- **Specific**: Always shows math and dollar amounts
- **Non-judgmental**: Never shames spending choices
- **Goal-focused**: Protects user's priorities while finding savings

## Customizing Mock Data

To replace mock data with real banking integrations:

1. **Replace data source** in `src/data/mockData.ts`:
   - Connect to Plaid, Yodlee, or similar banking API
   - Update transaction fetching functions
   - Maintain the same interface for seamless integration

2. **Update API calls** in components:
   - Most components already use the data functions
   - Only update the implementation inside `mockData.ts`

3. **Add authentication**:
   - Implement user accounts and data isolation
   - Add secure token management for banking APIs

## API Structure

### `/api/chat` (Edge Function)
- **Method**: POST
- **Input**: `{ messages: Message[] }`
- **Output**: Server-sent events stream
- **Features**:
  - Gemini 1.5 Flash integration
  - Context-aware financial coaching
  - Real-time streaming responses

## Development Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Landing page
│   ├── onboarding/     # Onboarding flow
│   ├── dashboard/      # Main dashboard
│   ├── chat/           # AI chat interface
│   └── api/chat/       # Gemini API endpoint
├── data/
│   └── mockData.ts     # Mock financial data
└── utils/
    └── financialHelpers.ts  # Financial calculations
```

## Key Design Decisions

1. **Edge Functions**: Fast response times for AI chat
2. **Streaming**: Real-time AI responses for better UX
3. **Mock Data**: Realistic financial scenarios for demo
4. **Component Isolation**: Easy to swap mock data for real APIs
5. **TypeScript**: Type safety throughout the application
6. **Tailwind**: Rapid UI development with consistent design

## Next Steps for Production

1. **User Authentication**: Add login/signup system
2. **Real Banking Integration**: Replace mock data with Plaid/Yodlee
3. **Data Persistence**: Add database for user preferences and chat history
4. **Advanced AI**: Fine-tune prompts based on user feedback
5. **Mobile App**: React Native version for mobile-first experience

---

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Google Gemini AI.
