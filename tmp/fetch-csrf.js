(async () => {
  try {
    const res = await fetch('http://localhost:3004/api/auth/csrf')
    console.log('status', res.status)
    const text = await res.text()
    console.log('content-type:', res.headers.get('content-type'))
    console.log('body (first 800 chars):\n', text.slice(0,800))
  } catch (err) {
    console.error('error', err)
  }
})()
