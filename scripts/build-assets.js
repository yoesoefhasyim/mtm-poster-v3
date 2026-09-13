// Build-time: font diambil dari node_modules, logo dirakit dari potongan base64.
// Kalau logo tidak utuh, BUILD DIHENTIKAN — poster cacat tidak boleh sampai tayang.
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const R=p=>fs.readFileSync(p).toString('base64');
const fp=(pkg,f)=>path.join(path.dirname(require.resolve(pkg+'/package.json')),'files',f);

const SEAL_SHA='99204a948171f9923f8e0c6bb932cf5709aab0c90b519acd71c1409dee64cfe5';
const partsDir=path.join(__dirname,'..','assets','seal');
const parts=fs.readdirSync(partsDir).filter(f=>/^part\d+\.txt$/.test(f))
  .sort((a,b)=>parseInt(a.match(/\d+/))-parseInt(b.match(/\d+/)));
if(!parts.length) throw new Error('Potongan logo tidak ditemukan di assets/seal/');
const SEAL=parts.map(f=>fs.readFileSync(path.join(partsDir,f),'utf8').trim()).join('');
const buf=Buffer.from(SEAL,'base64');
const sha=crypto.createHash('sha256').update(buf).digest('hex');
if(sha!==SEAL_SHA){
  console.error('SHA logo diharapkan:',SEAL_SHA);
  console.error('SHA logo diterima :',sha,`(${parts.length} potongan, ${buf.length} byte)`);
  throw new Error('Logo rusak saat pengiriman — build dihentikan.');
}
if(buf.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') throw new Error('Bukan berkas PNG yang sah.');
console.log('Logo terverifikasi:',buf.length,'byte,',parts.length,'potongan.');

const out='// Dibuat otomatis oleh scripts/build-assets.js — jangan disunting tangan.\nmodule.exports = {\n'+[
 ['PJS400',R(fp('@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-400-normal.woff2'))],
 ['PJS600',R(fp('@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-600-normal.woff2'))],
 ['PJS700',R(fp('@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-700-normal.woff2'))],
 ['PJS800',R(fp('@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-800-normal.woff2'))],
 ['BC800', R(fp('@fontsource/barlow-condensed','barlow-condensed-latin-800-normal.woff2'))],
 ['SEAL',  SEAL],
].map(([k,v])=>'  '+k+": '"+v+"'").join(',\n')+'\n};\n';
fs.writeFileSync(path.join(__dirname,'..','lib','embedded.js'),out);
console.log('embedded.js dibuat:',Math.round(out.length/1024)+'KB');
