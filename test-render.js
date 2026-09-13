const fs=require('fs');
const { renderPNG } = require('./lib/render');
const { specFromQuery } = require('./lib/spec');
const kasus = {
 'lama-4x5':{pillar:'Tips Rumahan',hook:'MCB sering turun sendiri?',p1:'Catat kapan turunnya — saat AC atau pompa menyala',p2:'Hitung alat yang menyala bersamaan di satu jalur',p3:'Tes tombol ELCB tiap bulan dengan menekan tombol T',p4:'Berhenti dan panggil teknisi kalau tercium bau hangus',cta:'Tanya gratis ke WA 085608564240',theme:'forest',ratio:'4:5'},
 'lama-9x16':{pillar:'Tips Rumahan',hook:'MCB sering turun sendiri?',p1:'Catat kapan turunnya — saat AC atau pompa menyala',p2:'Hitung alat yang menyala bersamaan di satu jalur',p3:'Tes tombol ELCB tiap bulan',p4:'Berhenti kalau tercium bau hangus',cta:'Tanya gratis',theme:'forest',ratio:'9:16'},
 'versus':{block:'versus',pillar:'Metode',hook:'Dihitung,\n*bukan ditaksir*',eyebrow:'Kenapa ini penting',sub:'Selisihnya baru terasa dua tahun kemudian — waktu tagihan naik dan MCB mulai sering turun.',ltag:'DITAKSIR',ltitle:'"Biasanya segini cukup"',rtag:'CARA MERU',rtitle:'Beban dihitung per titik',l1:'Kabel dipilih dari kebiasaan, bukan dari arus',l2:'MCB turun tiap beban puncak',l3:'Drop tegangan tidak pernah diukur',r1:'Ukuran kabel mengikuti hasil hitungan',r2:'Panel dibagi sesuai beban nyata',r3:'RAB terbuka, terinci per item',cta:'Minta contoh perhitungan',theme:'teal'},
 'scope':{block:'scope',pillar:'Layanan',eyebrow:'Audit sistem',hook:'Audit *MEP*\nmenyeluruh',sub:'Lima sistem diukur dalam satu kunjungan — bukan ditebak dari gejala.',c1:'Elektrikal|Beban per titik, drop tegangan|bolt',c2:'Plumbing|Tekanan, debit, pompa|drop',c3:'HVAC|Beban pendingin, airflow|wind',c4:'Proteksi Api|Detektor, hydrant|flame',c5:'Elektronika|CCTV, akses kontrol|cam',c6:'Laporan|Temuan dan prioritas|doc',st1:'15+|tahun pengalaman',st2:'200+|pekerjaan selesai',st3:'20+|properti komersial',cta:'Konsultasi awal tanpa biaya',theme:'navy'},
 'flow':{block:'flow',pillar:'Proses',eyebrow:'Dari gambar sampai menyala',hook:'Satu pihak,\n*lima tahap*',sub:'Tidak ada lempar tanggung jawab antar vendor.',s1:'Survei|Ukur kondisi|search',s2:'Hitung|Beban & kapasitas|calc',s3:'Rancang|Gambar & RAB|ruler',s4:'Pasang|Sesuai gambar|wrench',s5:'Uji|Commissioning|gauge',p1:'As-built drawing diserahkan — gambar akhir sesuai yang terpasang',p2:'Garansi satu pintu — tidak perlu mencari vendor mana yang salah',cta:'Kirim denah, kami hitungkan',theme:'maroon'},
 'light':{pillar:'Mitos vs Fakta',eyebrow:'Yang sering salah kaprah',hook:'"AC boros\nkarena *merk*"',sub:'Merk berpengaruh, tapi bukan penyebab utama.',p1:'Kapasitas tidak cocok ruangan — PK kekecilan bikin kompresor jalan terus',p2:'Filter dan evaporator kotor — aliran udara tertahan',p3:'Ruangan bocor udara — celah pintu dan plafon membuang udara dingin',cta:'Kami ukur dulu sebelum ganti unit',theme:'light'},
};
(async()=>{ fs.mkdirSync('test-out',{recursive:true});
 for(const [n,q] of Object.entries(kasus)){
   const t=Date.now(); const png=await renderPNG(specFromQuery(q), 2);
   fs.writeFileSync(`test-out/${n}.png`,png);
   console.log(n.padEnd(11), (png.length/1024|0)+'KB', (Date.now()-t)+'ms');
 }})().catch(e=>{console.error('GAGAL:',e.message);process.exit(1)});
