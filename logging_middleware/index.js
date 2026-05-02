export async function log(stack, level, pkg, message) {
  try {
    const token = sessionStorage.getItem('auth_token');
    
    const payload = {
      stack: (stack || 'frontend').toLowerCase(),
      level: (level || 'info').toLowerCase(),
      package: (pkg || '').toLowerCase(),
      message: message
    };

    const response = await fetch('http://20.207.122.201/evaluation-service/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Log API returned ${response.status}`);
    }
  } catch (err) {
    console.warn('Logging middleware failed:', err.message);
  }
}
