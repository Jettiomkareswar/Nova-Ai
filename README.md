# Nova — AI Chat Assistant (Mini)

## What this is
A simple AI chat demo using:
- Frontend: static `index.html`, `style.css`, `script.js`
- Backend: Node.js + Express + OpenAI API

Supports multilingual replies (English, Hindi, Telugu, Tamil, Kannada). The backend detects language automatically or you can force the output language via the dropdown.

## Setup (run locally)

1. Extract the zip.
2. Open terminal and go to backend:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file in `backend/` with your OpenAI key:
   ```
   OPENAI_API_KEY=sk-...
   ```
4. Start backend:
   ```
   node server.js
   ```
5. Open `frontend/index.html` in your browser (double-click file or serve via a static server).

## Notes
- The backend uses OpenAI Chat Completions. Make sure your API key has access to the chosen model. If you don't have access to GPT-4 family, change model in `aiService.js` to `gpt-3.5-turbo`.
- For interviews: be honest that you integrated OpenAI API and built the frontend/backend glue code.

