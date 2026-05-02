import { log } from '../middleware/log.js';

// Type weights: Placement > Result > Event
const TYPE_WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

export function scoreNotification(notification) {
  const typeWeight = TYPE_WEIGHTS[notification.Type] || 0;
  const timestampMs = new Date(notification.Timestamp).getTime();
  const recencyDecay = 1 / (Date.now() - timestampMs + 1);
  return (typeWeight * 1000) + recencyDecay;
}

export function getTopN(notifications, n, readIds) {
  log('frontend', 'info', 'utils', 'Started scoring notifications');

  const unreadNotifications = notifications.filter(notif => !readIds.has(notif.ID));
  
  log('frontend', 'info', 'utils', `Found ${unreadNotifications.length} unread notifications`);

  const scoredNotifications = unreadNotifications.map(notification => ({
    ...notification,
    score: scoreNotification(notification)
  }));

  scoredNotifications.sort((a, b) => b.score - a.score);

  const topN = scoredNotifications.slice(0, n);

  log('frontend', 'info', 'utils', `Selected top ${topN.length} notifications`);

  return topN;
}
