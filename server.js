require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ai = require('./aiService');
const connectDB = require('./db');   // 👈 NEW

const app = express();
app.use(cors());
app.use(express.json());

// 👇 Connect to MongoDB at startup
connectDB();

app.post('/chat', async (req, res) => {
  try {
    const { message, language } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    const reply = await ai.getReply(message, language || 'auto');

    // Later: save { message, reply } to MongoDB here

    res.json({ reply });
  } catch (err) {
    console.error('Error /chat:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Nova backend listening on ${PORT}`));
