const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const names = [
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

async function toBase64FromUrl(page, url) {
  try {
    const res = await page.request.get(url)
    if (!res.ok()) return null
    const buffer = await res.body()
    return `data:image/png;base64,${buffer.toString('base64')}`
  } catch (e) {
    return null
  }
}

;(async () => {
  const url = 'https://dsp.docuware.cloud/docuware/formsweb/ringomode-excavator-loader-pre-shift-inspection'
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  console.log('Loading DocuWare page...')
  await page.goto(url, { waitUntil: 'networkidle' })

  // Collect candidate images from img[src], canvas.toDataURL(), and computed background-image
  const candidates = await page.evaluate(() => {
    const out = []
    // <img> tags
    for (const img of Array.from(document.querySelectorAll('img'))) {
      if (img.src) out.push(img.src)
    }
    // canvas elements
    for (const c of Array.from(document.querySelectorAll('canvas'))) {
      try { out.push(c.toDataURL()) } catch (e) { /* ignore tainted canvases */ }
    }
    // background-image CSS
    for (const el of Array.from(document.querySelectorAll('*')))
    {
      const s = window.getComputedStyle(el).backgroundImage || ''
      if (s && s !== 'none') {
        const match = /url\((?:"|')?(.*?)(?:"|')?\)/.exec(s)
        if (match && match[1]) out.push(match[1])
      }
    }
    return out.filter(Boolean)
  })

  console.log('Found', candidates.length, 'candidate images on page')

  const saved = []
  for (let i = 0; i < names.length; i++) {
    const candidate = candidates[i]
    if (!candidate) {
      console.log(`No candidate for index ${i} -> ${names[i]}`)
      continue
    }

    let dataUrl = null
    if (candidate.startsWith('data:')) {
      dataUrl = candidate
    } else {
      dataUrl = await toBase64FromUrl(page, candidate)
    }

    if (!dataUrl) {
      console.log(`Failed to retrieve image for ${names[i]} from ${candidate}`)
      continue
    }

    // Write file
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '')
    const outPath = path.join(process.cwd(), 'public', 'images', names[i])
    fs.writeFileSync(outPath, Buffer.from(base64, 'base64'))
    console.log('Wrote', outPath)
    saved.push(outPath)
  }

  await browser.close()

  if (saved.length === 0) {
    console.log('No images were saved — page may render images differently or require auth')
    process.exit(1)
  }

  console.log('Saved', saved.length, 'images')
  process.exit(0)
})()
