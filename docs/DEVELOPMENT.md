# Panduan Pengembangan & Pengujian

## Persyaratan Lingkungan (Prerequisites)
- **Node.js**: v18.x atau lebih baru
- **NPM**: v9.x atau lebih baru
- **Akses Supabase**: URL & Anon Key yang valid di `assets/config.js`

## Menjalankan Pengujian

### 1. Pengujian Integrasi Database (End-to-End)
Memastikan koneksi Supabase, tabel `exam_app_settings`, `penilaian`, dan `evaluasi_results` berfungsi dengan baik:
```bash
node test_integration.js
```

### 2. Pengujian Algoritma Kemiripan Teks (TF-IDF Cosine Similarity)
Memastikan modul analisis kemiripan jawaban uraian berfungsi:
```bash
npm test
```

## Menjalankan Server Analisis Kemiripan Jawaban
```bash
npm start
```

## Deployment
Sistem ini secara otomatis dideploy via integrasi GitHub dengan Vercel.
Setiap `git push origin main` akan mentrigger build & deployment otomatis pada Vercel.

Aturan Rewrite URL dikonfigurasi pada `vercel.json`.
