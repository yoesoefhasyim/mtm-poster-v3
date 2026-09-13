const { THEMES } = require('./theme');
const E = require('./embedded');

const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const S = o => Object.entries(o).filter(([,v])=>v!==undefined&&v!=='')
  .map(([k,v])=>k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())+':'+v).join(';');
const px = n => n+'px';

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
  clock:'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 4.5V12l3.5 2.5',
  check:'M4 12.5 9.5 18 20 6',
  cross:'M6 6l12 12M18 6 6 18',
  wa:'M20 12a8 8 0 0 1-11.8 7L4 20l1.1-4A8 8 0 1 1 20 12Z',
  globe:'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 0c-2.8 2.9-2.8 15.1 0 18m0-18c2.8 2.9 2.8 15.1 0 18M3.4 9h17.2M3.4 15h17.2',
};
const icon = (n,size,color,w=2.6)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[n]||ICONS.bolt}"/></svg>`;

/* Judul: dipecah per baris, tiap potongan *begini* diberi warna aksen.
   Satori tidak menangani teks sebaris bercampur warna, jadi tiap potongan jadi elemen sendiri. */
function titleBlock(raw, size, t){
  const lines = String(raw||'').split(/<br\s*\/?>|\n/);
  return lines.map(line=>{
    const segs = String(line).split(/(\*[^*]+\*)/).filter(Boolean);
    const inner = segs.map(sg=>{
      const on = sg.startsWith('*') && sg.endsWith('*');
      const raw = on ? sg.slice(1,-1) : sg;
      // spasi di batas potongan hilang kalau tiap potongan jadi elemen sendiri -> ganti jadi margin
      const ml = /^\s/.test(raw) ? '0.26em' : undefined;
      const mr = /\s$/.test(raw) ? '0.26em' : undefined;
      const txt = raw.trim();
      if (!txt) return '';
      return `<div style="${S({display:'flex',color:on?t.accent:t.ink,marginLeft:ml,marginRight:mr})}">${esc(txt)}</div>`;
    }).join('');
    return `<div style="${S({display:'flex',flexDirection:'row'})}">${inner}</div>`;
  }).join('');
}
function titleSize(html, tall){
  const n = String(html).replace(/<[^>]+>/g,'').replace(/\*/g,'').length;
  const base = tall ? 108 : 92;
  const f = n<=16?1 : n<=26?.90 : n<=36?.79 : n<=48?.68 : n<=62?.58 : .50;
  return Math.round(base*f);
}

/* ═════ BLOK ═════ */
function blockPoints(b,t,z){
  return `<div style="${S({display:'flex',flexDirection:'column',flex:'1',justifyContent:'center',gap:px(z.gap)})}">
  ${b.items.map((s,i)=>`<div style="${S({display:'flex',flexDirection:'row',alignItems:'center',gap:px(z.tall?26:22),
      background:t.panel,border:`2px solid ${t.line}`,borderLeft:`6px solid ${t.accent}`,borderRadius:'20px',
      padding:z.tall?'26px 30px':'22px 26px',flexGrow:'1',maxHeight:px(z.tall?205:168)})}">
    <div style="${S({display:'flex',fontFamily:'BC',fontSize:px(z.tall?60:54),color:t.accent,lineHeight:'1',width:px(z.tall?76:68),flexShrink:'0'})}">${String(i+1).padStart(2,'0')}</div>
    <div style="${S({display:'flex',flexDirection:'column',flex:'1'})}">
      <div style="${S({display:'flex',fontWeight:'800',fontSize:px(z.tall?33:30),color:t.ink,lineHeight:'1.2'})}">${esc(s.title)}</div>
      ${s.desc?`<div style="${S({display:'flex',fontSize:px(z.tall?25:23),color:t.mute,lineHeight:'1.4',marginTop:'7px'})}">${esc(s.desc)}</div>`:''}
    </div></div>`).join('')}</div>`;
}

