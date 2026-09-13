const { poster } = require('./template');

let browserPromise = null;

async function getBrowser(){
  if (browserPromise) return browserPromise;
  browserPromise = (async () => {
    if (process.env.LOCAL_CHROMIUM) {
      // jalur pengujian lokal
      const { chromium } = require('playwright');
      return { type:'pw', b: await chromium.launch() };
    }
    // jalur produksi Vercel
    const chromium = require('@sparticuz/chromium');
    const puppeteer = require('puppeteer-core');
    return { type:'pptr', b: await puppeteer.launch({
      args: chromium.args, defaultViewport: null,
      executablePath: await chromium.executablePath(),
      headless: true,
    })};
  })();
  return browserPromise;
}

async function renderPNG(spec, scale = 2){
  const tall = spec.ratio === '9:16';
  const viewport = { width:1080, height: tall?1920:1350 };
  const { type, b } = await getBrowser();
  const page = type === 'pw'
    ? await b.newPage({ viewport, deviceScaleFactor: scale })
    : await b.newPage();
  try {
    if (type === 'pptr') await page.setViewport({ ...viewport, deviceScaleFactor: scale });
    await page.setContent(poster(spec), { waitUntil: type==='pw' ? 'networkidle' : 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    return await page.screenshot({ type:'png' });
  } finally { await page.close(); }
}
module.exports = { renderPNG };
