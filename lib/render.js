// Render tanpa browser: Satori (HTML -> SVG) + resvg (SVG -> PNG).
const satori = require('satori').default || require('satori');
const { html } = require('satori-html');
const { Resvg } = require('@resvg/resvg-js');
const { posterHTML } = require('./template');
const E = require('./embedded');

let fontsPromise = null;
const getFonts = () => (fontsPromise ||= Promise.resolve([
  { name:'PJS', data:E.PJS400, weight:400, style:'normal' },
  { name:'PJS', data:E.PJS700, weight:700, style:'normal' },
  { name:'PJS', data:E.PJS800, weight:800, style:'normal' },
  { name:'BC',  data:E.BC800,  weight:800, style:'normal' },
]));

async function renderPNG(spec, scale = 2){
  const tall = spec.ratio === '9:16';
  const W = 1080, H = tall ? 1920 : 1350;
  const svg = await satori(html(posterHTML(spec)), { width:W, height:H, fonts: await getFonts() });
  const img = new Resvg(svg, { fitTo:{ mode:'width', value: W*scale } }).render();
  return img.asPng();
}
module.exports = { renderPNG };
