const { THEMES, themeForDate } = require('./theme');

const pick = (q,k)=> { const v=q[k]; return Array.isArray(v)?v[0]:v; };
const many = (q,pre,max=6)=>{ const o=[]; for(let i=1;i<=max;i++){const v=pick(q,pre+i); if(v!=null&&String(v).trim()!=='') o.push(String(v).trim());} return o; };

// "Judul — keterangan" atau "Judul: keterangan" dipecah jadi dua baris
function split(line){
  const m = String(line).match(/^(.{3,48}?)\s*(?:—|--|::|\|)\s*(.+)$/);
  if (m) return { title:m[1].trim(), desc:m[2].trim() };
  return { title:String(line).trim() };
}
// *teks* -> disorot warna aksen; aman untuk URL lama karena tidak pernah memakai tanda bintang
function emph(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*([^*]+)\*/g,'<em>$1</em>')
    .replace(/\n|\\n/g,'<br>');
}

// CTA lama sering memuat nomor WA, padahal tombolnya sudah menampilkan nomor itu
function trimWa(v){
  if (!v) return v;
  let s = String(v)
    .replace(/\s*(ke\s*)?(wa|whatsapp|telp|telepon|hp)?\s*[:\-]?\s*(\+?62|0)\s?8[0-9\s\-.]{7,}$/i,'')
    .replace(/[\s,.\-–—:]+$/,'').trim();
  return s.length >= 5 ? s : String(v).trim();
}

function specFromQuery(q){
  const g = k => pick(q,k);
  const ratio = (g('ratio')==='9:16' || g('ratio')==='9x16') ? '9:16' : '4:5';
  let theme = String(g('theme')||'').toLowerCase();
  if (!THEMES[theme]) theme = themeForDate(new Date());   // tidak pernah kosong

  const spec = {
    theme, ratio,
    logo: g('logo')==='mark' ? 'mark' : 'seal',
    tag: g('tag') || g('pillar') || '',
    eyebrow: g('eyebrow') || '',
    title: emph(g('title') || g('hook') || ''),
    sub: g('sub') || '',
    ctaLabel: g('ctaLabel') || g('ctalabel') || '',
    ctaValue: trimWa(g('cta') || g('ctaValue') || ''),
    wa: g('wa') || '',
    blocks: [],
  };

  const block = String(g('block')||'').toLowerCase();

  if (block === 'versus'){
    const left = many(q,'l',5), right = many(q,'r',5);
    if (left.length || right.length) spec.blocks.push({ type:'versus', left, right,
      leftTag:g('ltag')||undefined, rightTag:g('rtag')||undefined,
      leftTitle:g('ltitle')||undefined, rightTitle:g('rtitle')||undefined });
  } else if (block === 'flow'){
    const steps = many(q,'s',6).map(v=>{ const [label,note,icon]=v.split('|'); return {label:(label||'').trim(),note:(note||'').trim()||undefined,icon:(icon||'wrench').trim()}; });
    if (steps.length) spec.blocks.push({ type:'flow', steps });
  } else if (block === 'scope'){
    const items = many(q,'c',6).map(v=>{ const [title,desc,icon]=v.split('|'); return {title:(title||'').trim(),desc:(desc||'').trim()||undefined,icon:(icon||'bolt').trim()}; });
    if (items.length) spec.blocks.push({ type:'scope', items });
  }

  // p1..p6 selalu didukung — inilah format yang dipakai rutin 2-harian sekarang
  const pts = many(q,'p',6).map(split);
  if (pts.length) spec.blocks.push({ type:'points', items:pts });

  const stats = many(q,'st',3).map(v=>{ const [val,lab]=v.split('|'); return {v:(val||'').trim(),l:(lab||'').trim()}; }).filter(s=>s.v);
  if (stats.length) spec.blocks.push({ type:'stats', items:stats });

  return spec;
}
module.exports = { specFromQuery };
