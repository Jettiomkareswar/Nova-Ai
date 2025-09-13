const chat = document.getElementById('chat');
const form = document.getElementById('inputForm');
const input = document.getElementById('messageInput');
const langSelect = document.getElementById('langSelect');

function appendMessage(text, cls='nova') {
  const div = document.createElement('div');
  div.className = 'message ' + (cls==='user' ? 'user' : 'nova');
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  // show user message
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.textContent = text;
  chat.appendChild(userDiv);
  chat.scrollTop = chat.scrollHeight;
  input.value = '';
  // show loading
  const loading = document.createElement('div');
  loading.className = 'message nova';
  loading.textContent = 'Nova is typing...';
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try {
    const resp = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ message: text, language: langSelect.value })
    });
    const data = await resp.json();
    loading.remove();
    if (data && data.reply) {
      appendMessage(data.reply, 'nova');
    } else {
      appendMessage('Sorry, no answer (backend returned empty).', 'nova');
    }
  } catch (err) {
    loading.remove();
    appendMessage('Error: could not reach backend. Make sure server is running.', 'nova');
    console.error(err);
  }
});
