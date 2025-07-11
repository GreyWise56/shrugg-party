const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// The updated API route with robust checking
app.post('/api/shrugg', async (req, res) => {
  const { headline } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          // A more direct prompt to ensure function use
          content: 'You are ShruggBot. Your sole purpose is to call the shrugg_response function. Do not respond in any other way.'
        },
        {
          role: 'user',
          content: `React sarcastically to this headline: "${headline}"`
        }
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'shrugg_response',
            description: 'Returns a sarcastic reaction and Shrugg-o-Meter score',
            parameters: {
              type: 'object',
              properties: {
                reaction: {
                  type: 'string',
                  description: 'A short, sarcastic one-liner reaction.'
                },
                score: {
                  type: 'number',
                  description: 'A number between 1 and 10 for the Shrugg-o-Meter.'
                }
              },
              required: ['reaction', 'score']
            }
          }
        }
      ],
      tool_choice: {
        type: 'function',
        function: { name: 'shrugg_response' }
      },
      temperature: 0.8
    });

    console.log("🧾 Full GPT response:", JSON.stringify(chatResponse, null, 2));

    // ✅ Defensive check to make sure the model returned a tool_call
    const toolCalls = chatResponse.choices[0].message.tool_calls;
    
    if (toolCalls) {
      const rawArguments = toolCalls[0].function.arguments;
      const parsed = JSON.parse(rawArguments);

      console.log("✅ ShruggBot response:", parsed);
      // This sends the correct { reaction, score } JSON
      res.json(parsed); 
    } else {
      // This block runs if the model fails to use the tool, preventing a crash
      console.error("❌ Model did not use the function tool.");
      res.status(500).json({
        error: "Model response was not structured correctly.",
        details: chatResponse.choices[0].message.content || "No text content available."
      });
    }

  } catch (err) {
    console.error("❌ ShruggBot API error:", err);
    res.status(500).json({
      error: "ShruggBot short-circuited.",
      details: err.message
    });
  }
});

app.listen(3000, () => console.log('🚀 ShruggBot server running on http://localhost:3000'));