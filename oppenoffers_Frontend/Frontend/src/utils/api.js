import * as yup from 'yup';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('🔐 Token from localStorage:', token ? 'Exists' : 'MISSING');
  return token;
};

const api = async (url, method, body = null, schema = null) => {
  try {
    console.log('🚀 Making API request:');
    console.log('   URL:', url);
    console.log('   Method:', method);
    console.log('   Body:', body);

    if (schema && body) {
      await schema.validate(body, { abortEarly: false });
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('   Authorization header: Present');
    } else {
      console.log('   Authorization header: MISSING');
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log('   Sending request...');
    const response = await fetch(url, options);
    console.log('   Response status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('   Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    console.log('✅ API request successful');
    return data;
  } catch (error) {
    console.error('❌ API request failed:', error);
    if (error instanceof yup.ValidationError) {
      throw { validationError: error.errors };
    }
    throw error;
  }
};

export default api;