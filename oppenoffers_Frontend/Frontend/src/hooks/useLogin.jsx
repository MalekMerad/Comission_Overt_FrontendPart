import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { sendResetLinkService } from '../services/sendResetLinkService';


const loginApi = 'http://localhost:5000/api/auth/login';
const resetPasswordApi = 'http://localhost:5000/api/auth/ResetPassword';



export const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const loginUser = async (email, password) => {
        try {
            const response = await fetch(loginApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email: email, Password: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Login failed');
            }

            console.log('Login response:', data);
            
            const userData = { 
                userId: data.userId,
            };
            
            console.log('Calling login with userData:', userData, 'token:', data.token);
            
            login(userData, data.token);
            
            localStorage.setItem("userID", data.userId);
            
            navigate("/admin");
            
        } catch (error) {
            setError(error.message);
            console.error('Login error:', error);
        }
    };

    return { loginUser, error };
};


export const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendResetLink = async (email) => {
    try {
      setError(null);
      setLoading(true);
      await sendResetLinkService(email);
    } catch (err) {
      setError(err.message);
      console.error('ForgotPassword error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { sendResetLink, error, loading };
};



export const useResetPassword = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(resetPasswordApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Reset password failed');
      }
      return true;
    } catch (err) {
      setError(err.message);
      console.error('ResetPassword error:', err);
     return false;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, error, loading };
};