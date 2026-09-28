import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tmpDir = path.resolve('.chrome_pdf');

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    `--user-data-dir=${tmpDir}`,
    'about:blank'
  ]);

  let endpoint = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 500));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/version');
      if (res.ok) {
        const json = await res.json();
        endpoint = json.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  if (!endpoint) {
    console.error('Could not connect to Chrome CDP for PDF generation');
    chromeProc.kill();
    return;
  }

  const newPageRes = await fetch('http://127.0.0.1:9223/json/new?' + encodeURIComponent('about:blank'), { method: 'PUT' });
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

  await send('Page.enable');
  await send('Network.enable');

  const targetUrl = 'http://localhost:3000/user-manual-resmi.html';
  console.log('Navigating to', targetUrl);
  await send('Page.navigate', { url: targetUrl });

  // Wait 4 seconds for all images and SVG to fully load
  await new Promise(r => setTimeout(r, 4000));

  console.log('Generating PDF via Page.printToPDF...');
  const pdfRes = await send('Page.printToPDF', {
    printBackground: true,
    paperWidth: 8.27,
    paperHeight: 11.69,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    preferCSSPageSize: true,
  });

  if (pdfRes && pdfRes.data) {
    const pdfBuffer = Buffer.from(pdfRes.data, 'base64');
    fs.writeFileSync('User Manual EcoResik.pdf', pdfBuffer);
    fs.writeFileSync('public/User Manual EcoResik.pdf', pdfBuffer);
    console.log(`Successfully generated 'User Manual EcoResik.pdf' (${pdfBuffer.length} bytes)!`);
  } else {
    console.error('Failed to get PDF data');
  }

  ws.close();
  await fetch(`http://127.0.0.1:9223/json/close/${pageTarget.id}`);
  chromeProc.kill();
}

main().catch(console.error);
