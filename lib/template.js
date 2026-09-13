const { THEMES } = require('./theme');
const E = require('./embedded');

const FONTS = [['PJS',400,E.PJS400],['PJS',600,E.PJS600],['PJS',700,E.PJS700],['PJS',800,E.PJS800],['BC',800,E.BC800]]
  .map(([f,w,d])=>`@font-face{font-family:${f};font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${d}) format('woff2')}`).join('');

const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const ICONS = {
  bolt:'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
  drop:'M12 3s6 6.4 6 10.5A6 6 0 0 1 6 13.5C6 9.4 12 3 12 3Z',
  wind:'M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8',
  flame:'M12 3c3 4 5 5.5 5 9a5 5 0 0 1-10 0c0-2 1-3.2 2-4.5.4 1.4 1 2 1.8 2.3C11.4 8 11 5.5 12 3Z',
  cam:'M3 8h4l1.5-2h7L17 8h4v11H3V8Zm9 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  ruler:'M3 15 15 3l6 6L9 21l-6-6Zm5-1 2 2m1-5 2 2m1-5 2 2',
  gauge:'M12 21a9 9 0 1 1 9-9M12 12l5-3',
  shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Zm-3.2 9.2 2.4 2.4 4.4-4.4',
  doc:'M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h7M9 16h7',
  search:'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm5.5 12.5L21 21',
  calc:'M6 3h12v18H6V3Zm2 4h8M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01',
  wrench:'M21 4a5 5 0 0 1-6.6 6.6L5 20l-2-2 9.4-9.4A5 5 0 0 1 19 2l-3 3 2 2 3-3Z',
  chat:'M4 5h16v11H9l-5 4V5Z',
  check:'M4 12.5 9.5 18 20 6',
  cross:'M6 6l12 12M18 6 6 18',
  clock:'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4.5V12l3.5 2.5',
  wa:'M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12Z',
  globe:'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 0c-2.8 2.9-2.8 15.1 0 18m0-18c2.8 2.9 2.8 15.1 0 18M3.4 9h17.2M3.4 15h17.2',
};
const icon = (n,size=44,w=2.6)=>`<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[n]||ICONS.bolt}"/></svg>`;

/* ═════ BLOK ═════ */
const blockFlow = (b,t)=>`<div class="flow">${b.steps.map((s,i)=>`<div class="fstep">
  <div class="fnum">${i+1}</div><div class="ficon">${icon(s.icon,40)}</div>
  <div class="flabel">${esc(s.label)}</div>${s.note?`<div class="fnote">${esc(s.note)}</div>`:''}
</div>`).join('<div class="farrow"></div>')}</div>`;

const blockVersus = (b)=>`<div class="vs">
  <div class="vcol bad"><div><span class="vtag bad">${esc(b.leftTag||'KELIRU')}</span></div>
    ${b.leftTitle?`<div class="vtitle">${esc(b.leftTitle)}</div>`:''}
    <ul>${b.left.map(x=>`<li><span class="vi bad">${icon('cross',20,3.4)}</span>${esc(x)}</li>`).join('')}</ul></div>
  <div class="vsbadge">VS</div>
  <div class="vcol good"><div><span class="vtag good">${esc(b.rightTag||'CARA MERU')}</span></div>
    ${b.rightTitle?`<div class="vtitle">${esc(b.rightTitle)}</div>`:''}
    <ul>${b.right.map(x=>`<li><span class="vi good">${icon('check',20,3.4)}</span>${esc(x)}</li>`).join('')}</ul></div>
</div>`;

const blockPoints = (b)=>`<div class="pts">${b.items.map((s,i)=>`<div class="pt">
  <div class="ptn">${String(i+1).padStart(2,'0')}</div>
  <div class="ptb"><div class="ptt">${esc(s.title)}</div>${s.desc?`<div class="ptd">${esc(s.desc)}</div>`:''}</div>
</div>`).join('')}</div>`;

const blockScope = (b)=>`<div class="scope">${b.items.map(s=>`<div class="sc">
  <div class="sci">${icon(s.icon,38)}</div><div class="sct">${esc(s.title)}</div>
  ${s.desc?`<div class="scd">${esc(s.desc)}</div>`:''}</div>`).join('')}</div>`;

const blockStats = (b)=>`<div class="stats">${b.items.map(s=>`<div class="st">
  <div class="stv">${esc(s.v)}</div><div class="stl">${esc(s.l)}</div></div>`).join('')}</div>`;

const BLOCKS = { flow:blockFlow, versus:blockVersus, points:blockPoints, scope:blockScope, stats:blockStats };

/* judul mengecil sendiri kalau teksnya panjang, supaya tidak pernah meluber */
function titleSize(html, tall){
  const n = String(html).replace(/<[^>]+>/g,'').length;
  const base = tall ? 108 : 92;
  const f = n<=16?1 : n<=26?.90 : n<=36?.79 : n<=48?.68 : n<=62?.58 : .50;
  return Math.round(base*f);
}

