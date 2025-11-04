const loginApi = 'http://localhost:5000/api/auth/login';

export const login = async (emailArg, passwordArg) => {
    try {
        const response = await fetch(loginApi, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: emailArg,
                Password: passwordArg,
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}
