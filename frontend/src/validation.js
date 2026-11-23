const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  if (!email.trim()) return 'E-posta zorunludur';
  if (!EMAIL_RE.test(email.trim())) return 'Geçerli bir e-posta adresi girin';
  return '';
}

export function validatePassword(pw) {
  if (!pw) return 'Şifre zorunludur';
  if (pw.length < 8) return 'Şifre en az 8 karakter olmalı';
  if (!/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(pw) || !/\d/.test(pw)) return 'Şifre en az bir harf ve bir rakam içermeli';
  return '';
}