function poster(spec){
  const t = THEMES[spec.theme] || THEMES.navy;
  const tall = spec.ratio === '9:16';
  const W = 1080, H = tall ? 1920 : 1350;
  const body = (spec.blocks||[]).map(b=>(BLOCKS[b.type]||(()=>''))(b,t)).join('');
  const h1s = titleSize(spec.title||'', tall);
  const cvLen = String(spec.ctaValue||'').length;
  const ctaSize = cvLen>36 ? (tall?28:26) : cvLen>28 ? (tall?32:29) : (tall?36:32);
  const logo = (spec.logo === 'mark' && E.MARK)
    ? `<div class="mark"><img src="data:image/png;base64,${E.MARK}"></div>`
    : `<img class="seal" src="data:image/png;base64,${E.SEAL}">`;
  const wa = esc(spec.wa || '0856 0856 4240');

  return `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:${t.bg};--bg2:${t.bg2};--ink:${t.ink};--mute:${t.mute};--acc:${t.accent};--accInk:${t.accInk};--panel:${t.panel};--line:${t.line}}
body{width:${W}px;height:${H}px;font-family:PJS,sans-serif;color:var(--ink);
 background:radial-gradient(120% 80% at 78% -8%, var(--bg2) 0%, var(--bg) 62%);overflow:hidden}
.page{width:100%;height:100%;padding:${tall?'70px 68px 58px':'60px 62px 54px'};display:flex;flex-direction:column;position:relative}
.page::after{content:'';position:absolute;inset:0;pointer-events:none;
 background:radial-gradient(46% 30% at 100% 0%, color-mix(in srgb,var(--acc) 13%,transparent) 0%, transparent 70%)}
.mark{flex:none;height:${tall?70:64}px;background:#fff;border-radius:16px;display:grid;place-items:center;
 padding:${tall?'9px 12px':'8px 11px'};box-shadow:0 2px 14px #00000026}
.mark img{height:${tall?52:48}px;width:auto;display:block}
.seal{flex:none;height:${tall?84:78}px;width:${tall?84:78}px;display:block}
.hd{display:flex;align-items:center;gap:20px;padding-bottom:${tall?26:22}px;border-bottom:2px solid var(--line)}
.hdn{font-weight:800;font-size:30px;letter-spacing:.14em}
.hds{font-size:17px;color:var(--mute);letter-spacing:.15em;font-weight:600;margin-top:3px}
.hdtag{margin-left:auto;background:var(--acc);color:var(--accInk);font-weight:800;font-size:${tall?22:20}px;
 letter-spacing:.1em;padding:11px 22px;border-radius:999px;text-transform:uppercase}
.eyebrow{margin-top:${tall?38:30}px;display:flex;align-items:center;gap:14px;color:var(--acc);
 font-weight:800;font-size:${tall?26:24}px;letter-spacing:.2em;text-transform:uppercase}
.eyebrow::before{content:'';width:42px;height:4px;background:var(--acc);border-radius:2px}
h1{font-family:BC,PJS,sans-serif;font-weight:800;font-size:${h1s}px;line-height:.94;letter-spacing:-.01em;
 margin-top:${tall?20:16}px;text-transform:uppercase}
h1 em{font-style:normal;color:var(--acc)}
.sub{margin-top:${tall?24:18}px;font-size:${tall?31:28}px;line-height:1.42;color:var(--mute);max-width:${tall?880:900}px}
.body{flex:1;display:flex;flex-direction:column;justify-content:stretch;gap:${tall?30:22}px;padding:${tall?'40px 0':'30px 0'}}
.flow{flex:1;display:flex;align-items:stretch;padding:8px 0;gap:${tall?10:8}px}
.fstep{flex:1;justify-content:flex-start;background:var(--panel);border:2px solid var(--line);border-radius:22px;
 padding:${tall?'26px 14px':'22px 12px'};text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
.fnum{width:38px;height:38px;border-radius:50%;background:var(--acc);color:var(--accInk);font-weight:800;font-size:21px;display:grid;place-items:center}
.ficon{color:var(--acc)}
.flabel{font-weight:800;font-size:${tall?23:21}px;line-height:1.18;text-transform:uppercase}
.fnote{font-size:${tall?18:17}px;color:var(--mute);line-height:1.3}
.farrow{align-self:center;width:16px;height:3px;background:var(--line);border-radius:2px;flex:none}
.vs{flex:1;display:flex;align-items:stretch;gap:${tall?22:18}px;position:relative}
.vcol{flex:1;display:flex;flex-direction:column;justify-content:center;border-radius:26px;
 padding:${tall?'34px 30px':'28px 26px'};border:2px solid var(--line);background:var(--panel)}
.vcol.good{border-color:color-mix(in srgb,var(--acc) 62%,transparent);background:color-mix(in srgb,var(--acc) 11%,transparent)}
.vtag{font-weight:800;font-size:${tall?20:19}px;letter-spacing:.14em;padding:8px 16px;border-radius:999px;display:inline-block}
.vtag.bad{background:#ffffff1f;color:var(--mute)}
.vtag.good{background:var(--acc);color:var(--accInk)}
.vtitle{font-weight:800;font-size:${tall?34:31}px;margin-top:16px;line-height:1.15}
.vcol ul{list-style:none;margin-top:18px;display:flex;flex-direction:column;gap:${tall?15:13}px}
.vcol li{display:flex;gap:13px;align-items:flex-start;font-size:${tall?25:23}px;line-height:1.34}
.vi{flex:none;width:32px;height:32px;border-radius:9px;display:grid;place-items:center;margin-top:1px}
.vi.bad{background:#ffffff1a;color:var(--mute)}
.vi.good{background:var(--acc);color:var(--accInk)}
.vsbadge{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2;width:${tall?76:68}px;height:${tall?76:68}px;
 border-radius:50%;background:var(--bg);border:3px solid var(--acc);color:var(--acc);font-weight:800;font-size:${tall?26:24}px;display:grid;place-items:center}
.pts{flex:1;justify-content:center;display:flex;flex-direction:column;gap:${tall?20:16}px}
.pt{flex:1 1 auto;max-height:${tall?210:172}px}
.pt{display:flex;gap:${tall?26:22}px;align-items:center;background:var(--panel);
 border:2px solid var(--line);border-left:6px solid var(--acc);border-radius:20px;padding:${tall?'28px 30px':'24px 26px'}}
.ptn{font-family:BC,PJS;font-weight:800;font-size:${tall?60:54}px;color:var(--acc);line-height:.85;flex:none;min-width:${tall?76:68}px}
.ptt{font-weight:800;font-size:${tall?33:30}px;line-height:1.2}
.ptd{font-size:${tall?25:23}px;color:var(--mute);line-height:1.4;margin-top:7px}
.scope{flex:1;align-content:center;display:grid;grid-template-columns:repeat(3,1fr);gap:${tall?18:15}px}
.sc{background:var(--panel);border:2px solid var(--line);border-radius:22px;padding:${tall?'28px 22px':'24px 20px'}}
.sci{color:var(--acc);margin-bottom:14px}
.sct{font-weight:800;font-size:${tall?27:25}px;line-height:1.15}
.scd{font-size:${tall?21:20}px;color:var(--mute);line-height:1.33;margin-top:8px}
.stats{flex:none;display:flex;gap:${tall?16:14}px}
.st{flex:1;background:var(--panel);border:2px solid var(--line);border-radius:20px;padding:${tall?'26px 20px':'22px 18px'};text-align:center}
.stv{font-family:BC,PJS;font-weight:800;font-size:${tall?66:58}px;color:var(--acc);line-height:1}
.stl{font-size:${tall?21:20}px;color:var(--mute);margin-top:8px;line-height:1.25}
.ft{flex:none;border-top:2px solid var(--line);padding-top:${tall?26:22}px;display:flex;align-items:center;gap:18px}
.cta{flex:1;min-width:0}
.ctal{font-size:${tall?24:22}px;color:var(--mute);font-weight:600}
.ctav{font-weight:800;font-size:${ctaSize}px;margin-top:5px;line-height:1.12}
.wa{display:flex;align-items:center;gap:14px;background:var(--acc);color:var(--accInk);border-radius:999px;
 padding:${tall?'18px 30px':'16px 26px'};font-weight:800;font-size:${tall?34:31}px;white-space:nowrap}
.web{flex:none;margin-top:${tall?16:13}px;font-size:${tall?23:21}px;color:var(--mute);font-weight:600;
 width:100%;display:flex;align-items:center;justify-content:center;gap:10px}
.web svg{flex:none;opacity:.9}
</style></head><body><div class="page">
 <div class="hd">${logo}
  <div><div class="hdn">MERU TEKNIK MANDIRI</div><div class="hds">MECHANICAL · ELECTRICAL · PLUMBING</div></div>
  ${spec.tag?`<div class="hdtag">${esc(spec.tag)}</div>`:''}</div>
 ${spec.eyebrow?`<div class="eyebrow">${esc(spec.eyebrow)}</div>`:''}
 <h1>${spec.title||''}</h1>
 ${spec.sub?`<div class="sub">${esc(spec.sub)}</div>`:''}
 <div class="body">${body}</div>
 <div class="ft"><div class="cta">
   ${spec.ctaLabel?`<div class="ctal">${esc(spec.ctaLabel)}</div>`:''}
   <div class="ctav">${esc(spec.ctaValue||'Konsultasi teknis, gratis')}</div></div>
  <div class="wa">${icon('wa',34,2.8)} ${wa}</div></div>
 <div class="web">${icon('globe',tall?26:24,2.2)}<span>meruteknikmandiri.co.id</span></div>
</div></body></html>`;
}
module.exports = { poster, titleSize };
