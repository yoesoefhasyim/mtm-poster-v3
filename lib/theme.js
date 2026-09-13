// ── Sistem warna MERU: 6 tema berotasi supaya feed tidak monoton ──
// Satori tidak mengenal color-mix(), jadi semua campuran dihitung di sini.
const hexToRgb = h => { const n=parseInt(h.slice(1),16); return [n>>16&255,n>>8&255,n&255]; };
const rgba = (h,a) => { const [r,g,b]=hexToRgb(h); return `rgba(${r},${g},${b},${a})`; };
// campur warna aksen ke atas latar, hasilkan hex padat
const mix = (fg,bg,p) => {
  const A=hexToRgb(fg), B=hexToRgb(bg);
  return '#'+[0,1,2].map(i=>Math.round(A[i]*p+B[i]*(1-p)).toString(16).padStart(2,'0')).join('');
};

const BASE = {
  navy:   { bg:'#0A1A30', bg2:'#132A49', ink:'#FFFFFF', mute:'#9DB4D0', accent:'#38BDF8', accInk:'#04121F' },
  teal:   { bg:'#05302E', bg2:'#0A4B46', ink:'#FFFFFF', mute:'#95C9C3', accent:'#2DD4BF', accInk:'#03211F' },
  maroon: { bg:'#2A0A13', bg2:'#48131F', ink:'#FFFFFF', mute:'#D8A3AE', accent:'#FB7185', accInk:'#2A0A13' },
  slate:  { bg:'#14181F', bg2:'#232B36', ink:'#FFFFFF', mute:'#A7B4C4', accent:'#7DD3FC', accInk:'#0C1117' },
  forest: { bg:'#07241A', bg2:'#0E3C2B', ink:'#FFFFFF', mute:'#9DC9B2', accent:'#4ADE80', accInk:'#052014' },
  light:  { bg:'#EEF2F7', bg2:'#FFFFFF', ink:'#0A1A30', mute:'#5A6B80', accent:'#0F62FE', accInk:'#FFFFFF' },
};

const THEMES = {};
for (const [k,t] of Object.entries(BASE)){
  const dark = k !== 'light';
  THEMES[k] = { ...t,
    panel : dark ? rgba('#FFFFFF',0.055) : rgba('#0A1A30',0.04),
    line  : dark ? rgba('#FFFFFF',0.15)  : rgba('#0A1A30',0.13),
    tagBad: dark ? rgba('#FFFFFF',0.12)  : rgba('#0A1A30',0.09),
    goodBg: mix(t.accent, t.bg, 0.11),
    goodBd: mix(t.accent, t.bg, 0.62),
    glow  : mix(t.accent, t.bg2, 0.13),
  };
}

const ORDER = ['navy','teal','maroon','slate','forest','light'];
function themeForDate(d){ const ord = Math.floor(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())/864e5)+719468; return ORDER[((Math.floor(ord/2))+1)%6]; }
module.exports = { THEMES, ORDER, themeForDate, rgba, mix };
