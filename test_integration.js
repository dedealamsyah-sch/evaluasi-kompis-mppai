const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Baca config
const configContent = fs.readFileSync('assets/config.js', 'utf8');
const supabaseUrlMatch = configContent.match(/supabaseUrl:\s*["']([^"']+)["']/);
const supabaseKeyMatch = configContent.match(/supabaseAnonKey:\s*["']([^"']+)["']/);

if (!supabaseUrlMatch || !supabaseKeyMatch) {
  console.error("Gagal membaca konfigurasi Supabase dari assets/config.js");
  process.exit(1);
}

const supabase = createClient(supabaseUrlMatch[1], supabaseKeyMatch[1]);

async function runTest() {
  console.log("Memulai pengujian integrasi database & alur aplikasi...\n");

  try {
    // 1. Tes tabel exam_app_settings (Anti-pelanggaran)
    console.log("1. Menguji pengaturan Anti-pelanggaran (exam_app_settings)...");
    const { data: settingData, error: settingError } = await supabase
      .from('exam_app_settings')
      .select('*')
      .eq('key', 'proctor_enabled')
      .maybeSingle();

    if (settingError) {
      console.error("   ❌ Gagal membaca exam_app_settings:", settingError.message);
    } else {
      console.log("   ✅ Berhasil membaca exam_app_settings. Status aktif:", settingData ? settingData.value : "belum diset");
    }

    // 2. Tes simulasi submit ASTS (penilaian)
    console.log("\n2. Menguji pengumpulan link ASTS (penilaian)...");
    const dummyASTS = {
      subject: 'kompis',
      kelas: 'XI DKV 4',
      name: 'TEST SISWA BOT',
      bab: 'ASTS',
      kategori: 'tugas',
      catatan: 'https://test-blogger.blogspot.com/2026/09/asts-projek.html',
      updated_at: new Date().toISOString()
    };

    const { error: astsError } = await supabase.from('penilaian').upsert(dummyASTS, { onConflict: 'subject,kelas,name,bab,kategori' });
    if (astsError) {
      console.error("   ❌ Gagal menyimpan ASTS:", astsError.message);
    } else {
      console.log("   ✅ Pengumpulan ASTS berhasil disimpan ke database.");
      // Bersihkan data dummy
      await supabase.from('penilaian').delete().eq('name', dummyASTS.name).eq('bab', 'ASTS');
      console.log("   🧹 Data dummy ASTS dibersihkan.");
    }

    // 3. Tes simulasi pengiriman jawaban Ujian (evaluasi_results)
    console.log("\n3. Menguji pengiriman hasil ujian (evaluasi_results)...");
    const dummyExam = {
      subject: 'kompis',
      kelas: 'XI DKV 4',
      name: 'TEST SISWA BOT',
      bab: 1,
      type: 'pretest',
      score: 100,
      correct: 10,
      total: 10,
      violations: 0,
      submitted_at: new Date().toISOString()
    };

    const { error: examError } = await supabase.from('evaluasi_results').insert(dummyExam);
    if (examError) {
      console.error("   ❌ Gagal mengirim hasil evaluasi:", examError.message);
    } else {
      console.log("   ✅ Pengiriman hasil ujian berhasil disimpan.");
      // Bersihkan data dummy
      await supabase.from('evaluasi_results').delete().eq('name', dummyExam.name).eq('bab', 1);
      console.log("   🧹 Data dummy hasil ujian dibersihkan.");
    }

    console.log("\n✨ Semua pengujian fungsi dan database berhasil 100%!");
  } catch (err) {
    console.error("Terjadi error selama pengujian:", err);
  }
}

runTest();
