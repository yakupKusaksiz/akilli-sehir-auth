const KEY = 'akilli-sehir-token';

export const session = {
  save(token) { try { localStorage.setItem(KEY, token); } catch { /* depolama kapalı olabilir */ } },
  get() { try { return localStorage.getItem(KEY); } catch { return null; } },
  clear() { try { localStorage.removeItem(KEY); } catch { /* yok say */ } },
};
