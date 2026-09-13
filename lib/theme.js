// ── Sistem warna MTM: 6 tema berotasi supaya feed tidak monoton ──
const THEMES = {
  navy:   { bg:'#0A1A30', bg2:'#132A49', ink:'#FFFFFF', mute:'#9DB4D0', accent:'#38BDF8', accInk:'#04121F', panel:'#ffffff0f', line:'#ffffff26' },
  teal:   { bg:'#05302E', bg2:'#0A4B46', ink:'#FFFFFF', mute:'#95C9C3', accent:'#2DD4BF', accInk:'#03211F', panel:'#ffffff0f', line:'#ffffff26' },
  maroon: { bg:'#2A0A13', bg2:'#48131F', ink:'#FFFFFF', mute:'#D8A3AE', accent:'#FB7185', accInk:'#2A0A13', panel:'#ffffff0f', line:'#ffffff26' },
  slate:  { bg:'#14181F', bg2:'#232B36', ink:'#FFFFFF', mute:'#A7B4C4', accent:'#7DD3FC', accInk:'#0C1117', panel:'#ffffff0f', line:'#ffffff26' },
  forest: { bg:'#07241A', bg2:'#0E3C2B', ink:'#FFFFFF', mute:'#9DC9B2', accent:'#4ADE80', accInk:'#052014', panel:'#ffffff0f', line:'#ffffff26' },
  light:  { bg:'#EEF2F7', bg2:'#FFFFFF', ink:'#0A1A30', mute:'#5A6B80', accent:'#0F62FE', accInk:'#FFFFFF', panel:'#0a1a300a', line:'#0a1a3021' },
};
const ORDER = ['navy','teal','maroon','slate','forest','light'];
// tema ditentukan tanggal tayang, bukan dipilih tangan
function themeForDate(d){ const ord = Math.floor(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())/864e5)+719468; return ORDER[((Math.floor(ord/2))+1)%6]; }
module.exports = { THEMES, ORDER, themeForDate };
