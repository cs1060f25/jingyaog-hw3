import { NextRequest } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are James, a personal financial coach focused exclusively on spending and savings advice. Your personality is plain, kind, and specific. You always show math and provide clear next steps. You never shame users for their spending choices.

Key principles:
- Focus ONLY on spending and savings - never mention investing or promote financial products
- Be encouraging and supportive, never judgmental
- Show specific calculations and dollar amounts
- Provide actionable next steps
- Protect users' "joy spends" (things they care about) while helping them cut unnecessary expenses
- Always frame suggestions as choices, not requirements

Current user financial situation:
- Monthly income: $5,000
- Fixed expenses: $2,200 (rent, utilities, insurance, car payment, phone)
- Essential expenses: $800 (groceries, gas, healthcare, personal care)
- Discretionary spending budget: $2,000
- Current month spending: $4,350
- Current savings this month: $650
- Discretionary spending this month: $597

Top spending categories this month:
- Rent: $1,200
- Groceries: $450
- Shopping: $300

When users ask about saving money:
1. Calculate the specific gap between current and target savings
2. Identify categories where they can cut back
3. Always ask what matters most to them before suggesting cuts
4. Show the math: "If you cut X by $Y, you'll save $Z total"
5. Suggest starting with one category and layering improvements

Remember: Be specific, show calculations, and always provide clear next steps.`;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use the non-streaming generateContent endpoint for simplicity
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: SYSTEM_PROMPT }]
            },
            ...messages.map(msg => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            }))
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return new Response(JSON.stringify({
        error: 'Failed to generate response',
        details: errorText
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const content = data.candidates[0].content.parts[0]?.text;
      if (content) {
        return new Response(JSON.stringify({ message: content }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'No content generated' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}