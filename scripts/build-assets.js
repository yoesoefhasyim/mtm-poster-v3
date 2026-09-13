// Build-time:
//  - font woff2 dari node_modules dibuka jadi TTF (Satori tidak mendukung woff2)
//  - logo dirakit dari potongan base64; kalau tidak utuh, BUILD DIHENTIKAN
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const { decompress } = require('wawoff2');
const root = path.join(__dirname,'..');
const fp=(pkg,f)=>path.join(path.dirname(require.resolve(pkg+'/package.json')),'files',f);

const SEAL_SHA='99204a948171f9923f8e0c6bb932cf5709aab0c90b519acd71c1409dee64cfe5';

(async () => {
  const partsDir=path.join(root,'assets','seal');
  const parts=fs.readdirSync(partsDir).filter(f=>/^part\d+\.txt$/.test(f))
    .sort((a,b)=>parseInt(a.match(/\d+/))-parseInt(b.match(/\d+/)));
  if(!parts.length) throw new Error('Potongan logo tidak ditemukan di assets/seal/');
  const SEAL=parts.map(f=>fs.readFileSync(path.join(partsDir,f),'utf8').trim()).join('');
  const buf=Buffer.from(SEAL,'base64');
  const sha=crypto.createHash('sha256').update(buf).digest('hex');
  if(sha!==SEAL_SHA){
    console.error('SHA diharapkan:',SEAL_SHA,'\nSHA diterima :',sha,`(${parts.length} potongan, ${buf.length} byte)`);
    throw new Error('Logo rusak saat pengiriman — build dihentikan.');
  }
  if(buf.subarray(0,8).toString('hex')!=='89504e470d0a1a0a') throw new Error('Bukan berkas PNG yang sah.');
  console.log('Logo terverifikasi:',buf.length,'byte,',parts.length,'potongan.');

  const FONTS=[
    ['PJS400','@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-400-normal.woff2'],
    ['PJS700','@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-700-normal.woff2'],
    ['PJS800','@fontsource/plus-jakarta-sans','plus-jakarta-sans-latin-800-normal.woff2'],
    ['BC800', '@fontsource/barlow-condensed','barlow-condensed-latin-800-normal.woff2'],
  ];
  const out=[];
  for(const [key,pkg,file] of FONTS){
    const ttf=Buffer.from(await decompress(fs.readFileSync(fp(pkg,file))));
    if(ttf.subarray(0,4).toString('hex')!=='00010000') throw new Error('Gagal membuka font '+key);
    out.push(`  ${key}: B('${ttf.toString('base64')}')`);
    console.log('Font',key,'->',Math.round(ttf.length/1024)+'KB TTF');
  }
  const js='// Dibuat otomatis oleh scripts/build-assets.js — jangan disunting tangan.\n'+
    "const B=s=>Buffer.from(s,'base64');\nmodule.exports={\n"+
    `  SEAL: '${SEAL}',\n`+out.join(',\n')+'\n};\n';
  fs.writeFileSync(path.join(root,'lib','embedded.js'),js);
  console.log('embedded.js dibuat:',Math.round(js.length/1024)+'KB');
})().catch(e=>{ console.error(e.message); process.exit(1); });
