const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

// En az 8 karakter, en az bir harf ve bir rakam
export function isStrongPassword(pw) {
  return typeof pw === 'string' && pw.length >= 8 && /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(pw) && /\d/.test(pw);
}
