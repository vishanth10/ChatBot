import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userMessage = { sender: 'user', text: query };
    setMessages([...messages, userMessage]);

    const companyResponse = await fetch('http://localhost:8000/getApi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }).then(res => res.json());

    const gptResponse = await fetch('http://localhost:8000/getResponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    }).then(res => res.json());

    const botMessage = {
      sender: 'bot',
      company: formatCompanyResponse(companyResponse),
      openAi: formatOpenAiResponse(gptResponse.response)
    };

    setMessages([...messages, userMessage, botMessage]);
    setQuery('');
    setLoading(false);
  };

  const formatCompanyResponse = (response) => {
    if (response.data && response.data.response_text) {
      const text = response.data.response_text.replace(/\n/g, '<br/>');
      const urls = response.data.web_url.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br/>');
      return `${text}<br/><br/>Sources:<br/>${urls}`;
    }
    return JSON.stringify(response);
  };

  const formatOpenAiResponse = (response) => {
    return response.replace(/\n/g, '<br/>').replace(/(### )/g, '<br/>');
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              <div className="message-content bot-message" dangerouslySetInnerHTML={{ __html: `<p><strong>Company Response:</strong><br/>${msg.company}</p><p><strong>OpenAI Response:</strong><br/>${msg.openAi}</p>` }} />
            ) : (
              <div className="message-content user-message">
                <strong>User:</strong> {msg.text}
              </div>
            )}
          </div>
        ))}
        {loading && <p className="loading">Loading...</p>}
      </div>
      {!loading && (
        <form onSubmit={handleSubmit} className="chat-input">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      )}
      <footer className="footer">
        <p>Made by Vishanth </p>
      </footer>
    </div>
  );
};

export default Chatbot;
