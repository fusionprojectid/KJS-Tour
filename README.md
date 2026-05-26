# Website Promosi Desa Wisata Kampung Jawa Sukorejo

Website statis untuk mempromosikan **Kampung Jawa Sukorejo (KJS)**, desa wisata budaya di Sukorejo, Parengan, Tuban. Website ini memperkenalkan cerita desa, profil pengelola, paket wisata, acara budaya, galeri kegiatan, dan kanal pemesanan untuk calon pengunjung.

## Fitur Utama

- **Halaman beranda (`index.html`)**: hero section, video pengenalan, cerita singkat KJS, profil pengelola, highlight pengalaman, paket wisata, acara unggulan, galeri berjalan, panduan kunjungan, rekomendasi paket, FAQ, dan kontak.
- **Halaman daftar acara (`event-listing.html`)**: informasi Festival Seni Sukorejo, workshop budaya, Tradisi Manganan, dan Pagelaran Sandur.
- **Halaman detail paket (`paket-detail.html`)**: rincian paket Sinau Sedino, Ngleluri Budaya, dan Pusaka Jawi lengkap dengan fasilitas, harga, dan tombol pemesanan WhatsApp.
- **Galeri berjalan dengan zoom**: carousel otomatis di halaman utama, gambar bisa diklik untuk dibuka dalam modal zoom, lengkap dengan navigasi gambar sebelumnya/selanjutnya dan animasi transisi halus.
- **Tombol WhatsApp cepat**: tombol mengambang tersedia di halaman utama, daftar acara, dan detail paket.
- **FAQ interaktif**: accordion Bootstrap untuk membantu calon pengunjung memahami paket dan jadwal.
- **Responsif mobile**: tampilan disesuaikan untuk ponsel, tablet, dan desktop, termasuk perbaikan ukuran foto profil agar seragam.
- **SEO dasar**: meta description, Open Graph, dan structured data `TouristDestination`.

## Teknologi

- HTML5
- CSS3
- Bootstrap 5
- Bootstrap Icons
- JavaScript
- jQuery
- Google Fonts, Poppins

## Struktur Proyek

```text
.
|-- css/
|   |-- bootstrap.min.css
|   |-- bootstrap-icons.css
|   |-- templatemo-tiya-golf-club.css
|   `-- style.css
|-- fonts/
|   |-- bootstrap-icons.woff
|   `-- bootstrap-icons.woff2
|-- images/
|   |-- FSS.JPG
|   |-- galeri-karawitan.jpg
|   |-- galeri-kuliner.jpg
|   |-- galeri-pencak-dor.jpg
|   |-- galeri-tari.jpg
|   |-- hero-background_.jpg
|   |-- manganan.jpg
|   |-- paket-ngleluri-budaya.jpg
|   |-- paket-pusaka-jawi.jpg
|   |-- paket-sinau-sedino.jpg
|   |-- profil-*.jpg
|   `-- sandur.jpg
|-- js/
|   |-- animated-headline.js
|   |-- bootstrap.bundle.min.js
|   |-- click-scroll.js
|   |-- custom.js
|   |-- jquery.min.js
|   |-- jquery.sticky.js
|   |-- modernizr.js
|   `-- script.js
|-- index.html
|-- event-listing.html
|-- paket-detail.html
`-- README.md
```

## Cara Menjalankan

Website ini bersifat statis, jadi bisa dibuka langsung dari browser:

```text
index.html
```

Untuk pratinjau yang lebih stabil, jalankan server lokal dari folder proyek, lalu buka alamat lokal di browser. Contoh jika memakai Node.js:

```bash
npx serve .
```

## Area Kustomisasi

- **Konten halaman utama**: edit teks dan section di `index.html`.
- **Daftar acara**: edit `event-listing.html`.
- **Detail paket dan tombol WhatsApp paket**: edit `paket-detail.html`.
- **Warna, layout, responsif, galeri, dan animasi**: edit `css/style.css`.
- **Interaksi menu mobile dan modal galeri zoom**: edit `js/custom.js`.
- **Gambar galeri**: simpan gambar di folder `images/`, lalu sesuaikan `src` dan `data-gallery-src` di bagian galeri halaman utama.

## Catatan Pengembangan Terbaru

- Menambahkan section panduan kunjungan, rekomendasi paket, dan FAQ.
- Mengembangkan galeri menjadi carousel otomatis.
- Menambahkan fitur zoom galeri dengan navigasi overlay kiri/kanan.
- Menambahkan animasi saat zoom dan transisi next/prev.
- Memperbaiki ukuran foto profil agar lebih seragam di mobile.
- Memperbaiki beberapa metadata, ikon, link eksternal, dan tombol WhatsApp cepat.

## Kredit

- **Template dasar**: Tiya Golf Club by [TemplateMo](https://templatemo.com/)
- **Pengembangan dan kustomisasi**: Angga Wijanarko
- **Konten dan foto**: Kampung Jawa Sukorejo
