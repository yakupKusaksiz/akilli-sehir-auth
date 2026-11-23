import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { _reset } from '../src/userStore.js';

const app = createApp();
const user = { name: 'Test Kullanıcı', email: 'test@akillisehir.gov.tr', password: 'Sifre1234' };

beforeEach(() => _reset());

test('kayıt: geçerli bilgilerle 201 döner, şifre yanıtta yok', async () => {
  const res = await request(app).post('/api/auth/register').send(user);
  assert.equal(res.status, 201);
  assert.equal(res.body.user.email, user.email);
  assert.equal(res.body.user.passwordHash, undefined);
});

test('kayıt: aynı e-posta ikinci kez 409 döner', async () => {
  await request(app).post('/api/auth/register').send(user);
  const res = await request(app).post('/api/auth/register').send(user);
  assert.equal(res.status, 409);
});

test('kayıt: zayıf şifre ve hatalı e-posta 400 döner', async () => {
  assert.equal((await request(app).post('/api/auth/register').send({ ...user, password: '123' })).status, 400);
  assert.equal((await request(app).post('/api/auth/register').send({ ...user, email: 'gecersiz' })).status, 400);
});

test('giriş: doğru şifreyle token döner, /me kullanıcıyı verir', async () => {
  await request(app).post('/api/auth/register').send(user);
  const login = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
  assert.equal(login.status, 200);
  assert.ok(login.body.token);
  const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
  assert.equal(me.status, 200);
  assert.equal(me.body.user.name, user.name);
});

test('giriş: yanlış şifre 401, token olmadan /me 401', async () => {
  await request(app).post('/api/auth/register').send(user);
  const bad = await request(app).post('/api/auth/login').send({ email: user.email, password: 'Yanlis1234' });
  assert.equal(bad.status, 401);
  assert.equal((await request(app).get('/api/auth/me')).status, 401);
});

test('şifre sıfırlama: uçtan uca akış', async () => {
  await request(app).post('/api/auth/register').send(user);
  const forgot = await request(app).post('/api/auth/forgot-password').send({ email: user.email });
  assert.equal(forgot.status, 200);
  const code = forgot.body.devCode;
  assert.match(code, /^\d{6}$/);

  const wrong = await request(app).post('/api/auth/reset-password')
    .send({ email: user.email, code: code === '000000' ? '111111' : '000000', password: 'YeniSifre99' });
  assert.equal(wrong.status, 400);

  const reset = await request(app).post('/api/auth/reset-password')
    .send({ email: user.email, code, password: 'YeniSifre99' });
  assert.equal(reset.status, 200);

  const oldLogin = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
  assert.equal(oldLogin.status, 401);
  const newLogin = await request(app).post('/api/auth/login').send({ email: user.email, password: 'YeniSifre99' });
  assert.equal(newLogin.status, 200);

  const reuse = await request(app).post('/api/auth/reset-password')
    .send({ email: user.email, code, password: 'BaskaSifre77' });
  assert.equal(reuse.status, 400, 'kod ikinci kez kullanılamamalı');
});

test('şifre sıfırlama: kayıtlı olmayan e-posta için de aynı mesaj döner', async () => {
  const res = await request(app).post('/api/auth/forgot-password').send({ email: 'yok@ornek.com' });
  assert.equal(res.status, 200);
  assert.equal(res.body.devCode, undefined);
});
