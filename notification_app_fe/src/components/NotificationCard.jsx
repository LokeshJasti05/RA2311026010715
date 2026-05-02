import React, { useEffect } from 'react';
import { log } from '../middleware/log.js';
import '../styles/NotificationCard.css';

export default function NotificationCard({ notification, isRead, onMarkRead }) {
  useEffect(() => {
    log('frontend', 'debug', 'component', `Rendered NotificationCard for ID: ${notification.ID}`);
  }, [notification.ID]);

  const formattedTimestamp = new Date(notification.Timestamp).toLocaleString();

  return (
    <div className={`notification-card ${isRead ? 'read' : 'unread'}`}>
      <div className="card-header">
        <span className="type-badge">{notification.Type}</span>
        <span className="timestamp">{formattedTimestamp}</span>
      </div>
      <div className="card-body">
        <p className="message">{notification.Message}</p>
      </div>
      {!isRead && (
        <div className="card-footer">
          <button className="mark-read-button" onClick={() => onMarkRead(notification.ID)}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
}
