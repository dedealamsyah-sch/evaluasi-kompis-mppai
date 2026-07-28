-- =========================================================
-- Schema untuk Evaluasi Komputer Grafis & MPP AI — Supabase
-- Jalankan SQL ini di: Supabase Dashboard → SQL Editor
-- =========================================================

-- Buat tabel utama untuk menyimpan hasil evaluasi
CREATE TABLE evaluasi_results (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject     TEXT NOT NULL DEFAULT 'kompis',    -- Mapel: 'kompis' atau 'mppai'
  kelas       TEXT NOT NULL DEFAULT '-',         -- Kelas (misal: 'XI DKV 1', 'XI DKV 2', dst)
  name        TEXT NOT NULL,                      -- Nama peserta didik
  bab         INTEGER NOT NULL,                   -- Nomor bab (1, 2, 3, ...)
  type        TEXT NOT NULL CHECK (type IN ('pretest', 'posttest')),
  score       INTEGER NOT NULL,                   -- Skor akhir (0–100)
  correct     INTEGER NOT NULL,                   -- Jumlah jawaban benar
  total       INTEGER NOT NULL,                   -- Total soal
  violations  INTEGER DEFAULT 0,                  -- Jumlah pelanggaran terdeteksi
  submitted_at TIMESTAMPTZ DEFAULT NOW()          -- Waktu pengumpulan
);

-- Index untuk pencarian cepat
CREATE INDEX idx_eval_subject     ON evaluasi_results (subject);
CREATE INDEX idx_eval_name_bab_type ON evaluasi_results (name, bab, type);
CREATE INDEX idx_eval_bab         ON evaluasi_results (bab);
CREATE INDEX idx_eval_submitted   ON evaluasi_results (submitted_at);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE evaluasi_results ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua operasi publik (anon key bisa read/write)
DROP POLICY IF EXISTS "Allow public read/write" ON evaluasi_results;
CREATE POLICY "Allow public read/write"
  ON evaluasi_results
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =========================================================
-- Tabel Pengaturan Waktu Ujian (Timer)
-- Menyimpan durasi ujian per mapel, bab, dan jenis evaluasi
-- =========================================================
CREATE TABLE exam_settings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject     TEXT NOT NULL DEFAULT 'kompis',    -- Mapel: 'kompis' atau 'mppai'
  bab         INTEGER NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('pretest', 'posttest')),
  duration    INTEGER NOT NULL DEFAULT 0,        -- Durasi dalam menit (0 = tanpa batas waktu)
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject, bab, type)
);

-- Aktifkan RLS
ALTER TABLE exam_settings ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua operasi publik
DROP POLICY IF EXISTS "Allow public read/write exam_settings" ON exam_settings;
CREATE POLICY "Allow public read/write exam_settings"
  ON exam_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =========================================================
-- Migration: update data lama dengan subject='kompis'
-- =========================================================
UPDATE evaluasi_results SET subject = 'kompis' WHERE subject IS NULL OR subject = 'kompis';
UPDATE exam_settings SET subject = 'kompis' WHERE subject IS NULL OR subject = 'kompis';
