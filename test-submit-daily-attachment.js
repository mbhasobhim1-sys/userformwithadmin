// Use global fetch (Node 18+). If your Node doesn't support fetch, run this from browser or install node-fetch.

(async () => {
  const base = 'http://localhost:3000';

  function saveCookies(r, jar) {
    const set = r.headers.get('set-cookie');
    if (!set) return;
    set.split(/,\s*(?=[^,]+=)/).forEach(c => {
      const [p] = c.split(';');
      const [k, v] = p.split('=');
      jar[k.trim()] = v;
    });
  }
  function cookieHeader(jar) {
    return Object.entries(jar).map(([k,v]) => `${k}=${v}`).join('; ');
  }

  const userJar = {};
  try {
    // CSRF
    const r1 = await fetch(base + '/api/auth/csrf');
    saveCookies(r1, userJar);
    const b = await r1.json();

    // Sign in as user
    const form = new URLSearchParams({
      csrfToken: b.csrfToken,
      email: 'user1@ringomode.co.za',
      password: 'User@123',
      callbackUrl: base + '/',
      json: 'true'
    });
    const r2 = await fetch(base + '/api/auth/callback/credentials', {
      method: 'POST',
      body: form,
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'cookie': cookieHeader(userJar) },
      redirect: 'manual'
    });
    saveCookies(r2, userJar);
    console.log('Signed in as user -> status', r2.status, 'location', r2.headers.get('location'));

    // Submit daily attachment checklist
    const payload = {
      formType: 'daily-attachment-checklist',
      formTitle: 'Daily Attachment Checklist',
      submittedBy: 'User One',
      hasDefects: true,
      data: {
        mechanicName: 'User One',
        harvesterNumber: 'H-123',
        date: new Date().toISOString().slice(0,10),
        harvesterHours: '42',
        items: {},
        hasDefects: true,
        defectDetails: 'Test defect details',
        signature: 'data:image/png;base64,TEST'
      }
    };

    const r3 = await fetch(base + '/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'cookie': cookieHeader(userJar) },
      body: JSON.stringify(payload)
    });
    console.log('Submission POST -> status', r3.status);
    const body3 = await r3.json().catch(() => null);
    console.log('Submission response:', body3);

    if (r3.status !== 201) {
      console.error('Submission failed — cannot continue admin verification');
      process.exit(r3.status);
    }

    const submissionId = body3?.id;

    // Sign in as admin to verify
    const adminJar = {};
    const r4 = await fetch(base + '/api/auth/csrf');
    saveCookies(r4, adminJar);
    const b2 = await r4.json();

    const form2 = new URLSearchParams({
      csrfToken: b2.csrfToken,
      email: 'admin@ringomode.co.za',
      password: 'Admin@123',
      callbackUrl: base + '/admin',
      json: 'true'
    });
    const r5 = await fetch(base + '/api/auth/callback/credentials', {
      method: 'POST',
      body: form2,
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'cookie': cookieHeader(adminJar) },
      redirect: 'manual'
    });
    saveCookies(r5, adminJar);
    console.log('Signed in as admin -> status', r5.status, 'location', r5.headers.get('location'));

    const r6 = await fetch(base + '/api/submissions', { headers: { cookie: cookieHeader(adminJar) } });
    console.log('/api/submissions (admin) -> status', r6.status);
    const subs = await r6.json();
    const found = subs.find(s => s.id === submissionId);
    console.log('Submission found in admin list?', !!found);
    if (found) console.log('Found submission:', { id: found.id, formType: found.formType, submittedBy: found.submittedBy });

    process.exit(0);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
