import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function getSessionCookie(email, password) {
  const res = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const setCookie = res.headers.get('set-cookie');
  const match = setCookie.match(/admin_session=([^;]+)/);
  return match ? match[1] : null;
}

async function main() {
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

  await send('Network.setCookie', {
    name: 'admin_session',
    value: adminCookie,
    domain: 'localhost',
    path: '/',
  });

  await send('Page.navigate', { url: 'http://localhost:3000/admin' });
  await new Promise(r => setTimeout(r, 3000));

  // Click tab Wilayah
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const tab = btns.find(b => b.textContent.trim() === 'Wilayah');
        if (tab) tab.click();
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1500));

  const screenshotRes = await send('Page.captureScreenshot', { format: 'png' });
  if (screenshotRes && screenshotRes.data) {
    fs.writeFileSync(path.resolve('public/images/web_admin_wilayah.png'), Buffer.from(screenshotRes.data, 'base64'));
    console.log('Saved web_admin_wilayah.png');
  }

  ws.close();
  await fetch(`http://127.0.0.1:9222/json/close/${pageTarget.id}`);
  chromeProc.kill();
}

main().catch(console.error);
