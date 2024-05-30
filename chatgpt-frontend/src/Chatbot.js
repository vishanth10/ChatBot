import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleSearch = () => {
    setSearchEnabled(!searchEnabled);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userMessage = { sender: 'user', text: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    if (searchEnabled) {
      const [companyResponse, gptResponse] = await Promise.all([
        fetch('http://localhost:8000/getApi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        }).then(res => res.json()),
        fetch('http://localhost:8000/getResponse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        }).then(res => res.json())
      ]);

      streamResponses(formatCompanyResponse(companyResponse), formatOpenAiResponse(gptResponse.response));
    } else {
      const gptResponse = await fetch('http://localhost:8000/getResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).then(res => res.json());

      streamResponses(null, formatOpenAiResponse(gptResponse.response));
    }

    setQuery('');
    setLoading(false);
  };

  const streamResponses = (companyResponse, openAiResponse) => {
    const companyParts = companyResponse ? companyResponse.split(' ') : [];
    const openAiParts = openAiResponse.split(' ');

    let streamedCompany = '';
    let streamedOpenAi = '';

    if (companyResponse) {
      companyParts.forEach((part, i) => {
        setTimeout(() => {
          streamedCompany += part + ' ';
          const botMessage = {
            sender: 'bot',
            company: streamedCompany,
            openAi: streamedOpenAi
          };
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage.sender === 'user') {
              return [...prevMessages, botMessage];
            } else {
              return [...prevMessages.slice(0, -1), botMessage];
            }
          });
        }, i * 100);
      });
    }

    openAiParts.forEach((part, i) => {
      setTimeout(() => {
        streamedOpenAi += part + ' ';
        const botMessage = {
          sender: 'bot',
          company: streamedCompany,
          openAi: streamedOpenAi
        };
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.sender === 'user') {
            return [...prevMessages, botMessage];
          } else {
            return [...prevMessages.slice(0, -1), botMessage];
          }
        });
      }, (companyParts.length + i) * 100);
    });
  };

  const formatCompanyResponse = (response) => {
    if (response.data && response.data.response_text) {
      const paragraphs = response.data.response_text.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
      const urls = response.data.web_url.map(url => `<a href="${url}" target="_blank">${url}</a>`).join('<br/>');
      return `${paragraphs}<br/><br/>Sources:<br/>${urls}`;
    }
    return JSON.stringify(response);
  };

  const formatOpenAiResponse = (response) => {
    const paragraphs = response.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
    return paragraphs;
  };

  return (
    <div className={`chatbot ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="chat-container">
        <div className="toggle-container">
          <label className="toggle-label">Enable Search</label>
          <label className="toggle-switch">
            <input type="checkbox" checked={searchEnabled} onChange={handleToggleSearch} />
            <span className="slider"></span>
          </label>
          <label className="toggle-label">Dark Mode</label>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggleDarkMode} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.sender === 'bot' ? (
                <div className="message-content bot-message">
                  <div dangerouslySetInnerHTML={{ __html: `<p><strong>OpenAI Response:</strong><br/>${msg.openAi}</p>` }} />
                  {msg.company && (
                    <div dangerouslySetInnerHTML={{ __html: `<p><strong>Company Response:</strong><br/>${msg.company}</p>` }} />
                  )}
                </div>
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
      </div>
      <footer className="footer">
        <p>Made by Vishanth </p>
      </footer>
    </div>
  );
};

export default Chatbot;
