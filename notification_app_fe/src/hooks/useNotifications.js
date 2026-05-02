import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '../lib/api.js';
import { log } from '../middleware/log.js';

export function useNotifications({ token, type, page, limit }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAction = useCallback(async (isPoll = false) => {
    if (isPoll) {
      log('frontend', 'info', 'hook', 'Auto-poll triggered for notifications');
    } else {
      log('frontend', 'info', 'hook', 'Starting notification fetch lifecycle');
    }

    try {
      if (!isPoll) setLoading(true);
      const data = await fetchNotifications({ type, page, limit });
      setNotifications(data.notifications || []);
      setError(null);
      log('frontend', 'info', 'hook', 'Completed notification fetch lifecycle');
    } catch (err) {
      setError(err.message);
      log('frontend', 'error', 'hook', `Error in notification fetch lifecycle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [type, page, limit]);

  useEffect(() => {
    fetchAction();
  }, [fetchAction]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAction(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAction]);

  return { notifications, loading, error, refetch: () => fetchAction(false) };
}
