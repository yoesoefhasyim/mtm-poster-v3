process.env.LOCAL_CHROMIUM='1';
const http=require('http');
const handler=require('./api/poster');
const srv=http.createServer((req,res)=>{
  if(req.url.startsWith('/api/poster')) return handler(req,res);
  res.statusCode=404; res.end('nf');
});
srv.listen(4321,async()=>{
  const fs=require('fs'); fs.mkdirSync('test-out',{recursive:true});
  const kasus={
    // 1. URL PERSIS format rutin 2-harian yang sedang berjalan
    'lama-4x5': 'pillar=Tips+Rumahan&hook=MCB+sering+turun+sendiri%3F&p1=Catat+kapan+turunnya+%E2%80%94+saat+AC+atau+pompa+menyala&p2=Hitung+alat+yang+menyala+bersamaan+di+satu+jalur&p3=Tes+tombol+ELCB+tiap+bulan+dengan+menekan+tombol+T&p4=Berhenti+dan+panggil+teknisi+kalau+tercium+bau+hangus&cta=Tanya+gratis+ke+WA+085608564240&theme=forest&ratio=4%3A5',
    'lama-9x16':'pillar=Tips+Rumahan&hook=MCB+sering+turun+sendiri%3F&p1=Catat+kapan+turunnya+%E2%80%94+saat+AC+atau+pompa+menyala&p2=Hitung+alat+yang+menyala+bersamaan+di+satu+jalur&p3=Tes+tombol+ELCB+tiap+bulan+dengan+menekan+tombol+T&p4=Berhenti+dan+panggil+teknisi+kalau+tercium+bau+hangus&cta=Tanya+gratis+ke+WA+085608564240&theme=forest&ratio=9%3A16',
    // 2. tanpa theme -> harus jatuh ke rotasi tanggal, tidak boleh kosong
    'tanpa-theme':'pillar=Mitos&hook=Arde+cuma+perlu+untuk+gedung+besar&p1=ELCB+butuh+arde+untuk+memutus+arus&p2=Rumah+kecil+sama+berisikonya&cta=Tanya+ke+WA+kami',
    // 3. judul sangat panjang -> harus mengecil sendiri
    'judul-panjang':'pillar=Uji&hook=Kenapa+panel+listrik+di+dapur+restoran+paling+sering+bermasalah+saat+jam+makan+siang&p1=Beban+puncak+menumpuk+di+satu+jalur&p2=Exhaust+hood+dan+chiller+menyala+bersamaan&cta=Konsultasi+gratis&theme=maroon',
    // 4. blok baru versus
    'blok-versus':'block=versus&pillar=Metode&hook=Dihitung%2C+*bukan+ditaksir*&ltag=DITAKSIR&rtag=CARA+MERU&l1=MCB+turun+tiap+beban+puncak&l2=RAB+gelondongan&r1=Ukuran+kabel+dari+hasil+hitungan&r2=RAB+terbuka+per+item&cta=Minta+contoh+perhitungan&theme=teal',
  };
  for(const [nama,qs] of Object.entries(kasus)){
    const t=Date.now();
    const buf=await new Promise((ok,bad)=>http.get(`http://127.0.0.1:4321/api/poster?${qs}`,r=>{
      const c=[];r.on('data',d=>c.push(d));r.on('end',()=>ok({status:r.statusCode,ct:r.headers['content-type'],body:Buffer.concat(c)}));
    }).on('error',bad));
    const f=`test-out/${nama}.png`;
    if(buf.ct==='image/png') fs.writeFileSync(f,buf.body);
    const png=buf.body.slice(0,8).toString('hex')==='89504e470d0a1a0a';
    console.log(`${nama.padEnd(14)} ${buf.status} ${buf.ct} ${(buf.body.length/1024|0)}KB ${Date.now()-t}ms ${png?'PNG valid':'✗ '+buf.body.slice(0,120)}`);
  }
  srv.close(); process.exit(0);
});
