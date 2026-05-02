import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications.js';
import NotificationCard from '../components/NotificationCard.jsx';
import { log } from '../middleware/log.js';
import '../styles/AllNotifications.css';

export default function AllNotifications() {
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { notifications, loading, error } = useNotifications({
    type: typeFilter,
    page,
    limit
  });

  const [readIds, setReadIds] = useState(new Set());

  const handleMarkRead = (id) => {
    setReadIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    log('frontend', 'info', 'state', `Marked notification ${id} as read`);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>All Notifications</h1>
        <div className="filter-bar">
          <label htmlFor="type-filter">Filter by Type: </label>
          <select 
            id="type-filter" 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Event">Event</option>
            <option value="Result">Result</option>
            <option value="Placement">Placement</option>
          </select>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      
      <div className="notifications-list">
        {loading && <p>Loading notifications...</p>}
        {!loading && notifications.length === 0 && <p>No notifications found.</p>}
        {!loading && notifications.map(notif => (
          <NotificationCard 
            key={notif.ID} 
            notification={notif} 
            isRead={readIds.has(notif.ID)}
            onMarkRead={handleMarkRead}
          />
        ))}
      </div>

      <div className="pagination-controls">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="page-indicator">Page {page} of Y</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={notifications.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  );
}
