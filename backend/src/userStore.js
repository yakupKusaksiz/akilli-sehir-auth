// Basit bellek içi kullanıcı deposu. Gerçek projede veritabanı ile değiştirilecek.
const users = new Map(); // email -> user

let nextId = 1;

export function findByEmail(email) {
  return users.get(String(email).toLowerCase()) || null;
}

export function findById(id) {
  for (const u of users.values()) if (u.id === id) return u;
  return null;
}

export function createUser({ name, email, passwordHash }) {
  const user = {
    id: nextId++,
    name,
    email: String(email).toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.set(user.email, user);
  return user;
}

export function updateUser(email, fields) {
  const user = findByEmail(email);
  if (!user) return null;
  Object.assign(user, fields);
  return user;
}

export function publicUser(user) {
  const { passwordHash, resetCode, resetExpires, ...rest } = user;
  return rest;
}

export function _reset() {
  users.clear();
  nextId = 1;
}
