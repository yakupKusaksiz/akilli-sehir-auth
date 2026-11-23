async function post(path, body, token) {
  const res = await fetch(`/api/auth${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Beklenmeyen bir hata oluştu');
  return data;
}

export const api = {
  register: (payload) => post('/register', payload),
  login: (payload) => post('/login', payload),
  forgotPassword: (payload) => post('/forgot-password', payload),
  resetPassword: (payload) => post('/reset-password', payload),
};
