module.exports = async (req, res) => {
  const json = (code, obj) => { res.statusCode = code;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.end(JSON.stringify(obj, null, 2)); };
  try {
    const url = new URL(req.url, 'http://x');
    const q = Object.fromEntries(url.searchParams.entries());

    // modul dimuat di dalam try, supaya kegagalan muat pun terbaca sebagai JSON
    const { renderPNG, selfTest } = require('../lib/render');
    if (q.debug === '1') return json(200, await selfTest());

    const { specFromQuery } = require('../lib/spec');
    const spec = specFromQuery(q);
    if (!spec.title && !(spec.blocks||[]).length)
      return json(400, { error:'Minimal isi parameter hook (atau title).' });

    let scale = parseInt(q.scale,10); if (!(scale>=1 && scale<=3)) scale = 2;
    const png = await renderPNG(spec, scale);

    res.statusCode = 200;
    res.setHeader('Content-Type','image/png');
    res.setHeader('Cache-Control','public, max-age=31536000, immutable');
    res.end(png);
  } catch (e) {
    json(500, { error: String(e && e.message || e), stack: String(e && e.stack || '').split('\n').slice(0,5) });
  }
};
