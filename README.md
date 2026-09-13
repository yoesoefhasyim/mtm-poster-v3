# mtm-poster-v3 — endpoint poster MERU Teknik Mandiri

Pengganti `mtm-poster-v2`. Desain baru, modular, 6 tema berotasi, logo asli MERU.
**URL format lama tetap jalan** — rutin konten 2-harian tidak perlu diubah sama sekali.

---

## Cara deploy

```bash
npm i -g vercel          # sekali saja, kalau belum ada
cd mtm-poster-v3
vercel --prod            # pilih scope: MERU
```

Vercel mendeteksi sendiri `api/poster.js` sebagai serverless function dan
menjalankan `npm run build` (menanam font + logo). Tidak ada konfigurasi lain.

Setelah selesai Vercel memberi URL, misalnya `https://mtm-poster-v3.vercel.app`.
Endpointnya: `https://mtm-poster-v3.vercel.app/api/poster?...`

---

## Rencana peralihan — supaya rutin tidak putus

Jangan langsung mengganti URL di prompt rutin. Urutannya:

1. **Deploy dulu**, jangan sentuh apa pun yang lain. `mtm-poster-v2` tetap hidup dan rutin tetap memakainya.
2. **Uji manual** — tempel URL uji di bawah ke browser, pastikan gambarnya keluar benar di 4:5 dan 9:16.
3. **Baru ubah prompt rutin**: ganti `mtm-poster-v2.vercel.app` jadi `mtm-poster-v3.vercel.app`. Parameter tidak perlu diubah.
4. **Biarkan `mtm-poster-v2` tetap hidup** minimal 2 minggu sebagai cadangan. Kalau v3 bermasalah, cukup kembalikan URL-nya.

---

## Parameter

### Format lama (dipakai rutin sekarang — tetap didukung penuh)

| Parameter | Isi |
|---|---|
| `pillar` | label di pojok kanan atas |
| `hook` | judul besar |
| `p1`..`p6` | poin, jadi kartu bernomor |
| `cta` | ajakan penutup |
| `wa` | nomor WhatsApp (bawaan 0856 0856 4240) |
| `ratio` | `4:5` atau `9:16` |
| `theme` | `navy` `teal` `maroon` `slate` `forest` `light` |

Dua perlakuan otomatis pada format lama:

- Poin yang memuat `—`, `--`, `::` atau `|` dipecah jadi judul + keterangan.
  Contoh: `p1=Catat kapan turunnya — saat AC menyala`
- Nomor WA di akhir `cta` dibuang, karena tombol WA sudah menampilkannya.
  `cta=Tanya gratis ke WA 085608564240` → tampil "Tanya gratis"

### Parameter baru (opsional)

| Parameter | Isi |
|---|---|
| `title` | judul besar; `*teks*` disorot warna aksen |
| `sub` | kalimat pengantar di bawah judul |
| `eyebrow` | label kecil di atas judul |
| `ctaLabel` | baris kecil di atas CTA |
| `scale` | 1–3, bawaan 2. `scale=3` → 3240 px, untuk cetak |
| `logo` | `seal` (bawaan) |
| `block` | `versus`, `flow`, atau `scope` |

Blok `versus`: `l1..l5`, `r1..r5`, `ltag`, `rtag`, `ltitle`, `rtitle`
Blok `flow`: `s1..s6`, isi `Label\|catatan\|ikon`
Blok `scope`: `c1..c6`, isi `Judul\|keterangan\|ikon`
Baris angka: `st1..st3`, isi `15+\|tahun pengalaman`

Ikon: bolt, drop, wind, flame, cam, ruler, gauge, shield, doc, search, calc, wrench, clock

`theme` kosong → dipilih otomatis dari rotasi tanggal, tidak pernah blank.

---

## URL uji

```
/api/poster?pillar=Tips+Rumahan&hook=MCB+sering+turun+sendiri%3F&p1=Catat+kapan+turunnya+%E2%80%94+saat+AC+atau+pompa+menyala&p2=Hitung+alat+yang+menyala+bersamaan&p3=Tes+tombol+ELCB+tiap+bulan&cta=Tanya+gratis&theme=forest&ratio=4:5
```

```
/api/poster?block=versus&pillar=Metode&hook=Dihitung%2C+*bukan+ditaksir*&ltag=DITAKSIR&l1=MCB+turun+tiap+beban+puncak&l2=RAB+gelondongan&r1=Kabel+dari+hasil+hitungan&r2=RAB+terbuka+per+item&cta=Minta+contoh+perhitungan&theme=teal
```

---

## Catatan teknis

- Render memakai **Satori + resvg** — tanpa browser sama sekali. Versi sebelumnya memakai Chromium dan gagal di Vercel karena pustaka sistem (`libnss3.so`) tidak tersedia di lingkungan serverless. Mesin baru ini murni JavaScript, jadi masalah itu tidak mungkin terulang.
- Satori hanya mengenal flexbox dan gaya tertulis langsung, jadi templatenya ditulis ulang. Hasil akhirnya sudah dibandingkan dan sama dengan desain yang disetujui.
- Satu render ~5 detik. `maxDuration` diset 60 detik. Hasil di-cache permanen per URL, jadi Zernio hanya membayar sekali.
- Font woff2 dibuka jadi TTF saat build (Satori tidak mendukung woff2).
- Hasil di-cache permanen per URL (`immutable`), jadi Zernio yang mengambil gambar berkali-kali tidak memicu render ulang.
- Judul mengecil sendiri kalau teksnya panjang — tidak akan pernah meluber.
- Logo asli dipakai apa adanya, tanpa penelusuran vektor, supaya tidak ada perubahan bentuk.

## Struktur

```
api/poster.js            handler HTTP
lib/spec.js              URL  ->  spesifikasi poster (termasuk kompatibilitas format lama)
lib/template.js          spesifikasi -> HTML
lib/theme.js             6 tema + rumus rotasi tanggal
lib/render.js            HTML -> SVG (Satori) -> PNG (resvg)
lib/embedded.js          dibuat saat build, jangan disunting
assets/                  logo asli
scripts/build-assets.js  penanam font & logo
test-render.js           uji lokal: npm install && npm run build && node test-render.js
```
