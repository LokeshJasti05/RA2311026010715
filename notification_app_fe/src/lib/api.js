import { log } from '../middleware/log.js';

const API_BASE_URL = 'http://20.207.122.201/evaluation-service';

export async function fetchNotifications({ page, limit, type }) {
  log('frontend', 'info', 'api', `Fetching notifications for page ${page || 'unknown'}, limit ${limit || 'unknown'}, type ${type || 'all'}`);
  
  try {
    const token = sessionStorage.getItem('auth_token');
    
    const query = new URLSearchParams();
    if (limit) query.append('limit', limit);
    if (page) query.append('page', page);
    if (type) query.append('notification_type', type);

    const url = `${API_BASE_URL}/notifications?${query.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    log('frontend', 'info', 'api', `Fetched ${data?.notifications?.length || 0} notifications successfully`);
    return data;
  } catch (error) {
    log('frontend', 'error', 'api', `Failed to fetch notifications: ${error.message}`);
    throw error;
  }
}
