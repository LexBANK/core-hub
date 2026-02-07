export function getChatHTML(): string {
	return /*html*/ `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LexBANK Chat</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #0f0f1a;
    color: #e0e0e0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #2a2a4a;
  }

  header h1 {
    font-size: 1.3rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  header .header-right {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  header .status {
    font-size: 0.8rem;
    color: #4ade80;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  header .status::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    display: inline-block;
  }

  #provider-select {
    background: #0f0f1a;
    color: #e0e0e0;
    border: 1px solid #2a2a4a;
    border-radius: 8px;
    padding: 6px 12px;
    font-size: 0.85rem;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    direction: ltr;
  }

  #provider-select:focus {
    border-color: #667eea;
  }

  #chat-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .message {
    max-width: 75%;
    padding: 14px 18px;
    border-radius: 16px;
    line-height: 1.6;
    font-size: 0.95rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message.user {
    align-self: flex-end;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-bottom-left: 4px;
  }

  .message.assistant {
    align-self: flex-start;
    background: #1e1e36;
    border: 1px solid #2a2a4a;
    border-bottom-right: 4px;
  }

  .message.assistant .thinking {
    color: #888;
    font-style: italic;
  }

  #input-area {
    padding: 16px 24px;
    background: #1a1a2e;
    border-top: 1px solid #2a2a4a;
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  #message-input {
    flex: 1;
    background: #0f0f1a;
    border: 1px solid #2a2a4a;
    border-radius: 12px;
    padding: 14px 18px;
    color: #e0e0e0;
    font-size: 0.95rem;
    font-family: inherit;
    resize: none;
    max-height: 150px;
    outline: none;
    transition: border-color 0.2s;
    direction: auto;
  }

  #message-input:focus {
    border-color: #667eea;
  }

  #message-input::placeholder {
    color: #555;
  }

  #send-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px 24px;
    font-size: 0.95rem;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  #send-btn:hover { opacity: 0.9; }
  #send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 0;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite;
  }

  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-8px); }
  }

  #chat-container::-webkit-scrollbar { width: 6px; }
  #chat-container::-webkit-scrollbar-track { background: transparent; }
  #chat-container::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 3px; }
</style>
</head>
<body>
  <header>
    <h1>LexBANK Chat</h1>
    <div class="header-right">
      <select id="provider-select">
        <option value="openai">OpenAI (GPT-4o mini)</option>
        <option value="perplexity">Perplexity (Sonar)</option>
      </select>
      <div class="status">متصل</div>
    </div>
  </header>

  <div id="chat-container">
    <div class="message assistant">مرحباً! أنا مساعد LexBANK الذكي. كيف أقدر أساعدك اليوم؟</div>
  </div>

  <div id="input-area">
    <textarea id="message-input" rows="1" placeholder="اكتب رسالتك هنا..." autofocus></textarea>
    <button id="send-btn">إرسال</button>
  </div>

  <script>
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const providerSelect = document.getElementById('provider-select');

    const conversationHistory = [];

    function addMessage(role, content) {
      const div = document.createElement('div');
      div.className = 'message ' + role;
      div.textContent = content;
      chatContainer.appendChild(div);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addTypingIndicator() {
      const div = document.createElement('div');
      div.className = 'message assistant';
      div.id = 'typing';
      div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
      chatContainer.appendChild(div);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function removeTypingIndicator() {
      const el = document.getElementById('typing');
      if (el) el.remove();
    }

    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
      messageInput.style.height = 'auto';
      messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
    });

    // Send on Enter (Shift+Enter for new line)
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    sendBtn.addEventListener('click', sendMessage);

    async function sendMessage() {
      const text = messageInput.value.trim();
      if (!text) return;

      addMessage('user', text);
      messageInput.value = '';
      messageInput.style.height = 'auto';
      sendBtn.disabled = true;

      conversationHistory.push({ role: 'user', content: text });

      addTypingIndicator();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory, provider: providerSelect.value }),
        });

        removeTypingIndicator();

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'حدث خطأ في الاتصال');
        }

        const data = await res.json();
        const reply = data.reply || 'لم أتمكن من الرد';

        conversationHistory.push({ role: 'assistant', content: reply });
        addMessage('assistant', reply);
      } catch (err) {
        removeTypingIndicator();
        addMessage('assistant', 'خطأ: ' + err.message);
      } finally {
        sendBtn.disabled = false;
        messageInput.focus();
      }
    }
  </script>
</body>
</html>`;
}
