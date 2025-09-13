const axios = require('axios');
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Verified college facts
const collegeFacts = {
  "sathyabama": {
    name: "Sathyabama Institute of Science and Technology",
    chancellors: [
      { name: "Dr. Jeppiaar", start: 1987, end: 2016 },
      { name: "Dr. Mariazeena Johnson", start: 2020, end: "present" }
    ],
    location: "Chennai, Tamil Nadu",
    website: "https://www.sathyabama.ac.in/"
  },
  "srm university ap": {
    name: "SRM University-AP",
    chancellor: "Dr. T.R. Paarivendhar",
    location: "Amaravati, Andhra Pradesh",
    website: "https://srmap.edu.in/"
  },
  "st joseph's": {
    name: "St. Joseph's College of Engineering",
    chairman: "Dr. B. Babu Manoharan",
    location: "OMR, Chennai",
    website: "https://stjosephs.ac.in/"
  },
  "sri sairam": {
    name: "Sri Sairam Engineering College",
    chairman: "Ln. Dr. Sai Prakash Leo Muthu",
    location: "Tambaram, Chennai",
    website: "https://sairam.edu.in/"
  }
};

// Fetch Wikipedia summary dynamically
async function getWikipediaSummary(query) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    if (response.data && response.data.extract) return response.data.extract;
  } catch (err) {
    console.error("Wikipedia API error:", err.message);
  }
  return null;
}

// Main Nova reply function
async function getReply(message) {
  const lowerMsg = message.toLowerCase();

  // 1️⃣ Check verified colleges first
  for (const key in collegeFacts) {
    if (lowerMsg.includes(key)) {
      const info = collegeFacts[key];
      let response = `${info.name}, located in ${info.location}.`;
      if (info.chancellors) {
        response += ` Chancellors: ${info.chancellors.map(c => `${c.name} (${c.start}-${c.end})`).join(', ')}.`;
      } else if (info.chancellor) {
        response += ` Chancellor: ${info.chancellor}.`;
      } else if (info.chairman) {
        response += ` Chairman: ${info.chairman}.`;
      }
      response += ` Website: ${info.website}`;
      return response;
    }
  }

  // 2️⃣ Try Wikipedia for other factual questions
  const wikiReply = await getWikipediaSummary(message);
  if (wikiReply) return wikiReply;

  // 3️⃣ Fallback to OpenAI for casual questions
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Nova, a helpful AI assistant. Answer concisely and accurately.' },
        { role: 'user', content: message }
      ],
      max_tokens: 400,
      temperature: 0.2
    });
    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error('OpenAI error:', err.message);
    return "Sorry — I couldn't fetch an answer right now.";
  }
}

module.exports = { getReply };
