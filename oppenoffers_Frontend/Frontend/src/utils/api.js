import * as yup from 'yup';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

const api = async (url, method, body = null, schema = null) => {
  try {
    if (schema && body) {
      await schema.validate(body, { abortEarly: false });
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    
    // --- START OF UPDATED ERROR HANDLING ---
    const responseText = await response.text();
    let data;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      // This catch block triggers if the server returns HTML (like a 404 page)
      console.error('❌ Server returned non-JSON response. Raw output:');
      console.error(responseText); // This will show the actual HTML or error text
      throw new Error(`Server Error (${response.status}): The server did not return valid JSON.`);
    }
    // --- END OF UPDATED ERROR HANDLING ---

    console.log('Response data:', data);
    
    // MODIFIED: Don't throw error for non-OK responses
    // Just return the data, which contains success: false and error codes
    if (!response.ok) {
      console.error(`❌ API request failed with status: ${response.status}`);
      // Return the error data so the caller can handle it
      return {
        success: false,
        code: data.code || response.status,
        message: data.message || `API request failed with status ${response.status}`,
        status: response.status,
        ...data 
      };
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