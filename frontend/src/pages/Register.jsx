import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { validateEmail, validatePassword } from '../validation.js';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Ad soyad en az 2 karakter olmalı';
    const em = validateEmail(form.email); if (em) e.email = em;
    const pw = validatePassword(form.password); if (pw) e.password = pw;
    if (form.password !== form.password2) e.password2 = 'Şifreler eşleşmiyor';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await api.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/giris', { state: { registered: true } });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const field = (key, label, type = 'text') => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input id={key} type={type} value={form[key]} onChange={set(key)} className={errors[key] ? 'invalid' : ''} />
      {errors[key] && <div className="err">{errors[key]}</div>}
    </div>
  );

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <h1>Kayıt Ol</h1>
      {serverError && <div className="alert error">{serverError}</div>}
      {field('name', 'Ad Soyad')}
      {field('email', 'E-posta', 'email')}
      {field('password', 'Şifre', 'password')}
      {field('password2', 'Şifre (tekrar)', 'password')}
      <button type="submit" disabled={loading}>{loading ? 'Kaydediliyor…' : 'Kayıt Ol'}</button>
      <div className="links">Zaten hesabın var mı? <Link to="/giris">Giriş yap</Link></div>
    </form>
  );
}
