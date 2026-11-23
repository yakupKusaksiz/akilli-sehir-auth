# Akıllı Şehir – Kimlik Doğrulama (Authentication) Modülü

Bilgisayar Mühendisliğinde Proje Yönetimi dersi **Laboratuvar 1** çalışması:
Jira & GitHub entegrasyonu ile Kanban uygulaması.

Modül: **Kullanıcı Kayıt, Giriş ve Şifre Sıfırlama**

## Ekip

| Rol | Kişi |
|-----|------|
| Product Owner + Frontend Developer | Yakup Kuşaksız |
| Backend Developer | Zeynep Naz Önel |

## Yapı

```
backend/   Node.js + Express REST API (kayıt, giriş, şifre sıfırlama)
frontend/  React + Vite arayüzü (kayıt, giriş, şifre sıfırlama ekranları)
```

## Çalıştırma

```bash
# Backend (http://localhost:4000)
cd backend && npm install && npm start

# Testler
cd backend && npm test

# Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev
```

## API

| Yöntem | Yol | Açıklama |
|--------|-----|----------|
| POST | `/api/auth/register` | Yeni kullanıcı kaydı |
| POST | `/api/auth/login` | Giriş, JWT döner |
| GET  | `/api/auth/me` | Token ile oturumdaki kullanıcı |
| POST | `/api/auth/forgot-password` | Şifre sıfırlama kodu üretir |
| POST | `/api/auth/reset-password` | Kod ile yeni şifre belirler |

## Çalışma Akışı

Her Jira görevi için ayrı branch açılır (`AUTH-4-kayit-ekrani` gibi), commit mesajları
görev koduyla başlar (Smart Commits), Pull Request takım arkadaşı tarafından onaylandıktan
sonra `main`'e merge edilir.
