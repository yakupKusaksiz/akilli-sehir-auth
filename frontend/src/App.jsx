import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

export default function App() {
  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">Akıllı Şehir</span>
        <nav>
          <Link to="/giris">Giriş</Link>
          <Link to="/kayit">Kayıt Ol</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/giris" replace />} />
          <Route path="/kayit" element={<Register />} />
          <Route path="/giris" element={<Login />} />
          <Route path="/sifre-sifirla" element={<ResetPassword />} />
        </Routes>
      </main>
    </div>
  );
}