function blockVersus(b,t,z){
  const col=(items,good,tag,title)=>`<div style="${S({display:'flex',flexDirection:'column',flex:'1',justifyContent:'center',
     borderRadius:'26px',padding:z.tall?'34px 30px':'28px 26px',
     border:`2px solid ${good?t.goodBd:t.line}`,background:good?t.goodBg:t.panel})}">
   <div style="${S({display:'flex',flexDirection:'row'})}"><div style="${S({display:'flex',fontWeight:'800',fontSize:px(z.tall?20:19),
     letterSpacing:'2px',padding:'8px 16px',borderRadius:'999px',
     background:good?t.accent:t.tagBad,color:good?t.accInk:t.mute})}">${esc(tag)}</div></div>
   ${title?`<div style="${S({display:'flex',fontWeight:'800',fontSize:px(z.tall?34:31),color:t.ink,marginTop:'16px',lineHeight:'1.15'})}">${esc(title)}</div>`:''}
   <div style="${S({display:'flex',flexDirection:'column',marginTop:'18px',gap:px(z.tall?15:13)})}">
     ${items.map(x=>`<div style="${S({display:'flex',flexDirection:'row',alignItems:'flex-start',gap:'13px'})}">
       <div style="${S({display:'flex',width:'32px',height:'32px',borderRadius:'9px',alignItems:'center',justifyContent:'center',flexShrink:'0',
         background:good?t.accent:t.tagBad})}">${icon(good?'check':'cross',18,good?t.accInk:t.mute,3.4)}</div>
       <div style="${S({display:'flex',flex:'1',fontSize:px(z.tall?25:23),color:t.ink,lineHeight:'1.34'})}">${esc(x)}</div>
     </div>`).join('')}</div></div>`;
  return `<div style="${S({display:'flex',flexDirection:'row',flex:'1',gap:px(z.tall?22:18),position:'relative'})}">
    ${col(b.left||[],false,b.leftTag||'KELIRU',b.leftTitle)}
    ${col(b.right||[],true,b.rightTag||'CARA MERU',b.rightTitle)}
    <div style="${S({display:'flex',position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',
      width:px(z.tall?76:68),height:px(z.tall?76:68),borderRadius:'999px',background:t.bg,border:`3px solid ${t.accent}`,
      alignItems:'center',justifyContent:'center',color:t.accent,fontWeight:'800',fontSize:px(z.tall?26:24)})}">VS</div>
  </div>`;
}

function blockScope(b,t,z){
  return `<div style="${S({display:'flex',flexDirection:'row',flexWrap:'wrap',flex:'1',alignContent:'center',gap:px(z.tall?18:15)})}">
   ${b.items.map(s=>`<div style="${S({display:'flex',flexDirection:'column',width:'32%',background:t.panel,
     border:`2px solid ${t.line}`,borderRadius:'22px',padding:z.tall?'26px 22px':'22px 20px'})}">
     <div style="${S({display:'flex',marginBottom:'12px'})}">${icon(s.icon,z.tall?38:34,t.accent)}</div>
     <div style="${S({display:'flex',fontWeight:'800',fontSize:px(z.tall?27:25),color:t.ink,lineHeight:'1.15'})}">${esc(s.title)}</div>
     ${s.desc?`<div style="${S({display:'flex',fontSize:px(z.tall?21:20),color:t.mute,lineHeight:'1.33',marginTop:'8px'})}">${esc(s.desc)}</div>`:''}
   </div>`).join('')}</div>`;
}

function blockFlow(b,t,z){
  return `<div style="${S({display:'flex',flexDirection:'row',flex:'1',alignItems:'stretch',gap:px(z.tall?10:8)})}">
   ${b.steps.map((s,i)=>`<div style="${S({display:'flex',flexDirection:'column',flex:'1',alignItems:'center',gap:'10px',
     background:t.panel,border:`2px solid ${t.line}`,borderRadius:'22px',padding:z.tall?'26px 12px':'22px 10px'})}">
     <div style="${S({display:'flex',width:'38px',height:'38px',borderRadius:'999px',background:t.accent,color:t.accInk,
       alignItems:'center',justifyContent:'center',fontWeight:'800',fontSize:'21px'})}">${i+1}</div>
     <div style="${S({display:'flex'})}">${icon(s.icon,36,t.accent)}</div>
     <div style="${S({display:'flex',fontWeight:'800',fontSize:px(z.tall?22:20),color:t.ink,textAlign:'center',lineHeight:'1.18'})}">${esc(s.label)}</div>
     ${s.note?`<div style="${S({display:'flex',fontSize:px(z.tall?18:17),color:t.mute,textAlign:'center',lineHeight:'1.3'})}">${esc(s.note)}</div>`:''}
   </div>`).join('')}</div>`;
}

function blockStats(b,t,z){
  return `<div style="${S({display:'flex',flexDirection:'row',gap:px(z.tall?16:14),flexShrink:'0'})}">
   ${b.items.map(s=>`<div style="${S({display:'flex',flexDirection:'column',flex:'1',alignItems:'center',
     background:t.panel,border:`2px solid ${t.line}`,borderRadius:'20px',padding:z.tall?'24px 18px':'20px 16px'})}">
     <div style="${S({display:'flex',fontFamily:'BC',fontSize:px(z.tall?66:58),color:t.accent,lineHeight:'1'})}">${esc(s.v)}</div>
     <div style="${S({display:'flex',fontSize:px(z.tall?21:20),color:t.mute,marginTop:'8px',textAlign:'center',lineHeight:'1.25'})}">${esc(s.l)}</div>
   </div>`).join('')}</div>`;
}

const BLOCKS={points:blockPoints,versus:blockVersus,scope:blockScope,flow:blockFlow,stats:blockStats};

