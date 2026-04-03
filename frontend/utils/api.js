const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      cache: 'no-store', // Always get fresh data for production
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error (${endpoint}):`, error);
    return [];
  }
};

export const postData = async (endpoint, data, isFormData = false) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    console.error(`API Post Error (${endpoint}):`, error);
    throw error;
  }
};
