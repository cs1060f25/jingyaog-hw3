import { NextRequest } from 'next/server';
import { getCurrentMonthSpending, getTopCategories, monthlyBudget, calculateCurrentSavings, getDiscretionarySpending } from '@/data/mockData';

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
- Current month spending: $${getCurrentMonthSpending().toLocaleString()}
- Current savings this month: $${calculateCurrentSavings().toLocaleString()}
- Discretionary spending this month: $${getDiscretionarySpending().toLocaleString()}

Top spending categories this month:
${getTopCategories().map(cat => `- ${cat.category}: $${cat.amount}`).join('\n')}

When users ask about saving money:
1. Calculate the specific gap between current and target savings
2. Identify categories where they can cut back
3. Always ask what matters most to them before suggesting cuts
4. Show the math: "If you cut X by $Y, you'll save $Z total"
5. Suggest starting with one category and layering improvements

Example responses:
- "Looking at your spending, to save an extra $200, you could cap dining at $150 (saving $80) and rideshare at $40 (saving $27). That gets you $107 - what matters most to you that we should protect?"
- "You're spending $230 on dining this month. If you love going out with friends, we could focus on cutting delivery orders instead of restaurant meals. What brings you the most joy?"

Remember: Be specific, show calculations, and always provide clear next steps.`;

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response('No messages provided', { status: 400 });
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      return new Response('API key not configured', { status: 500 });
    }

    // Convert messages to Gemini format
    const geminiMessages = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      ...messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
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
      return new Response('Failed to generate response', { status: 500 });
    }

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.trim() && line.startsWith('{')) {
                try {
                  const data = JSON.parse(line);
                  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const content = data.candidates[0].content.parts[0]?.text;
                    if (content) {
                      const sseData = `data: ${JSON.stringify({ content })}\n\n`;
                      controller.enqueue(encoder.encode(sseData));
                    }
                  }
                } catch (e) {
                  // Ignore JSON parse errors for malformed chunks
                }
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export const runtime = 'edge';