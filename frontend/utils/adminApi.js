const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

export const fetchAdminData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: getHeaders(),
    });
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Admin Fetch Error (${endpoint}):`, error);
    throw error;
  }
};

export const postAdminData = async (endpoint, data, isFormData = false) => {
  try {
    const headers = getHeaders();
    if (isFormData) delete headers['Content-Type'];

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`Admin Post Error (${endpoint}):`, error);
    throw error;
  }
};

export const putAdminData = async (endpoint, data, isFormData = false) => {
    try {
      const headers = getHeaders();
      if (isFormData) delete headers['Content-Type'];
  
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers,
        body: isFormData ? data : JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error(`Admin Put Error (${endpoint}):`, error);
      throw error;
    }
};

export const deleteAdminData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await response.json();
  } catch (error) {
    console.error(`Admin Delete Error (${endpoint}):`, error);
    throw error;
  }
};
