import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications.js';
import { getTopN } from '../lib/priorityInbox.js';
import { log } from '../middleware/log.js';
import '../styles/PriorityInbox.css';

export default function PriorityInbox() {
  const [limitN, setLimitN] = useState(10);
  
  // Use a high limit to get a good pool for sorting
  const { notifications, loading, error } = useNotifications({ limit: 100, page: 1 });
  const [readIds] = useState(new Set());
  
  const topNotifications = getTopN(notifications, limitN, readIds);

  useEffect(() => {
    log('frontend', 'debug', 'page', `Rendered PriorityInbox with ${topNotifications.length} notifications`);
  }, [topNotifications.length]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Priority Inbox</h1>
        <div className="filter-bar">
          <label htmlFor="limit-filter">Show Top: </label>
          <select 
            id="limit-filter" 
            value={limitN} 
            onChange={(e) => setLimitN(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="priority-list">
        {loading && <p>Loading priority notifications...</p>}
        {!loading && topNotifications.length === 0 && <p>No unread priority notifications.</p>}
        {!loading && topNotifications.map((notif, index) => (
          <div key={notif.ID} className="priority-item">
            <div className="rank-badge">#{index + 1}</div>
            <div className="priority-content">
              <div className="priority-header">
                <span className="type-badge">{notif.Type}</span>
                <span className="timestamp">{new Date(notif.Timestamp).toLocaleString()}</span>
              </div>
              <p className="message">{notif.Message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
