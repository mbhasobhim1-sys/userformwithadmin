(async () => {
  console.log('===== LOGIN REDIRECT TEST =====\n');
  const base = 'http://localhost:3000';
  
  async function testLogin(email, password, expectedRole) {
    console.log(`\nTesting ${expectedRole} login: ${email}`);
    const jar = {};

    function saveCookies(r) {
      const h = r.headers.get('set-cookie');
      if (!h) return;
      h.split(/,\s*(?=[^,]+=)/).forEach(c => {
        const [p] = c.split(';');
        const [k, v] = p.split('=');
        jar[k.trim()] = v;
      });
    }

    function cookies() {
      return Object.entries(jar).map(([k, v]) => k + '=' + v).join('; ');
    }

    try {
      // Get CSRF token
      const r1 = await fetch(base + '/api/auth/csrf');
      saveCookies(r1);
      const b = await r1.json();

      // Sign in
      const form = new URLSearchParams({
        csrfToken: b.csrfToken,
        email: email,
        password: password,
        callbackUrl: base + '/',
        json: 'true'
      });
      const r2 = await fetch(base + '/api/auth/callback/credentials', {
        method: 'POST',
        body: form,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'cookie': cookies() },
        redirect: 'manual'
      });
      saveCookies(r2);
      const redirectLocation = r2.headers.get('location');
      console.log(`  📍 Redirect to: ${redirectLocation}`);

      // Check the page content to verify role
      const r3 = await fetch(redirectLocation, { headers: { cookie: cookies() } });
      const html = await r3.text();

      if (expectedRole === 'admin') {
        const isAdmin = html.includes('Admin Dashboard') || html.includes('User Submissions');
        const isDashboard = redirectLocation.includes('/admin');
        if (isAdmin && isDashboard) {
          console.log(`  ✅ CORRECT: Redirected to /admin with admin role`);
          return true;
        } else {
          console.log(`  ❌ ERROR: Expected /admin, got ${redirectLocation}`);
          console.log(`  Admin Dashboard found: ${html.includes('Admin Dashboard')}`);
          return false;
        }
      } else {
        const isUser = html.includes('Checklists') || html.includes('inspection forms');
        const isHome = redirectLocation.includes('/') && !redirectLocation.includes('/admin');
        if (isUser && isHome) {
          console.log(`  ✅ CORRECT: Redirected to / with user role`);
          return true;
        } else {
          console.log(`  ❌ ERROR: Expected /, got ${redirectLocation}`);
          return false;
        }
      }
    } catch (e) {
      console.error(`  ❌ Error: ${e.message}`);
      return false;
    }
  }

  try {
    const adminPass = await testLogin('admin@ringomode.co.za', 'Admin@123', 'admin');
    const userPass = await testLogin('user1@ringomode.co.za', 'User@123', 'user');

    console.log('\n===== RESULTS =====');
    if (adminPass && userPass) {
      console.log('✅ ALL TESTS PASSED - Role-based redirects working correctly!');
    } else {
      console.log('❌ Some tests failed - check output above');
    }
  } catch (e) {
    console.error('Fatal error:', e.message);
  }
})();
