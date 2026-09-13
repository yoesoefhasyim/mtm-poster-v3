const { specFromQuery } = require('../lib/spec');
const { renderPNG } = require('../lib/render');

module.exports = async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const q = Object.fromEntries(url.searchParams.entries());
    const spec = specFromQuery(q);

    if (!spec.title && !(spec.blocks||[]).length) {
      res.statusCode = 400;
      res.setHeader('Content-Type','application/json');
      return res.end(JSON.stringify({ error:'Minimal isi parameter hook (atau title).' }));
    }

    let scale = parseInt(q.scale,10); if (!(scale>=1 && scale<=3)) scale = 2;
    const png = await renderPNG(spec, scale);

    res.statusCode = 200;
    res.setHeader('Content-Type','image/png');
    res.setHeader('Cache-Control','public, max-age=31536000, immutable');
    res.end(png);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify({ error: String(e && e.message || e) }));
  }
};
