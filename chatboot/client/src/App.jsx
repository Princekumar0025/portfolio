import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from './components/ChatWindow';
import Canvas from './components/Canvas';

function App() {
  const [currentSessionId, setCurrentSessionId] = useState(Date.now().toString());
  const [sessions, setSessions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5004';

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/chat/sessions`);
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentSessionId]); // Reload sidebar when the session changes

  const startNewChat = () => {
    setCurrentSessionId(Date.now().toString());
    if (window.innerWidth <= 768) setIsSidebarOpen(false);
    setActiveArtifact(null); // Close canvas on new chat
  };

  return (
    <div className={`app-container ${activeArtifact ? 'canvas-open' : ''}`}>
      {isSidebarOpen && <div className="mobile-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" onClick={startNewChat}>
          <div className="sidebar-icon">+</div>
          New chat
        </div>
        <div className="sidebar-history-list">
          <div className="history-title">Recent Chats</div>
          {sessions.map(session => (
            <div
              key={session.sessionId}
              className={`history-item ${currentSessionId === session.sessionId ? 'active' : ''}`}
              onClick={() => {
                setCurrentSessionId(session.sessionId);
                if (window.innerWidth <= 768) setIsSidebarOpen(false);
              }}
            >
              {session.text ? session.text.substring(0, 25) + '...' : 'Media Message'}
            </div>
          ))}
        </div>
      </div>
      <ChatWindow
        sessionId={currentSessionId}
        onMessageSent={fetchSessions}
        onMenuClick={toggleSidebar}
        onOpenCanvas={(artifact) => setActiveArtifact(artifact)}
      />
      {activeArtifact && <Canvas codeData={activeArtifact} onClose={() => setActiveArtifact(null)} />}
    </div>
  );
}

export default App;
