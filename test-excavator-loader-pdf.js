const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

;(async () => {
  async function detectBase() {
    const ports = [3000,3001,3002,3003,3004,3005];
    for (const p of ports) {
      try { const r = await fetch(`http://localhost:${p}/api/auth/csrf`); if (r && r.ok) return `http://localhost:${p}` } catch(e){}
      try { const r2 = await fetch(`http://localhost:${p}/`); if (r2 && r2.status === 200) return `http://localhost:${p}` } catch(e){}
    }
    return process.env.BASE_URL || 'http://localhost:3001'
  }
  const base = await detectBase();
  // Helper to create a submission (reuse same pattern)
  async function createSubmission() {
    const userJar = {}
    function saveCookies(r, jar) {
      const set = r.headers.get('set-cookie')
      if (!set) return
      set.split(/,\s*(?=[^,]+=)/).forEach(c => {
        const [p] = c.split(';')
        const [k, v] = p.split('=')
        jar[k.trim()] = v
      })
    }
    function cookieHeader(jar) { return Object.entries(jar).map(([k,v]) => `${k}=${v}`).join('; ') }

    const r1 = await fetch(base + '/api/auth/csrf')
    saveCookies(r1, userJar)
    const b = await r1.json()

    const form = new URLSearchParams({ csrfToken: b.csrfToken, email: 'user1@ringomode.co.za', password: 'User@123', callbackUrl: base + '/', json: 'true' });
    const r2 = await fetch(base + '/api/auth/callback/credentials', { method: 'POST', body: form, headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: cookieHeader(userJar) }, redirect: 'manual' });
    saveCookies(r2, userJar)

    const now = new Date().toISOString().slice(0,10)
    const payload = {
      formType: 'excavator-loader',
      formTitle: 'Excavator Loader Pre-Shift Inspection Checklist',
      submittedBy: 'PDF Test User',
      hasDefects: true,
      data: {
        operatorName: 'PDF Test User',
        unitNumber: 'PDF-001',
        date: now,
        items: { 'Fire extinguisher (serviced/sealed)': 'ok' },
        hasDefects: true,
        defectDetails: 'Brake defect noted',
        signature: 'data:image/png;base64,TESTSIGPDF'
      }
    }

    const r3 = await fetch(base + '/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json', cookie: cookieHeader(userJar) }, body: JSON.stringify(payload) });
    if (r3.status !== 201) throw new Error('Failed to create submission')
    const body = await r3.json()
    return { payload, id: body.id }
  }

  try {
    const { id, payload } = await createSubmission()
    console.log('Created submission', id)

    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({ acceptDownloads: true })
    const page = await context.newPage()

    // Login as admin via the UI
    await page.goto(base + '/login')
    await page.fill('#email', 'admin@ringomode.co.za')
    await page.fill('#password', 'Admin@123')
    await Promise.all([
      page.waitForNavigation({ url: '**/admin' }),
      page.click('button:has-text("Sign In")')
    ])

    // Wait for the created submission to appear
    await page.waitForSelector(`text=${payload.submittedBy}`)

    // Open the submission preview (click View button in the same row)
    const row = page.locator('tr', { hasText: payload.submittedBy })
    await row.getByRole('button', { name: 'View' }).click()

    // Click PDF inside the preview dialog and capture download
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'PDF' }).click()
    ])

    const downloadsDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir)
    const outPath = path.join(downloadsDir, `e2e-excavator-loader-${id}.pdf`)
    await download.saveAs(outPath)
    console.log('Saved PDF to', outPath)

    const buf = fs.readFileSync(outPath)
    // Check PDF contains the form title text
    if (buf.indexOf(Buffer.from('Excavator Loader Pre-Shift Inspection')) === -1) {
      throw new Error('PDF does not contain expected title text')
    }

    // Check PDF binary contains an embedded PNG signature (0x89 0x50 0x4E 0x47)
    if (buf.indexOf(Buffer.from([0x89, 0x50, 0x4E, 0x47])) === -1) {
      throw new Error('PDF does not contain embedded PNG bytes (images)')
    }

    // If the DocuWare extractor images are present in `public/images`, assert at least
    // one of the Excavator Loader originals was embedded in the PDF. If not present
    // locally (e.g. during local dev), skip this stronger assertion.
    const loaderImageNames = [
      'excavator-loader-fire-safety.png',
      'excavator-loader-operator-environment.png',
      'excavator-loader-fluids-filters.png',
      'excavator-loader-electrical.png',
      'excavator-loader-undercarriage-attachments.png',
      'excavator-loader-exhaust-instruments.png',
      'excavator-loader-brakes-steering.png',
      'excavator-loader-wheels-tyres.png',
      'excavator-loader-lubrication-leaks.png',
      'excavator-loader-loader-quick-hitch.png'
    ]

    const imagesOnDisk = loaderImageNames.filter(n => fs.existsSync(path.join(process.cwd(), 'public', 'images', n)))
    if (imagesOnDisk.length > 0) {
      let foundAny = false
      for (const name of imagesOnDisk) {
        const imgBuf = fs.readFileSync(path.join(process.cwd(), 'public', 'images', name))
        if (buf.indexOf(imgBuf) !== -1) {
          console.log('Found embedded image in PDF:', name)
          foundAny = true
          break
        }
      }
      if (!foundAny) {
        throw new Error('PDF does not contain any of the Excavator Loader DocuWare images found in public/images')
      }
    } else {
      console.log('No Excavator Loader DocuWare images present in public/images — skipping image-specific assertion')
    }

    console.log('PDF verification passed')
    await browser.close()
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
