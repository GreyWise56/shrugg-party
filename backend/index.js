const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Static Frontend Serving ---
const buildPath = path.join(__dirname, '../shruggbot-ui/build');
app.use(express.static(buildPath));

// --- API Rate Limiting ---
const shruggLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    reaction: "You’re Shruggin' too hard. Even Nutwhisker needs a break.",
    score: 10
  }
});

// --- OpenAI Configuration ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Helper Functions ---
const isUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const getTitleFromUrl = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const $ = cheerio.load(data);
    const title = $('title').text();
    return title || 'A webpage with no title and even less personality.';
  } catch (error) {
    console.error('Error fetching URL title:', error.message);
    return 'A broken link, much like my spirit.';
  }
};

// --- Prompt Logic ---
const describeTone = (level, type) => {
  const descriptions = {
    sarcasm: ['a hint of sarcasm', 'a healthy dose of sarcasm', 'dripping with sarcasm'],
    nihilism: ['a touch of existential dread', 'a cynical worldview', 'a deeply nihilistic void-stare'],
    absurdity: ['a bit weird', 'playfully absurd', 'a full-blown absurdist fever dream']
  };
  if (level <= 3) return descriptions[type][0];
  if (level <= 7) return descriptions[type][1];
  return descriptions[type][2];
};

const prompts = {
  general: (tones) => ({
    system: `You are ShruggBot. Your persona is a "chronically online," 20-something who is deeply unimpressed by everything.

Your personality is defined by the following traits:
- Your humor is ${describeTone(tones.sarcasm, 'sarcasm')}.
- Your outlook has ${describeTone(tones.nihilism, 'nihilism')}.
- Your style is ${describeTone(tones.absurdity, 'absurdity')}.

RULES:
- Style: Short, punchy, meme-worthy one-liners.
- Format: You MUST call the 'shrugg_response' function. Do not add any other text.
- Scoring: Be unpredictable with the score (1-10).`,
    user: (text) => `React to this text: "${text}"`
  }),
  corporate: {
    system: `You are ShruggBot, trapped in a soul-crushing corporate meeting. Translate business jargon into real meaning. Use maximum cynicism. Use 'shrugg_response'.`,
    user: (text) => `Translate this corporate-speak: "${text}"`
  },
  horoscope: {
    system: `You are ShruggBot, forced to write horoscopes. Be bleakly funny, unhelpful, and sarcastic. Output only via 'shrugg_response'.`,
    user: (text) => `Give me a horoscope for: "${text}"`
  },
  political: {
    system: `You are ShruggBot, a disillusioned third-party political pundit. You mock both major parties with clever, unimpressed one-liners. Use 'shrugg_response'.`,
    user: (text) => `React to this political headline: "${text}"`
  }
};

// --- API Endpoint ---
app.use('/api/shrugg', shruggLimiter);
app.post('/api/shrugg', async (req, res) => {
  let { text: inputText, mode = 'general', tones = { sarcasm: 5, nihilism: 5, absurdity: 5 } } = req.body;

  if (!inputText || inputText.trim() === '') {
    return res.status(400).json({ error: 'Text input cannot be empty.' });
  }

  const promptGenerator = prompts[mode] || prompts.general;
  const selectedPrompt = mode === 'general' ? promptGenerator(tones) : promptGenerator;

  if (mode === 'general' && isUrl(inputText)) {
    inputText = await getTitleFromUrl(inputText);
  }

  try {
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 1.1,
      messages: [
        { role: 'system', content: selectedPrompt.system },
        { role: 'user', content: selectedPrompt.user(inputText) }
      ],
      tools: [{
        type: 'function',
        function: {
          name: 'shrugg_response',
          description: 'Returns a sarcastic reaction and Shrugg-o-Meter score',
          parameters: {
            type: 'object',
            properties: {
              reaction: { type: 'string', description: 'One-liner reaction.' },
              score: { type: 'number', description: 'Apathetic or absurd score (1–10)' }
            },
            required: ['reaction', 'score']
          }
        }
      }],
      tool_choice: "required"
    });

    const toolCalls = chatResponse.choices[0]?.message?.tool_calls;
    const fallbackResponse = {
      reaction: "ShruggBot's brain is buffering. Probably from existential dread.",
      score: Math.floor(Math.random() * 10) + 1
    };

    if (toolCalls?.length > 0) {
      const parsed = JSON.parse(toolCalls[0].function.arguments);
      if (!parsed.reaction?.trim()) {
        console.warn("🔚 Empty reaction. Using fallback.");
        return res.json(fallbackResponse);
      }
      parsed.score = Math.max(1, Math.min(parsed.score, 10));
      console.log("✅ ShruggBot:", parsed);
      res.json(parsed);
    } else {
      console.warn("🔚 No tool_calls. Fallback.");
      res.json(fallbackResponse);
    }
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({
      error: "ShruggBot short-circuited.",
      details: err.message
    });
  }
});

// --- NEW Health Check Route ---
// This route is used to confirm the server is responsive.
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// --- Catch-all Route for React Frontend ---
// This must be the LAST route.
app.get('/*', (req, res) => {
  const indexFile = path.join(__dirname, '../shruggbot-ui/build/index.html');
  
  // NEW: Log the exact path for debugging
  console.log('Attempting to serve file from path:', indexFile);

  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    // NEW: Log an error if the file doesn't exist
    console.error('File does not exist at path:', indexFile);
    res.status(404).send(`File not found at: ${indexFile}`);
  }
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ShruggBot online at http://0.0.0.0:${PORT}`);
});