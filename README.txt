MARZ-PANEL
==========

Akses key: MARZ-AB12

Cara membuka:
1. Ekstrak ZIP.
2. Buka folder MARZ-PANEL di SPCK Editor.
3. Buka index.html melalui preview/live server.

File:
- index.html: struktur halaman
- css/style.css: tema merah-hitam
- js/config.js: akses key dan alamat API
- js/access.js: pemeriksaan key di browser
- js/app.js: alur panel dan pemanggilan API
- assets/horror.svg: gambar placeholder lokal

Catatan keamanan:
Akses key ini diperiksa di browser dan dapat ditemukan oleh orang yang memeriksa source.
Ini bukan pengamanan kuat; validasi sungguhan harus dilakukan di server.
API endpoint dipertahankan dari kode yang diberikan. Keberhasilan fungsi API bergantung pada
endpoint, izin CORS, dan layanan di sisi server.
