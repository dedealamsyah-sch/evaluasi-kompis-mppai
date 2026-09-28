# Changelog

Semua perubahan penting pada proyek ini dicatat di dokumen ini.

## [1.2.0] - 2026-09-28
### Ditambahkan
- Modul dokumentasi lengkap di folder `docs/` (`README.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `CHANGELOG.md`).
- Skrip pengujian otomatis integrasi Supabase (`test_integration.js`).
- Ekspor data nilai ke file format `.xlsx` menggunakan SheetJS.
- Penanganan tabel `penilaian` dan `exam_app_settings` untuk pengaturan anti-kecurangan global.

### Diperbaiki
- **Anti-Cheating Fix**: Mematikan listener pemantauan visibilitas layar secara otomatis saat proses pengiriman jawaban (`submitQuiz`), mencegah kegagalan kirim akibat *false positive* tab change saat klik tombol selesai.
- Penanganan error otomatis jika tabel `exam_app_settings` belum tersedia di database Supabase.

## [1.1.0] - 2026-08-15
### Ditambahkan
- Modul ujian per bab untuk mata pelajaran Komputer Grafis & Praktik Pemrograman AI.
- Timer ujian interaktif berbasis database.

## [1.0.0] - 2026-07-01
### Rilis Perdana
- Struktur dasar aplikasi web statis dengan autentikasi berbasis nama & kelas.
- Integrasi penyimpanan hasil pretest/posttest ke Supabase.
