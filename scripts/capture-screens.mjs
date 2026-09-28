import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function getSessionCookie(email, password) {
  const res = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!res.ok) {
    console.error(`Login failed for ${email}`);
    return null;
  }

  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return null;
  const match = setCookie.match(/admin_session=([^;]+)/);
  return match ? match[1] : null;
}

async function main() {
  const citizenCookie = await getSessionCookie('budi@gmail.com', 'warga123');
  const adminCookie = await getSessionCookie('admin@ecoresik.com', 'admin123');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tmpDir = path.resolve('.chrome_cdp');
  
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tmpDir}`,
    '--window-size=1280,950',
    'about:blank'
  ]);

  let endpoint = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/version');
      if (res.ok) {
        const json = await res.json();
        endpoint = json.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!endpoint) {
    console.error('Could not connect to Chrome CDP');
    chromeProc.kill();
    return;
  }

  async function openCDP(url, cookieValue) {
    const newPageRes = await fetch('http://127.0.0.1:9222/json/new?' + encodeURIComponent('about:blank'), { method: 'PUT' });
    const pageTarget = await newPageRes.json();
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    });

    if (cookieValue) {
      await send('Network.setCookie', {
        name: 'admin_session',
        value: cookieValue,
        domain: 'localhost',
        path: '/',
      });
    }

    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 3500));

    async function shoot(outputPath) {
      const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
      if (screenshotRes && screenshotRes.data) {
        fs.writeFileSync(outputPath, Buffer.from(screenshotRes.data, 'base64'));
        console.log(`Saved: ${outputPath}`);
      }
    }

    async function evaluate(expression) {
      return await send('Runtime.evaluate', { expression });
    }

    async function close() {
      ws.close();
      await fetch(`http://127.0.0.1:9222/json/close/${pageTarget.id}`);
    }

    return { shoot, evaluate, close };
  }

  try {
    // Admin tabs
    if (adminCookie) {
      const adminPage = await openCDP('http://localhost:3000/admin', adminCookie);
      await adminPage.shoot(path.resolve('public/images/web_admin_laporan.png'));

      // Click "Jenis Sampah" tab
      await adminPage.evaluate(`
        const btns = Array.from(document.querySelectorAll('button'));
        const tab = btns.find(b => b.textContent.includes('Jenis Sampah'));
        if (tab) tab.click();
      `);
      await new Promise(r => setTimeout(r, 1000));
      await adminPage.shoot(path.resolve('public/images/web_admin_jenis.png'));

      // Click "Wilayah" tab
      await adminPage.evaluate(`
        const btns = Array.from(document.querySelectorAll('button'));
        const tab = btns.find(b => b.textContent.includes('Wilayah'));
        if (tab) tab.click();
      `);
      await new Promise(r => setTimeout(r, 1000));
      await adminPage.shoot(path.resolve('public/images/web_admin_wilayah.png'));

      await adminPage.close();
    }
  } finally {
    chromeProc.kill();
  }
}

main().catch(console.error);
