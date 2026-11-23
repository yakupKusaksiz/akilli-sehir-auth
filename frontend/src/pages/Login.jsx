import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../api.js';
import { session } from '../session.js';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(ev) {
    ev.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('E-posta ve şifre zorunludur');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await api.login({ email: email.trim(), password });
      session.save(token);
      setUser(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    return (
      <div className="card">
        <h1>Hoş geldin, {user.name}</h1>
        <div className="alert success">Giriş başarılı.</div>
        <button onClick={() => { session.clear(); setUser(null); }}>Çıkış yap</button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <h1>Giriş Yap</h1>
      {location.state?.registered && <div className="alert success">Kayıt başarılı, şimdi giriş yapabilirsin.</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="field">
        <label htmlFor="email">E-posta</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Şifre</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}</button>
      <div className="links">
        <Link to="/sifre-sifirla">Şifremi unuttum</Link> · <Link to="/kayit">Kayıt ol</Link>
      </div>
    </form>
  );
}
