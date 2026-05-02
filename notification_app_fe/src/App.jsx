import React, { useState } from 'react';
import AllNotifications from './pages/AllNotifications.jsx';
import PriorityInbox from './pages/PriorityInbox.jsx';
import './styles/global.css';

export default function App() {
  const [currentView, setCurrentView] = useState('all');

  return (
    <div>
      <nav style={{ padding: '24px', borderBottom: '1px solid #d0d0d0', maxWidth: '700px', margin: '0 auto', display: 'flex', gap: '16px' }}>
        <button 
          onClick={() => setCurrentView('all')}
          style={{ borderColor: currentView === 'all' ? '#0057ff' : '#d0d0d0', color: currentView === 'all' ? '#0057ff' : '#111111' }}
        >
          All Notifications
        </button>
        <button 
          onClick={() => setCurrentView('priority')}
          style={{ borderColor: currentView === 'priority' ? '#0057ff' : '#d0d0d0', color: currentView === 'priority' ? '#0057ff' : '#111111' }}
        >
          Priority Inbox
        </button>
      </nav>
      <main>
        {currentView === 'all' ? <AllNotifications /> : <PriorityInbox />}
      </main>
    </div>
  );
}
