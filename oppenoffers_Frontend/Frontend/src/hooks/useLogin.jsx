import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const loginApi = 'http://localhost:5000/api/auth/login';

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