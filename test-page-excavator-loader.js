(async () => {
  async function detectBase() {
    const ports = [3000,3001,3002,3003,3004,3005];
    for (const p of ports) {
      try { const r = await fetch(`http://localhost:${p}/api/auth/csrf`); if (r && r.ok) return `http://localhost:${p}` } catch(e){}
      try { const r2 = await fetch(`http://localhost:${p}/`); if (r2 && r2.status === 200) return `http://localhost:${p}` } catch(e){}
    }
    return process.env.BASE_URL || 'http://localhost:3001'
  }
  const base = await detectBase();
  function saveCookies(r, jar) {
    const set = r.headers.get('set-cookie');
    if (!set) return;
    set.split(/,\s*(?=[^,]+=)/).forEach(c => {
      const [p] = c.split(';');
      const [k, v] = p.split('=');
      jar[k.trim()] = v;
    });
  }
  function cookieHeader(jar) { return Object.entries(jar).map(([k,v]) => `${k}=${v}`).join('; '); }

  try {
    const jar = {};
    const r1 = await fetch(base + '/api/auth/csrf'); saveCookies(r1, jar); const b = await r1.json();
    const form = new URLSearchParams({ csrfToken: b.csrfToken, email: 'user1@ringomode.co.za', password: 'User@123', callbackUrl: base + '/', json: 'true' });
    const r2 = await fetch(base + '/api/auth/callback/credentials', { method: 'POST', body: form, headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookieHeader(jar) }, redirect: 'manual' });
    saveCookies(r2, jar);
    console.log('User sign-in ->', r2.status, r2.headers.get('location'));

    const r3 = await fetch(base + '/excavator-loader', { headers: { cookie: cookieHeader(jar) } });
    const html = await r3.text();
    const present = html.includes('Excavator Loader Pre-Shift Inspection');
    console.log('/excavator-loader served ->', r3.status, 'contains form title?', present);
    if (!present) {
      console.error('Form title not found in HTML response; printing snippet:');
      console.error(html.slice(0, 2000));
      process.exit(1);
    }

    console.log('Smoke test passed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();