/* ═════ HALAMAN ═════ */
function posterHTML(spec){
  const t = THEMES[spec.theme] || THEMES.navy;
  const tall = spec.ratio === '9:16';
  const W=1080, H= tall?1920:1350;
  const z = { tall, gap: tall?20:16 };
  const h1s = titleSize(spec.title||'', tall);
  const cvLen = String(spec.ctaValue||'').length;
  const ctaSize = cvLen>36 ? (tall?28:26) : cvLen>28 ? (tall?32:29) : (tall?36:32);
  const wa = esc(spec.wa || '0856 0856 4240');
  const body = (spec.blocks||[]).map(b=>(BLOCKS[b.type]||(()=>''))(b,t,z)).join('');

  return `<div style="${S({display:'flex',flexDirection:'column',width:px(W),height:px(H),
    backgroundColor:t.bg,backgroundImage:`radial-gradient(120% 80% at 78% -10%, ${t.glow} 0%, ${t.bg} 62%)`,
    padding: tall?'70px 68px 58px':'58px 62px 52px',fontFamily:'PJS',color:t.ink})}">

  <div style="${S({display:'flex',flexDirection:'row',alignItems:'center',gap:'20px',paddingBottom:px(tall?26:22),borderBottom:`2px solid ${t.line}`})}">
    <img src="data:image/png;base64,${E.SEAL}" style="${S({display:'flex',flexShrink:'0',width:px(tall?84:78),height:px(tall?84:78)})}"/>
    <div style="${S({display:'flex',flexDirection:'column'})}">
      <div style="${S({display:'flex',fontWeight:'800',fontSize:'30px',letterSpacing:'4px',color:t.ink})}">MERU TEKNIK MANDIRI</div>
      <div style="${S({display:'flex',fontSize:'17px',fontWeight:'700',letterSpacing:'2.5px',color:t.mute,marginTop:'4px'})}">MECHANICAL · ELECTRICAL · PLUMBING</div>
    </div>
    ${spec.tag?`<div style="${S({display:'flex',marginLeft:'auto',background:t.accent,color:t.accInk,fontWeight:'800',
      fontSize:px(tall?22:20),letterSpacing:'2px',padding:'11px 22px',borderRadius:'999px',textTransform:'uppercase'})}">${esc(spec.tag)}</div>`:''}
  </div>

  ${spec.eyebrow?`<div style="${S({display:'flex',flexDirection:'row',alignItems:'center',gap:'14px',marginTop:px(tall?36:28)})}">
    <div style="${S({display:'flex',width:'42px',height:'4px',borderRadius:'2px',background:t.accent})}"></div>
    <div style="${S({display:'flex',color:t.accent,fontWeight:'800',fontSize:px(tall?26:24),letterSpacing:'4px',textTransform:'uppercase'})}">${esc(spec.eyebrow)}</div>
  </div>`:''}

  <div style="${S({display:'flex',flexDirection:'column',fontFamily:'BC',fontSize:px(h1s),lineHeight:'0.98',
    textTransform:'uppercase',marginTop:px(spec.eyebrow?(tall?18:14):(tall?34:26))})}">${titleBlock(spec.title,h1s,t)}</div>

  ${spec.sub?`<div style="${S({display:'flex',marginTop:px(tall?24:18),fontSize:px(tall?31:28),lineHeight:'1.42',color:t.mute,maxWidth:'900px'})}">${esc(spec.sub)}</div>`:''}

  <div style="${S({display:'flex',flexDirection:'column',flex:'1',gap:px(tall?28:22),padding: tall?'38px 0':'28px 0'})}">${body}</div>

  <div style="${S({display:'flex',flexDirection:'row',alignItems:'center',gap:'18px',borderTop:`2px solid ${t.line}`,paddingTop:px(tall?26:22),flexShrink:'0'})}">
    <div style="${S({display:'flex',flexDirection:'column',flex:'1'})}">
      ${spec.ctaLabel?`<div style="${S({display:'flex',fontSize:px(tall?24:22),color:t.mute,fontWeight:'700'})}">${esc(spec.ctaLabel)}</div>`:''}
      <div style="${S({display:'flex',fontWeight:'800',fontSize:px(ctaSize),color:t.ink,marginTop:'5px',lineHeight:'1.12'})}">${esc(spec.ctaValue||'Konsultasi teknis, gratis')}</div>
    </div>
    <div style="${S({display:'flex',flexDirection:'row',alignItems:'center',gap:'14px',background:t.accent,color:t.accInk,
      borderRadius:'999px',padding: tall?'18px 30px':'16px 26px',fontWeight:'800',fontSize:px(tall?34:31),flexShrink:'0'})}">
      ${icon('wa',32,t.accInk,2.8)}<div style="${S({display:'flex'})}">${wa}</div></div>
  </div>

  <div style="${S({display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:'10px',marginTop:px(tall?16:13),flexShrink:'0'})}">
    ${icon('globe',tall?26:24,t.mute,2.2)}
    <div style="${S({display:'flex',fontSize:px(tall?23:21),color:t.mute,fontWeight:'700'})}">meruteknikmandiri.co.id</div>
  </div>
</div>`;
}
module.exports = { posterHTML, titleSize };
