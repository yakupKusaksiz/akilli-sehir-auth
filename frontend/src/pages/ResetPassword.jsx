import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

// İki adımlı akış: 1) e-posta ile kod iste, 2) kod + yeni şifre ile sıfırla
export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function requestCode(ev) {
    ev.preventDefault();
    setError('');
    if (!email.trim()) return setError('E-posta zorunludur');
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email: email.trim() });
      setInfo(res.message || 'Sıfırlama kodu e-posta adresine gönderildi.');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitNewPassword(ev) {
    ev.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(code)) return setError('Kod 6 haneli olmalı');
    if (password.length < 8 || !/\d/.test(password)) return setError('Şifre en az 8 karakter olmalı ve rakam içermeli');
    if (password !== password2) return setError('Şifreler eşleşmiyor');
    setLoading(true);
    try {
      await api.resetPassword({ email: email.trim(), code, password });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card">
        <h1>Şifre güncellendi</h1>
        <div className="alert success">Yeni şifrenle giriş yapabilirsin.</div>
        <div className="links"><Link to="/giris">Giriş ekranına dön</Link></div>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={step === 1 ? requestCode : submitNewPassword} noValidate>
      <h1>Şifre Sıfırlama</h1>
      {error && <div className="alert error">{error}</div>}
      {info && step === 2 && <div className="alert success">{info}</div>}
      <div className="field">
        <label htmlFor="email">E-posta</label>
        <input id="email" type="email" value={email} disabled={step === 2} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {step === 2 && (
        <>
          <div className="field">
            <label htmlFor="code">Doğrulama kodu</label>
            <input id="code" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Yeni şifre</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password2">Yeni şifre (tekrar)</label>
            <input id="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
          </div>
        </>
      )}
      <button type="submit" disabled={loading}>
        {loading ? 'Gönderiliyor…' : step === 1 ? 'Kod Gönder' : 'Şifreyi Güncelle'}
      </button>
      <div className="links"><Link to="/giris">Giriş ekranına dön</Link></div>
    </form>
  );
}
