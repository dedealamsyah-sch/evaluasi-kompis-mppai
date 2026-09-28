# Arsitektur & Database Sistem

## Overview Arsitektur
Sistem ini menggunakan arsitektur Jamstack/Serverless tanpa backend khusus (Direct-to-Database via Supabase JS SDK) dengan hosting Statis di Vercel.

```
[ Browser / Student / Teacher ]
          │
          ▼
 [ Static Frontend (HTML/JS) ]
          │
          ├── (Supabase JS SDK) ──► [ Supabase Database (PostgreSQL) ]
          │                              - evaluasi_results
          │                              - exam_settings
          │                              - exam_app_settings
          │                              - penilaian
          │
          └── (SheetJS CDN) ──────► [ Export Data Excel (.xlsx) ]
```

## Schema Database (PostgreSQL / Supabase)

### 1. `evaluasi_results`
Menyimpan hasil ujian pengerjaan peserta didik.
- `id` (UUID, Primary Key)
- `subject` (TEXT, default: 'kompis')
- `kelas` (TEXT)
- `name` (TEXT)
- `bab` (INTEGER)
- `type` (TEXT: 'pretest' | 'posttest')
- `score` (INTEGER, 0-100)
- `correct` (INTEGER)
- `total` (INTEGER)
- `violations` (INTEGER, default 0)
- `detail` (JSONB, opsional detail per soal)
- `submitted_at` (TIMESTAMPTZ)

### 2. `exam_app_settings`
Menyimpan konfigurasi global aplikasi.
- `key` (TEXT, Primary Key, misal: 'proctor_enabled')
- `value` (BOOLEAN)
- `updated_at` (TIMESTAMPTZ)

### 3. `penilaian`
Menyimpan nilai manual/link tugas (LKPD, ASTS, Catatan).
- `id` (UUID, Primary Key)
- `subject` (TEXT)
- `kelas` (TEXT)
- `name` (TEXT)
- `bab` (TEXT, misal: '1' atau 'ASTS')
- `kategori` (TEXT: 'catatan' | 'tugas')
- `score` (INTEGER)
- `catatan` (TEXT, menyimpan URL/link proyek siswa jika kategori tugas/ASTS)
- `updated_at` (TIMESTAMPTZ)

## Fitur Anti-Pelanggaran (Proctor Engine)
- Dijalankan oleh `assets/exam-engine.js`.
- Mendeteksi pemindahan tab atau perubahan visibilitas layar (`visibilitychange` & `blur`).
- Menambah konter `violations`.
- Mematikan event listener secara otomatis saat siswa menekan tombol "Kirim Jawaban" untuk menjamin pengiriman tidak pernah terblokir oleh false-positive.
