// Render tanpa browser: Satori (HTML -> SVG) + resvg (SVG -> PNG).
// satori & satori-html adalah paket ESM. require() terhadap ESM baru didukung
// Node 22.12 ke atas — di runtime Vercel bisa lebih tua dan langsung crash.
// Karena itu keduanya dimuat lewat import() dinamis yang aman di semua versi.
const { posterHTML } = require('./template');
const E = require('./embedded');

let modsPromise = null;
async function getMods(){
  if (modsPromise) return modsPromise;
  modsPromise = (async () => {
    const m = {};
    try { const s = await import('satori'); m.satori = s.default || s; }
    catch (e) { throw new Error('Gagal memuat satori: ' + e.message); }
    try { const h = await import('satori-html'); m.html = (h.html || (h.default && h.default.html)); }
    catch (e) { throw new Error('Gagal memuat satori-html: ' + e.message); }
    if (typeof m.html !== 'function') throw new Error('satori-html tidak menyediakan fungsi html()');
    // resvg versi WebAssembly: tidak ada berkas biner khusus platform,
    // jadi tidak bisa gagal karena arsitektur server berbeda.
    try {
      const r = await import('@resvg/resvg-wasm');
      await r.initWasm(E.WASM);
      m.Resvg = r.Resvg;
    } catch (e) { throw new Error('Gagal memuat @resvg/resvg-wasm: ' + e.message); }
    m.fonts = [
      { name:'PJS', data:E.PJS400, weight:400, style:'normal' },
      { name:'PJS', data:E.PJS700, weight:700, style:'normal' },
      { name:'PJS', data:E.PJS800, weight:800, style:'normal' },
      { name:'BC',  data:E.BC800,  weight:800, style:'normal' },
    ];
    return m;
  })().catch(e => { modsPromise = null; throw e; });
  return modsPromise;
}

async function renderPNG(spec, scale = 2){
  const { satori, html, Resvg, fonts } = await getMods();
  const tall = spec.ratio === '9:16';
  const W = 1080, H = tall ? 1920 : 1350;
  const svg = await satori(html(posterHTML(spec)), { width:W, height:H, fonts });
  // resvg-wasm mengembalikan Uint8Array; dijadikan Buffer agar aman dikirim sebagai respons
  return Buffer.from(new Resvg(svg, { fitTo:{ mode:'width', value: W*scale } }).render().asPng());
}

// dipakai /api/poster?debug=1 untuk melihat apa yang gagal, bukan halaman crash
async function selfTest(){
  const out = { node: process.version, ok: false };
  // laporkan kondisi berkas wasm, supaya kalau gagal langsung ketahuan sebabnya
  try {
    const fs=require('fs'), path=require('path');
    const hbDir = path.dirname(require.resolve('harfbuzzjs/index.js'));
    out.harfbuzz = {
      wasmAdaDiDisk: fs.existsSync(path.join(hbDir,'hb.wasm')),
      sudahDitambal: fs.readFileSync(path.join(hbDir,'index.js'),'utf8').includes('__WASM_DITANAM__'),
    };
  } catch (e) { out.harfbuzz = { error: e.message }; }
  try {
    const m = await getMods();
    out.satori = typeof m.satori; out.satoriHtml = typeof m.html; out.resvg = typeof m.Resvg;
    out.fontBytes = m.fonts.map(f=>f.data.length);
    out.logoBytes = Buffer.from(E.SEAL,'base64').length;
    const png = await renderPNG({ theme:'navy', ratio:'4:5', title:'Uji', blocks:[] }, 1);
    out.pngBytes = png.length; out.ok = true;
  } catch (e) { out.error = e.message; out.stack = String(e.stack||'').split('\n').slice(0,4); }
  return out;
}
module.exports = { renderPNG, selfTest };
