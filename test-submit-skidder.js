(async () => {
  async function detectBase() {
    const ports = [3000, 3001, 3000, 3003, 3004, 3005];
    for (const p of ports) {
      try {
        const r = await fetch(`http://localhost:${p}/api/auth/csrf`)
        if (r && r.ok) return `http://localhost:${p}`
      } catch (e) {
        /* ignore */
      }
      try {
        const r2 = await fetch(`http://localhost:${p}/`)
        if (r2 && r2.status === 200) return `http://localhost:${p}`
      } catch (e) {
        /* ignore */
      }
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
  function cookieHeader(jar) { return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; '); }

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
      formType: 'skidder-pre-shift-inspection',
      formTitle: 'Skidder (Grapple & Cable) Pre-Shift Inspection Checklist',
      submittedBy: 'User One',
      hasDefects: false,
      data: {
        operatorName: 'User One',
        machineNumber: 'SK-001',
        date: new Date().toISOString().slice(0, 10),
        hourMeterStart: '100',
        hourMeterStop: '105',
        validTrainingCard: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0,10),
        items: {},
        hasDefects: false,
        defectDetails: '',
        signature: 'data:image/png;base64,TESTSIG'
      }
    };

    // mark all items as OK to satisfy required checks
    const itemsList = [
      "License and Phepha: Phepha valid / Displayed and visible",
      "Protective Structure: No cracks/damages / No bolts missing/loose / Guards not damaged and intact",
      "Exhaust: Clamps secure / No excessive smoking/blowing",
      "Cab: Cab neat and tidy / Door and mechanism working / Door rubber in good condition / Door handles functional",
      "Windscreen, Windows & Wipers: Clean/secure / No cracks or damages to windscreen / Window visibility not obscured by cracks / Wipers are working",
      "Seats: Condition of seat / Seat secured / Rotating lock functional / Seat adjuster functional",
      "Safety Belt: Safety belts bolted/secured / No damage / Retractor clip functional",
      "Hooter and Reverse Alarm: Hooter working and in good condition / Reverse alarm working",
      "Gauges: In working order / Any warning symbols/lights",
      "Hydraulic Controls: Not loose/responsive / No steering play / Rear steering / Pivot/steering ram pins not loose",
      "Working Lights (LED): In working order (if LED's, 2 thirds must be working)",
      "Rotating Light: Flashing/rotating beacon light in working condition",
      "Foot Brake: In working order / Check brake fluid levels in order",
      "Emergency Park Brake: Working",
      "Battery: Secure / Sufficient water / Terminals clean/tight & covers on / No exposed wiring",
      "Air Pre-Cleaner: Good condition / Clean and secure / No dust in pre-cleaner bowl",
      "Radiator: Secure / Water level correct / No signs of leaking",
      "Fan Belt: No squeaking / No signs of damage",
      "Oil/Fluid/Air Levels: Check all oil levels/brake fluid levels/clutch fluid levels are correct / Check air gauge in order",
      "Fuel, Air and Oil leaks: No more than 4 drops of oil per minute",
      "Grease: Adequately greased chassis / No missing or damaged grease nipples",
      "Tyres: No excessive wear and tear / No loose/missing/damaged nuts / Wheel nuts secure",
      "Hydraulic Cylinders: Good condition – no damage / No loose fittings / No oil leaks / No missing bolts/nuts",
      "Hydraulic Hoses and Fittings: No excessive rubbing / No loose brackets/bolts/nuts / Smooth operation / Jaws not cracked or broken",
      "Winch: Condition of cable good / Condition of drum good / Clutch and brake working / Roller guides in good condition",
      "Tackle: Cable/chains/hooks/slings/chocker chains/tag lines and sliders all in good condition / No fraying or damage",
      "Communication: Radio or cell phone in working condition / Handheld panic alarm functional",
      "Fire Extinguisher: In working order / Serviced / Gauge in order / Seal in place",
    ];
    for (const it of itemsList) payload.data.items[it] = 'ok';

    const r3 = await fetch(base + '/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json', cookie: cookieHeader(userJar) }, body: JSON.stringify(payload) });
    console.log('Submission POST ->', r3.status);
    const text3 = await r3.text();
    console.log('Submission response text:', text3);
    let body3;
    try { body3 = JSON.parse(text3); } catch (e) { console.error('Failed to parse JSON:', e); }
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
    const found = subs.find(s => s.formType === 'skidder-pre-shift-inspection' && s.submittedBy === 'User One');
    console.log('Submission found by admin?', !!found);
    if (!found) { console.error('Submission not present in admin list'); process.exit(1); }

    // Validate a couple of stored fields
    const checks = [
      { k: 'operatorName', exp: payload.data.operatorName, got: found.data.operatorName },
      { k: 'machineNumber', exp: payload.data.machineNumber, got: found.data.machineNumber },
      { k: 'date', exp: payload.data.date, got: (found.data.date || '').slice(0,10) },
      { k: 'signature', exp: 'TESTSIG', got: (found.data.signature || '') }
    ];

    for (const c of checks) {
      if (c.k === 'signature') {
        if (!c.got.includes(c.exp)) {
          console.error(`Field ${c.k} mismatch — expected signature to include ${c.exp}`);
          process.exit(1);
        }
      } else if (String(c.got) !== String(c.exp)) {
        console.error(`Field ${c.k} mismatch — expected='${c.exp}' got='${c.got}'`);
        process.exit(1);
      }
    }

    console.log('Field assertions passed');
    console.log('Skidder E2E test passed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();