// Simple end-to-end test: sign in as user -> submit excavator-harvester -> sign in as admin -> verify submission exists
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
    const userJar = {};
    const r1 = await fetch(base + '/api/auth/csrf');
    saveCookies(r1, userJar);
    const b = await r1.json();

    const form = new URLSearchParams({ csrfToken: b.csrfToken, email: 'user1@ringomode.co.za', password: 'User@123', callbackUrl: base + '/', json: 'true' });
    const r2 = await fetch(base + '/api/auth/callback/credentials', { method: 'POST', body: form, headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookieHeader(userJar) }, redirect: 'manual' });
    saveCookies(r2, userJar);
    console.log('User sign-in ->', r2.status, r2.headers.get('location'));

    const payload = {
      formType: 'excavator-harvester',
      formTitle: 'Excavator Harvester Pre-Shift Inspection Checklist',
      submittedBy: 'User One',
      hasDefects: false,
      data: {
        operatorName: 'User One',
        unitNumber: 'EH-001',
        date: new Date().toISOString().slice(0,10),
        items: {},
        hasDefects: false,
        defectDetails: '',
        signature: 'data:image/png;base64,TESTSIG'
      }
    };

    const r3 = await fetch(base + '/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json', cookie: cookieHeader(userJar) }, body: JSON.stringify(payload) });
    console.log('Submission POST ->', r3.status);
    const body3 = await r3.json().catch(() => null);
    console.log('Submission response', body3);

    if (r3.status !== 201) process.exit(1);

    const adminJar = {};
    const r4 = await fetch(base + '/api/auth/csrf'); saveCookies(r4, adminJar); const b2 = await r4.json();
    const form2 = new URLSearchParams({ csrfToken: b2.csrfToken, email: 'admin@ringomode.co.za', password: 'Admin@123', callbackUrl: base + '/admin', json: 'true' });
    const r5 = await fetch(base + '/api/auth/callback/credentials', { method: 'POST', body: form2, headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookieHeader(adminJar) }, redirect: 'manual' });
    saveCookies(r5, adminJar);
    console.log('Admin sign-in ->', r5.status, r5.headers.get('location'));

    const r6 = await fetch(base + '/api/submissions', { headers: { cookie: cookieHeader(adminJar) } });
    const subs = await r6.json();
    const found = subs.find(s => s.formType === 'excavator-harvester' && s.submittedBy === 'User One');
    console.log('Submission found by admin?', !!found);
    if (!found) process.exit(1);

    console.log('E2E test passed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();