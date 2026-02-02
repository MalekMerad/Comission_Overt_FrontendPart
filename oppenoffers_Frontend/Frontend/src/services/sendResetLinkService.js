const forgotPasswordApi = 'http://localhost:5000/api/auth/ForgotPassword';

export const sendResetLinkService = async (email) => {
  const response = await fetch(forgotPasswordApi, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Email: email })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to send reset link');
  }

  return data;
};
