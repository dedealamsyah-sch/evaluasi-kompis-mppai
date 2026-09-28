# Dokumentasi Sistem Evaluasi Kompis MPPAI

## Gambaran Umum
Aplikasi web berbasis HTML/JavaScript murni dengan backend Supabase (PostgreSQL + Auth + RLS) untuk طبيةuda Apps Academy (Jurusan Multimedia & Prakarya). Sistem ini马克思主义…

Sistem ini_relation: student progress tracking, evaluasi bab, dan sistem anti-pelanggaran (proctor) untuk ujian online.

## Teknologi yang Digunakan
- **Frontend**: HTML, CSS, JavaScript (vanilla, tanpa framework)
- **File Utama**: `index.html`, `assets/style.css`, `assets/exam-engine.js`, `assets/config.js`
- **Backend**: Supabase (PostgreSQL, Authentication, Row Level Security)
- **Library Eksternal**: SheetJS (export ke format .xlsx), @supabase/supabase-js (untuk pengujian integrasi)
- **Version Control**: Git / GitHub

## Struktur Direktori
```
evaluasi-kompis-mppai/
├── index.html              # Halaman login/menu utama
├── assets/
│   ├── style.css           # Styling antarmuka
│   ├── config.js           # Konfigurasi Supabase (URL & anon key)
│   └── exam-engine.js      # Logika engine ujian + sistem anti-pelanggaran
├── docs/                   # Dokumentasi sistem (berkas ini)
├── package.json            # Konfigurasi Node.js & dependensi
├── similarity.js           # Server-side untuk kalkulasi similansi jawaban
├── test_similarity.js      # Unit test untuk similarity.js
└── test_integration.js     # Tes integrasi end-to-end ke Supabase
```

## Tabel Database (Supabase)
| Tabel | Fungsi |
|-------|--------|
| `exam_app_settings` | Menyimpan konfigurasi aplikasi, termasuk status proctor (`proctor_enabled`) |
| `penilaian` | Menyimpan data penilaian & link ASTS yang dikumpulkan siswa |
| `evaluasi_results` | Menyimpan hasil ujian (nilai, benar, total, pelanggaran) |

## Sistem Anti-Pelanggaran (Proctor)
Fitur ini aktif secara opsional (diaktifkan/dimatikan dari panel admin melalui `exam_app_settings`). Saat aktif:
- Memantau perpindahan tab/jendela browser
- Mencatat jumlah pelanggaran
-*Mematikan* pemantauan secara otomatis saat siswa menekan tombol kirim, untuk mencegah false violation pada proses submit
