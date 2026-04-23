import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am AgriBot. Need help finding a product or tracking an order?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    axios.post('http://localhost:5000/api/ai/chat', { message: userText })
      .then(res => {
        setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
      })
      .catch(err => {
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {isOpen && (
        <div style={{ 
          width: '320px', 
          height: '450px', 
          backgroundColor: '#fff', 
          borderRadius: '1rem', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          marginBottom: '1rem', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #eee'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> AgriBot AI
            </span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : '#e0e0e0',
                color: msg.sender === 'user' ? '#fff' : '#333',
                padding: '0.75rem 1rem',
                borderRadius: msg.sender === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                maxWidth: '85%',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: '#e0e0e0', padding: '0.75rem 1rem', borderRadius: '1rem 1rem 1rem 0', fontSize: '0.9rem' }}>
                <span className="dot-typing">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem', backgroundColor: '#fff' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Ask anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '2rem' }}
            />
            <button onClick={handleSend} style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '50%', 
          width: '60px', 
          height: '60px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
}
