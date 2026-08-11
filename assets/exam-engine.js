/* =========================================================
   ENGINE UJIAN BERSAMA
   ---------------------------------------------------------
   Satu engine untuk SEMUA halaman evaluasi (semua bab &
   mapel). Setiap halaman hanya perlu mendefinisikan:

     <script src="assets/config.js"></script>
     <script src="assets/data-siswa.js"></script>
     <script> window.EXAM_CONFIG = { ... }; </script>
     <script src="assets/exam-engine.js"></script>

   EXAM_CONFIG (contoh):
   {
     bab: 2,                        // nomor bab
     subject: 'kompis',             // 'kompis' | 'mppai'
     judul: 'Membuat Objek & Menggambar',
     babLabel: 'II',                // label romawi (opsional)
     deskripsi: 'Uji pemahaman ...',
     sumber: 'Gambar 2.x — Sumber: Materi ...',
     useKelas: false,               // true = tampilkan pilihan kelas
     kelasOptions: [],              // dipakai saat useKelas = true
     defaultKelas: 'XI DKV 4',      // kelas tetap untuk mapel kompis
     mediaKind: 'img',              // 'img' (base64) | 'svg' (diagram)
     media: { key: '...' },         // kumpulan gambar/svg
     soal: [ { img, q, o, a }, ... ]
   }
   ========================================================= */

var cfg = window.EXAM_CONFIG;
if (!cfg) { document.body.innerHTML = '<p style="padding:40px;color:#ff6b6b;font-family:monospace;">Konfigurasi halaman tidak ditemukan (EXAM_CONFIG).</p>'; throw new Error('EXAM_CONFIG missing'); }
var appCfg = window.APP_CONFIG || {};
var app = {};

var SUBJECT = cfg.subject;
var BAB_NUM = cfg.bab;
var SOAL = cfg.soal || [];
var MEDIA = cfg.media || {};
var ADMIN_CODE = appCfg.adminCode || "guru2026";
var USE_KELAS = !!cfg.useKelas;
var DEFAULT_KELAS = cfg.defaultKelas || "XI DKV 4";
var MEDIA_KIND = cfg.mediaKind === "svg" ? "svg" : "img";
var BAB_LABEL = cfg.babLabel || intToRoman(BAB_NUM);
var JUDUL = cfg.judul || ("Bab " + BAB_NUM);
var SUMBER = cfg.sumber || ("Gambar " + BAB_NUM + ".x — Sumber: Materi BAB " + BAB_LABEL);

function intToRoman(n){
  var map = { 1:"I",2:"II",3:"III",4:"IV",5:"V",6:"VI",7:"VII",8:"VIII",9:"IX",10:"X" };
  return map[n] || String(n);
}

/* =========================================================
   DATABASE: Supabase
   ========================================================= */
var _supabase = null;
try {
  if (typeof supabase !== "undefined") {
    _supabase = supabase.createClient(appCfg.supabaseUrl, appCfg.supabaseAnonKey);
  }
} catch(e){ console.warn("Supabase gagal dimuat:", e.message); }

var db = {
  async getExisting(name, kelas, bab, type){
    if(!_supabase) return null;
    try{
      var q = _supabase.from('evaluasi_results').select('*')
        .eq('subject', SUBJECT).eq('name', name)
        .eq('bab', bab).eq('type', type);
      if(USE_KELAS) q = q.eq('kelas', kelas);
      var res = await q.maybeSingle();
      return res.error ? null : res.data;
    }catch(e){ return null; }
  },
  async save(payload){
    if(!_supabase) return false;
    var row = { subject: SUBJECT, ...payload };
    // Simpan dengan detail jawaban; jika kolom detail belum ada, simpan tanpa detail
    var res = await _supabase.from('evaluasi_results').insert(row);
    if(res.error){
      var slim = { ...row }; delete slim.detail;
      var res2 = await _supabase.from('evaluasi_results').insert(slim);
      return !res2.error;
    }
    return true;
  },
  async listAll(babFilter){
    if(!_supabase) return [];
    var q = _supabase.from('evaluasi_results').select('*').eq('subject', SUBJECT);
    if(babFilter) q = q.eq('bab', babFilter);
    var res = await q.order('name');
    return res.error ? [] : (res.data || []);
  },
  async deleteById(id){
    if(!_supabase) return false;
    var res = await _supabase.from('evaluasi_results').delete().eq('id', id);
    return !res.error;
  }
};

/* =========================================================
   STATE
   ========================================================= */
var currentQuiz = [];
var state = { name:"", kelas:"", type:"", index:0, answers:[], violations:0, examActive:false };
var isSubmitting = false;
var lastReportRows = [];

var timerInterval = null;
var timerRemaining = 0;
var timerDuration = 0;

var _touchTimer = null;
var _touchStartCount = 0;

/* =========================================================
   BANGUN TAMPILAN HALAMAN (satu template untuk semua bab)
   ========================================================= */
function buildAppHTML(){
  var kelasField = USE_KELAS ? `
    <div class="field">
      <label class="field-label">Kelas</label>
      <div class="select-wrap">
        <select id="sel-kelas" onchange="loadNamaList(); validateStart();">
          <option value="">\u2014 Pilih kelas \u2014</option>
          ${(cfg.kelasOptions || []).map(function(k){ return '<option value="'+k+'">'+k+'</option>'; }).join("")}
        </select>
      </div>
    </div>` : "";

  return `
<div class="app">
  <div class="brand">
    <svg class="brand-mark" viewBox="0 0 42 42" fill="none">
      <path d="M6 32 C 14 8, 22 40, 36 10" stroke="#7c5cff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <circle cx="6" cy="32" r="3.4" fill="#ffb627"/>
      <circle cx="36" cy="10" r="3.4" fill="#2dd4bf"/>
      <circle cx="21" cy="24" r="2.6" fill="#7c5cff"/>
    </svg>
    <div class="brand-text">
      <div class="eyebrow">Evaluasi Belajar · BAB ${BAB_LABEL}</div>
      <h1>${JUDUL}</h1>
    </div>
  </div>

  <!-- SCREEN: START -->
  <div id="screen-start">
    <div class="card">
      ${kelasField}
      <div class="field">
        <label class="field-label">Nama Peserta Didik</label>
        <div class="select-wrap">
          <select id="sel-nama">
            <option value="">\u2014 Pilih nama \u2014</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="field-label">Jenis Evaluasi</label>
        <div class="type-toggle">
          <button type="button" data-type="pretest" onclick="chooseType('pretest')">Pretest<span class="t-desc">Sebelum materi diajarkan</span></button>
          <button type="button" data-type="posttest" onclick="chooseType('posttest')">Posttest<span class="t-desc">Setelah materi diajarkan</span></button>
        </div>
      </div>
      <p class="subtle">Terdiri dari <b id="total-soal-info"></b> soal pilihan ganda seputar <b>${JUDUL}</b>. Setiap peserta hanya dapat mengerjakan <b>satu kali</b> untuk masing-masing jenis evaluasi, jadi pastikan Anda siap sebelum memulai.</p>
      <div class="btn-row">
        <button class="btn btn-primary btn-block" id="btn-start" onclick="startQuiz()" disabled>Mulai Mengerjakan \u2192</button>
      </div>
    </div>
    <div class="footer-link"><a onclick="openAdmin()">Masuk sebagai Guru — Lihat Rekap Laporan</a> · <a href="index.html">← Beranda</a></div>
  </div>

  <!-- SCREEN: LOCKED -->
  <div id="screen-locked" class="hidden">
    <div class="card">
      <svg class="locked-icon" viewBox="0 0 24 24" fill="none"><path d="M6 10V8a6 6 0 1112 0v2M5 10h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <h2 style="margin-top:14px;font-size:20px;">Sudah pernah mengerjakan</h2>
      <p class="subtle" id="locked-text" style="margin-top:8px;"></p>
      <div class="btn-row">
        <button class="btn btn-ghost btn-block" onclick="backToStart()">← Kembali</button>
      </div>
    </div>
  </div>

  <!-- SCREEN: WARNING -->
  <div id="screen-warning" class="hidden">
    <div class="card">
      <h2 style="font-size:19px;">Sebelum Memulai — Baca Aturan Ujian</h2>
      <p class="subtle" style="margin-top:6px;">Ujian akan berjalan dalam mode <b>layar penuh (full screen)</b>. Selama mengerjakan, sistem memantau aktivitas pada perangkat Anda.</p>
      <ul class="rule-list">
        <li><span class="ri"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></span><span>Dilarang <b>membuka atau berpindah aplikasi/tab lain</b> selama ujian berlangsung.</span></li>
        <li><span class="ri"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></span><span>Dilarang <b>keluar dari mode layar penuh</b> sebelum ujian selesai dikirim.</span></li>
        <li><span class="ri"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></span><span>Dilarang mengambil <b>screenshoot / tangkapan layar</b> dalam bentuk apa pun.</span></li>
        <li><span class="ri"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg></span><span>Dilarang menggunakan <b>bantuan AI, internet, atau alat bantu lain</b> untuk menjawab soal.</span></li>
        <li><span class="ri"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span><span>Setiap pelanggaran di atas akan <b>terdeteksi otomatis</b> dan tercatat sebagai peringatan pada laporan guru.</span></li>
      </ul>
      <div class="agree-row">
        <input type="checkbox" id="agree-check" onchange="$('btn-confirm-start').disabled = !this.checked">
        <label for="agree-check">Saya telah membaca dan memahami aturan di atas, serta bersedia mengerjakan ujian secara jujur dan mandiri.</label>
      </div>
      <div class="btn-row">
        <button class="btn btn-ghost" onclick="backToStart()">← Batal</button>
        <button class="btn btn-primary" style="margin-left:auto;" id="btn-confirm-start" onclick="confirmStartExam()" disabled>Mulai Sekarang (Layar Penuh) \u2192</button>
      </div>
    </div>
  </div>

  <!-- SCREEN: QUIZ -->
  <div id="screen-quiz" class="hidden">
    <div class="path-progress"><svg id="path-svg" viewBox="0 0 700 46" preserveAspectRatio="none"></svg></div>
    <div id="timer-bar" class="timer-bar no-timer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span class="timer-text" id="timer-text">00:00</span>
      <span class="timer-label">tersisa</span>
    </div>
    <div class="card">
      <div class="qmeta">
        <span class="qnum mono" id="q-counter">Soal 1/30</span>
        <span class="qname" id="q-participant"></span>
        <span class="violation-badge" id="violation-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Pelanggaran: 0</span>
      </div>
      <div class="warning-text"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Tidak boleh screenshoot — terdeteksi otomatis</div>
      <div class="question-img-wrap hidden" id="q-img-wrap">
        <div>
          ${MEDIA_KIND === "svg"
            ? '<div id="q-img-svg"></div>'
            : '<img id="q-img" src="" alt="Ilustrasi soal">'}
          <div class="question-img-cap" id="q-img-cap"></div>
        </div>
      </div>
      <div class="question-text" id="q-text"></div>
      <div class="options" id="q-options"></div>
      <div class="btn-row">
        <button class="btn btn-ghost" onclick="prevQuestion()" id="btn-prev">← Sebelumnya</button>
        <button class="btn btn-primary" style="margin-left:auto;" onclick="nextQuestion()" id="btn-next" disabled>Selanjutnya \u2192</button>
      </div>
    </div>
  </div>

  <!-- SCREEN: RESULT -->
  <div id="screen-result" class="hidden">
    <div class="card">
      <div class="score-hero">
        <div class="score-ring">
          <svg viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(247,245,240,0.1)" stroke-width="14"/>
            <circle id="score-arc" cx="90" cy="90" r="78" fill="none" stroke="url(#gradScore)" stroke-width="14" stroke-linecap="round" transform="rotate(-90 90 90)"/>
            <defs><linearGradient id="gradScore" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#7c5cff"/><stop offset="100%" stop-color="#2dd4bf"/>
            </linearGradient></defs>
          </svg>
          <div class="score-num"><span class="val" id="score-val">0</span><span class="lbl">Skor Akhir</span></div>
        </div>
        <h2 id="result-title" style="font-size:20px;"></h2>
        <p class="subtle" id="result-sub"></p>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="n" id="stat-correct">0</div><div class="l">Benar</div></div>
        <div class="stat"><div class="n" id="stat-wrong">0</div><div class="l">Salah</div></div>
        <div class="stat"><div class="n" id="stat-total">0</div><div class="l">Total Soal</div></div>
      </div>
    </div>
    <div class="card">
      <h3 style="font-size:15px;margin-bottom:4px;">Pembahasan Jawaban</h3>
      <div id="review-list"></div>
    </div>
    <div class="footer-link"><a onclick="backToStart()">← Kembali ke Halaman Awal</a> · <a href="index.html">Beranda</a></div>
  </div>

  <!-- SCREEN: ADMIN -->
  <div id="screen-admin" class="hidden">
    <div class="card">
      <div class="top-bar">
        <h2 style="font-size:19px;">Rekap Laporan Guru</h2>
        <a class="footer-link" style="margin:0;"><span style="cursor:pointer;color:var(--text-dim);font-size:12.5px;text-decoration:underline;" onclick="backToStart()">Tutup</span></a>
      </div>
      <div id="admin-locked">
        <div class="field" style="margin-top:14px;">
          <label class="field-label">Kode Akses Guru</label>
          <input type="text" id="admin-code" placeholder="Masukkan kode akses">
        </div>
        <button class="btn btn-primary btn-block" onclick="checkAdminCode()">Buka Rekap</button>
      </div>
      <div id="admin-content" class="hidden">
        <div class="adm-summary">
          <div class="stat"><div class="n" id="adm-total">0</div><div class="l">Total Pengerjaan</div></div>
          <div class="stat"><div class="n" id="adm-avg-pre">–</div><div class="l">Rata\u00b2 Pretest</div></div>
          <div class="stat"><div class="n" id="adm-avg-post">–</div><div class="l">Rata\u00b2 Posttest</div></div>
          <div class="stat"><div class="n" id="adm-belum">0</div><div class="l">Belum Mengerjakan</div></div>
        </div>

        <div class="timer-admin-section">
          <h4>Pengaturan Waktu Ujian (Timer)</h4>
          <p class="sub">Atur durasi ujian per jenis evaluasi. Siswa akan melihat hitung mundur dan otomatis mengirim saat waktu habis. Set 0 untuk tanpa batas waktu.</p>
          <div class="timer-admin-row">
            <label>Pretest:</label>
            <input type="number" id="admin-timer-pre" min="0" max="300" value="0" onchange="updateAdminTimerStatus('pre')">
            <span class="unit">menit</span>
            <span class="status" id="admin-timer-pre-status">Tanpa batas waktu</span>
          </div>
          <div class="timer-admin-row">
            <label>Posttest:</label>
            <input type="number" id="admin-timer-post" min="0" max="300" value="0" onchange="updateAdminTimerStatus('post')">
            <span class="unit">menit</span>
            <span class="status" id="admin-timer-post-status">Tanpa batas waktu</span>
          </div>
          <button class="btn btn-ghost" style="margin-top:8px;padding:8px 16px;font-size:12px;" onclick="saveAdminTimerSettings()">Simpan Pengaturan Timer</button>
        </div>

        <div class="btn-row">
          <button class="btn btn-ghost" onclick="loadAdminData()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Muat Ulang</button>
          <button class="btn btn-amber" onclick="exportCSV()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Unduh CSV</button>
        </div>
        <div id="admin-table-wrap"></div>
      </div>
    </div>
  </div>

  <!-- VIOLATION OVERLAY -->
  <div id="violation-overlay" class="violation-overlay hidden">
    <div class="violation-box">
      <div class="vicon"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
      <img src="https://media.tenor.com/j5rPRPBwSOMAAAAM/cat-smacking-other-cat-cat.gif" alt="peringatan pelanggaran" style="width:140px;border-radius:12px;margin-bottom:8px;">
      <h3 id="violation-title">Pelanggaran Terdeteksi</h3>
      <p id="violation-desc">Aktivitas mencurigakan terdeteksi selama ujian berlangsung. Kejadian ini telah tercatat dan akan dilaporkan kepada guru.</p>
      <button class="btn btn-primary btn-block" onclick="resumeExam()">Kembali ke Ujian (Layar Penuh)</button>
    </div>
  </div>
</div>`;
}

document.body.innerHTML = buildAppHTML();

/* =========================================================
   UTIL
   ========================================================= */
function $(id){ return document.getElementById(id); }
function titleCase(s){
  return String(s || "").toLowerCase().split(" ").map(function(w){ return w.charAt(0).toUpperCase()+w.slice(1); }).join(" ");
}
function shuffleArray(arr){
  var a = arr.slice();
  for(var i = a.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function showScreen(id){
  ["screen-start","screen-locked","screen-warning","screen-quiz","screen-result","screen-admin"].forEach(function(s){
    $(s).classList.toggle("hidden", s !== id);
  });
  window.scrollTo({ top:0, behavior:"smooth" });
}

/* =========================================================
   INIT & START SCREEN
   ========================================================= */
function rosterAll(){
  if(USE_KELAS){
    var all = [];
    (cfg.kelasOptions || []).forEach(function(k){ all = all.concat(window.getRoster(SUBJECT, k) || []); });
    return all;
  }
  return window.getRoster(SUBJECT, null) || [];
}

function init(){
  var sel = $("sel-nama");
  rosterAll().forEach(function(n){
    var opt = document.createElement("option");
    opt.value = n; opt.textContent = titleCase(n);
    sel.appendChild(opt);
  });
  sel.addEventListener("change", validateStart);
  $("total-soal-info").textContent = SOAL.length;
  document.title = "Bab " + BAB_LABEL + " — " + JUDUL + " · Evaluasi Komputer Grafis & MPP AI";
}

function loadNamaList(){
  var kelas = $("sel-kelas").value;
  var sel = $("sel-nama");
  sel.innerHTML = '<option value="">\u2014 Pilih nama \u2014</option>';
  sel.disabled = !kelas;
  if(!kelas) return;
  (window.getRoster(SUBJECT, kelas) || []).forEach(function(n){
    var o = document.createElement("option");
    o.value = n; o.textContent = titleCase(n);
    sel.appendChild(o);
  });
  sel.value = "";
}

function chooseType(type){
  state.type = type;
  document.querySelectorAll(".type-toggle button").forEach(function(b){
    b.classList.toggle("active", b.dataset.type === type);
  });
  validateStart();
}

function validateStart(){
  var name = $("sel-nama").value;
  var ok = !!(name && state.type);
  if(USE_KELAS) ok = ok && !!$("sel-kelas").value;
  $("btn-start").disabled = !ok;
}

async function startQuiz(){
  state.name = $("sel-nama").value;
  state.kelas = USE_KELAS ? $("sel-kelas").value : DEFAULT_KELAS;
  $("btn-start").disabled = true;
  $("btn-start").textContent = "Memeriksa...";
  try{
    var existing = null;
    try{ existing = await db.getExisting(state.name, state.kelas, BAB_NUM, state.type); }catch(e){ existing = null; }
    if(existing){
      $("locked-text").innerHTML = `<b>${titleCase(state.name)}</b> sudah mengerjakan <b>${state.type==='pretest'?'Pretest':'Posttest'}</b> pada ${new Date(existing.submitted_at).toLocaleString('id-ID')} dengan skor <b>${existing.score}</b>. Setiap peserta hanya dapat mengerjakan satu kali.`;
      showScreen("screen-locked");
    } else {
      $("agree-check").checked = false;
      $("btn-confirm-start").disabled = true;
      showScreen("screen-warning");
    }
  } finally {
    $("btn-start").disabled = false;
    $("btn-start").textContent = "Mulai Mengerjakan \u2192";
  }
}

function backToStart(){
  currentQuiz = [];
  state.name = ""; state.kelas = ""; state.type = "";
  $("sel-nama").value = "";
  if(USE_KELAS) $("sel-kelas").value = "";
  document.querySelectorAll(".type-toggle button").forEach(function(b){ b.classList.remove("active"); });
  validateStart();
  teardownProctor();
  showScreen("screen-start");
}

/* =========================================================
   MULAI UJIAN (FULLSCREEN + ANTI-CURANG)
   ========================================================= */
function confirmStartExam(){
  currentQuiz = shuffleArray(SOAL);
  state.index = 0;
  state.answers = new Array(currentQuiz.length).fill(null);
  state.violations = 0;
  state.examActive = true;
  updateViolationBadge();
  buildPathSVG();
  requestExamFullscreen();
  showScreen("screen-quiz");
  renderQuestion();
  setupProctor();
  fetchTimerSettings().then(function(dur){ startTimer(dur); });
}

function requestExamFullscreen(){
  var el = document.documentElement;
  var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
  if(req){ req.call(el).catch(function(){}); }
}
function exitExamFullscreen(){
  var exitFs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
  if(document.fullscreenElement && exitFs){ exitFs.call(document).catch(function(){}); }
}

function updateViolationBadge(){
  var b = $("violation-badge");
  if(b) b.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Pelanggaran: ${state.violations}`;
}

function showViolation(title, desc){
  if(!state.examActive) return;
  state.violations++;
  updateViolationBadge();
  $("violation-title").textContent = title;
  $("violation-desc").textContent = desc;
  $("violation-overlay").classList.remove("hidden");
}
function resumeExam(){
  $("violation-overlay").classList.add("hidden");
  requestExamFullscreen();
}

function handleVisibilityChange(){
  if(document.hidden && state.examActive){
    showViolation("Berpindah Aplikasi/Tab Terdeteksi", "Anda meninggalkan halaman ujian. Aktivitas ini tercatat sebagai pelanggaran dan dilaporkan ke guru.");
  }
}
function handleFullscreenChange(){
  if(!document.fullscreenElement && state.examActive){
    showViolation("Keluar dari Mode Layar Penuh", "Anda keluar dari mode layar penuh selama ujian. Kejadian ini tercatat sebagai pelanggaran.");
  }
}
function handleWindowBlur(){
  if(state.examActive){
    showViolation("Jendela Ujian Tidak Aktif", "Perangkat mendeteksi Anda berpindah ke jendela/aplikasi lain. Kejadian ini tercatat sebagai pelanggaran.");
  }
}
function handleKeydown(e){
  if(!state.examActive) return;
  var key = e.key;
  var isPrintScreen = key === "PrintScreen";
  var isSnip = (e.metaKey && e.shiftKey && ["3","4","5","S","s"].indexOf(key) >= 0) || (e.shiftKey && (key==="S"||key==="s") && e.metaKey);
  var isDevtools = key==="F12" || (e.ctrlKey && e.shiftKey && ["I","i","J","j","C","c"].indexOf(key) >= 0) || (e.ctrlKey && (key==="u"||key==="U"));
  if(isPrintScreen || isSnip){
    showViolation("Percobaan Screenshoot Terdeteksi", "Sistem mendeteksi upaya pengambilan tangkapan layar. Kejadian ini tercatat sebagai pelanggaran.");
  } else if(isDevtools){
    e.preventDefault();
    showViolation("Akses Alat Pengembang Terdeteksi", "Membuka developer tools/inspect element selama ujian tidak diizinkan dan tercatat sebagai pelanggaran.");
  }
}
function handleContextMenu(e){ if(state.examActive) e.preventDefault(); }
function handleCopy(e){ if(state.examActive) e.preventDefault(); }

function handleTouchStart(e){
  if(!state.examActive) return;
  _touchStartCount = e.touches.length;
  if(e.touches.length >= 3){
    e.preventDefault();
    showViolation("Gestur Multi-Sentuh Terdeteksi", "Sistem mendeteksi gestur multi-sentuh (3 jari atau lebih) yang sering digunakan untuk screenshot. Kejadian ini tercatat sebagai pelanggaran.");
    return;
  }
  clearTimeout(_touchTimer);
  _touchTimer = setTimeout(function(){
    if(state.examActive){
      showViolation("Sentuhan Lama Terdeteksi", "Sistem mendeteksi sentuhan layar dalam durasi panjang (long press). Gestur ini sering digunakan untuk mengambil screenshot. Kejadian ini tercatat sebagai pelanggaran.");
    }
  }, 3000);
}
function handleTouchEnd(){ clearTimeout(_touchTimer); _touchStartCount = 0; }
function handleTouchMove(e){ if(state.examActive && e.touches.length >= 3) e.preventDefault(); }
function handleGestureStart(e){ e.preventDefault(); }
function handleGestureChange(e){ e.preventDefault(); }
function handleGestureEnd(e){ e.preventDefault(); }

function setupProctor(){
  document.addEventListener("visibilitychange", handleVisibilityChange);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  window.addEventListener("blur", handleWindowBlur);
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("copy", handleCopy);
  document.addEventListener("touchstart", handleTouchStart, {passive:false});
  document.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("touchmove", handleTouchMove, {passive:false});
  document.addEventListener("gesturestart", handleGestureStart);
  document.addEventListener("gesturechange", handleGestureChange);
  document.addEventListener("gestureend", handleGestureEnd);
  document.body.classList.add("body-mobile");
}
function teardownProctor(){
  state.examActive = false;
  stopTimer();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
  window.removeEventListener("blur", handleWindowBlur);
  document.removeEventListener("keydown", handleKeydown);
  document.removeEventListener("contextmenu", handleContextMenu);
  document.removeEventListener("copy", handleCopy);
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchend", handleTouchEnd);
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("gesturestart", handleGestureStart);
  document.removeEventListener("gesturechange", handleGestureChange);
  document.removeEventListener("gestureend", handleGestureEnd);
  document.body.classList.remove("body-mobile");
  $("violation-overlay").classList.add("hidden");
  exitExamFullscreen();
}

/* =========================================================
   TIMER
   ========================================================= */
async function fetchTimerSettings(){
  if(!_supabase) return 0;
  try{
    var res = await _supabase.from('exam_settings').select('duration')
      .eq('subject', SUBJECT).eq('bab', BAB_NUM).eq('type', state.type).maybeSingle();
    if(res.error) throw res.error;
    return (res.data && res.data.duration) ? res.data.duration * 60 : 0;
  }catch(e){
    console.warn("Gagal memuat pengaturan timer:", e.message);
    return 0;
  }
}

function startTimer(seconds){
  if(seconds <= 0) return;
  timerDuration = seconds;
  timerRemaining = seconds;
  $("timer-bar").classList.remove("no-timer");
  updateTimerDisplay();
  timerInterval = setInterval(function(){
    timerRemaining--;
    updateTimerDisplay();
    if(timerRemaining <= 0){
      clearInterval(timerInterval);
      timerInterval = null;
      autoSubmitTimeout();
    }
  }, 1000);
}

function updateTimerDisplay(){
  var mins = Math.floor(timerRemaining / 60);
  var secs = timerRemaining % 60;
  var text = String(mins).padStart(2,"0") + ":" + String(secs).padStart(2,"0");
  $("timer-text").textContent = text;
  var bar = $("timer-bar");
  if(timerRemaining <= 120 && timerRemaining > 0){
    bar.classList.add("urgent");
  } else {
    bar.classList.remove("urgent");
  }
  document.title = "[" + text + "] Bab " + BAB_LABEL + " — " + JUDUL + " · Evaluasi Komputer Grafis & MPP AI";
}

function stopTimer(){
  if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
  $("timer-bar").classList.add("no-timer");
  $("timer-bar").classList.remove("urgent");
  document.title = "Bab " + BAB_LABEL + " — " + JUDUL + " · Evaluasi Komputer Grafis & MPP AI";
}

function autoSubmitTimeout(){
  state.examActive = false;
  alert("Waktu ujian habis! Jawaban Anda akan dikirim secara otomatis.");
  submitQuiz();
}

/* =========================================================
   PATH / NODE PROGRESS
   ========================================================= */
function buildPathSVG(){
  var svg = $("path-svg");
  var n = currentQuiz.length;
  var w = 700, h = 46, pad = 18;
  var step = (w - pad*2) / (n - 1);
  var pts = [];
  for(var i = 0; i < n; i++){
    var x = pad + step*i;
    var y = 23 + Math.sin(i*0.9)*10;
    pts.push([x, y]);
  }
  var d = "M" + pts[0][0] + "," + pts[0][1];
  for(var j = 1; j < pts.length; j++) d += " L" + pts[j][0] + "," + pts[j][1];
  svg.innerHTML = `<path class="seg" d="${d}"/><path class="seg-done" id="seg-done" d="${d}"/>` +
    pts.map(function(p, k){ return `<circle class="node node-fill" id="node-${k}" cx="${p[0]}" cy="${p[1]}" r="4.2"/>`; }).join("");
  var segEl = $("seg-done");
  var len = segEl.getTotalLength();
  segEl.style.strokeDasharray = len;
  segEl.style.strokeDashoffset = len;
  svg.dataset.len = len;
}
function updatePathProgress(){
  var n = currentQuiz.length;
  var segEl = $("seg-done");
  var len = parseFloat($("path-svg").dataset.len);
  var frac = state.index / (n - 1);
  segEl.style.strokeDashoffset = len - len*frac;
  for(var i = 0; i < n; i++){
    var node = $("node-" + i);
    if(!node) continue;
    node.classList.remove("done", "current");
    if(state.answers[i] !== null && i < state.index) node.classList.add("done");
    if(i === state.index) node.classList.add("current");
    else if(state.answers[i] !== null) node.classList.add("done");
  }
}

/* =========================================================
   QUIZ RENDERING
   ========================================================= */
function renderQuestion(){
  var q = currentQuiz[state.index];
  $("q-counter").textContent = "Soal " + (state.index+1) + "/" + currentQuiz.length;
  $("q-participant").textContent = titleCase(state.name) + (USE_KELAS ? " · " + state.kelas : "") + " · " + (state.type==='pretest'?'Pretest':'Posttest');
  $("q-text").textContent = q.q;

  var imgWrap = $("q-img-wrap");
  if(q.img && MEDIA[q.img]){
    if(MEDIA_KIND === "svg"){
      $("q-img-svg").innerHTML = MEDIA[q.img];
    } else {
      $("q-img").src = MEDIA[q.img];
    }
    $("q-img-cap").textContent = typeof SUMBER === "function" ? SUMBER(q) : SUMBER;
    imgWrap.classList.remove("hidden");
  } else {
    imgWrap.classList.add("hidden");
    if(MEDIA_KIND === "svg"){ $("q-img-svg").innerHTML = ""; } else { $("q-img").src = ""; }
  }

  var wrap = $("q-options");
  wrap.innerHTML = "";
  var letters = ["A","B","C","D"];
  q.o.forEach(function(opt, i){
    var div = document.createElement("div");
    div.className = "option" + (state.answers[state.index] === i ? " selected" : "");
    div.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt}</span>`;
    div.onclick = (function(idx){ return function(){ selectOption(idx); }; })(i);
    wrap.appendChild(div);
  });
  $("btn-prev").style.visibility = state.index === 0 ? "hidden" : "visible";
  $("btn-next").innerHTML = state.index === currentQuiz.length - 1
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Selesai &amp; Kirim'
    : "Selanjutnya \u2192";
  $("btn-next").disabled = state.answers[state.index] === null;
  updatePathProgress();
}
function selectOption(i){
  state.answers[state.index] = i;
  renderQuestion();
}
function prevQuestion(){
  if(state.index > 0){ state.index--; renderQuestion(); }
}
function nextQuestion(){
  if(state.answers[state.index] === null) return;
  if(state.index < currentQuiz.length - 1){
    state.index++;
    renderQuestion();
  } else {
    submitQuiz();
  }
}

/* =========================================================
   SUBMIT & SAVE RESULT
   ========================================================= */
async function submitQuiz(){
  if(isSubmitting) return;
  isSubmitting = true;

  var correct = 0;
  var detail = currentQuiz.map(function(q, i){
    var ok = state.answers[i] === q.a;
    if(ok) correct++;
    return { q: q.q, o: q.o, chosen: state.answers[i], kunci: q.a, ok: ok };
  });
  var total = currentQuiz.length;
  var score = Math.round((correct/total)*100);
  var payload = {
    name: state.name,
    kelas: state.kelas || DEFAULT_KELAS,
    bab: BAB_NUM,
    type: state.type,
    score: score, correct: correct, total: total,
    violations: state.violations || 0,
    detail: detail,
    submitted_at: new Date().toISOString()
  };
  try{
    var saved = await db.save(payload);
    if(!saved) throw new Error("Gagal menyimpan ke database");
  }catch(e){
    console.error("Gagal menyimpan hasil:", e);
    alert("Gagal mengirim jawaban. Periksa koneksi internet lalu coba kirim ulang.");
    isSubmitting = false;
    return;
  }

  teardownProctor();
  renderResult(payload, detail);
  showScreen("screen-result");
}

function renderResult(payload, detail){
  $("score-val").textContent = payload.score;
  var circumference = 2*Math.PI*78;
  var arc = $("score-arc");
  arc.style.strokeDasharray = circumference;
  arc.style.strokeDashoffset = circumference - (circumference*payload.score/100);
  var grade = payload.score>=85 ? "Sangat Baik" : payload.score>=70 ? "Baik" : payload.score>=55 ? "Cukup" : "Perlu Belajar Lagi";
  $("result-title").textContent = titleCase(payload.name) + " — " + grade;
  $("result-sub").textContent = payload.violations > 0
    ? "Hasil " + (payload.type==='pretest'?'Pretest':'Posttest') + " telah tersimpan. Tercatat " + payload.violations + " peringatan pelanggaran selama ujian."
    : "Hasil " + (payload.type==='pretest'?'Pretest':'Posttest') + " telah tersimpan dan tercatat untuk laporan guru.";
  $("stat-correct").textContent = payload.correct;
  $("stat-wrong").textContent = payload.total - payload.correct;
  $("stat-total").textContent = payload.total;

  var list = $("review-list");
  list.innerHTML = "";
  detail.forEach(function(d, i){
    var chosenText = d.chosen !== null ? d.o[d.chosen] : "(tidak dijawab)";
    var correctText = d.o[d.kunci];
    var div = document.createElement("div");
    div.className = "review-item";
    div.innerHTML = `
      <div class="rq"><b>${i+1}.</b> ${d.q}</div>
      <div class="ra">
        <span class="tag ${d.ok?'tag-ok':'tag-no'}">${d.ok?'BENAR':'SALAH'}</span>
        Jawaban Anda: ${chosenText}${!d.ok ? ' · Kunci: ' + correctText : ''}
      </div>`;
    list.appendChild(div);
  });
}

/* =========================================================
   ADMIN / TEACHER REPORT
   ========================================================= */
function openAdmin(){
  $("admin-locked").classList.remove("hidden");
  $("admin-content").classList.add("hidden");
  $("admin-code").value = "";
  showScreen("screen-admin");
}
function checkAdminCode(){
  if($("admin-code").value.trim() === ADMIN_CODE){
    $("admin-locked").classList.add("hidden");
    $("admin-content").classList.remove("hidden");
    loadAdminData();
    loadAdminTimerSettings();
  } else {
    alert("Kode akses salah.");
  }
}

async function loadAdminData(){
  var wrap = $("admin-table-wrap");
  wrap.innerHTML = '<p class="subtle">Memuat data...</p>';
  if(!_supabase){
    wrap.innerHTML = '<div class="empty-state">Supabase tidak tersedia. Periksa koneksi internet.</div>';
    return;
  }
  var rows = await db.listAll(BAB_NUM);
  rows.sort(function(a,b){ return a.name.localeCompare(b.name) || a.type.localeCompare(b.type); });
  lastReportRows = rows;

  var pre = rows.filter(function(r){ return r.type === 'pretest'; });
  var post = rows.filter(function(r){ return r.type === 'posttest'; });
  var avg = function(arr){ return arr.length ? Math.round(arr.reduce(function(s,r){ return s + r.score; }, 0)/arr.length) : null; };
  $("adm-total").textContent = rows.length;
  $("adm-avg-pre").textContent = avg(pre) !== null ? avg(pre) : "–";
  $("adm-avg-post").textContent = avg(post) !== null ? avg(post) : "–";
  var doneNames = new Set(rows.map(function(r){ return r.name; }));
  $("adm-belum").textContent = rosterAll().filter(function(n){ return !doneNames.has(n); }).length;

  if(rows.length === 0){
    wrap.innerHTML = '<div class="empty-state">Belum ada data yang masuk.</div>';
    return;
  }

  var html = '<table class="report"><thead><tr><th>Nama</th><th>Kelas</th><th>Jenis</th><th>Skor</th><th>Benar</th><th>Pelanggaran</th><th>Waktu</th><th>Aksi</th></tr></thead><tbody>';
  rows.forEach(function(r){
    var v = r.violations || 0;
    html += '<tr>' +
      '<td>' + titleCase(r.name) + '</td>' +
      '<td>' + (USE_KELAS ? (r.kelas || "-") : DEFAULT_KELAS) + '</td>' +
      '<td><span class="badge ' + (r.type==='pretest'?'badge-pre':'badge-post') + '">' + (r.type==='pretest'?'Pretest':'Posttest') + '</span></td>' +
      '<td class="num">' + r.score + '</td>' +
      '<td class="num">' + r.correct + '/' + r.total + '</td>' +
      '<td class="num" style="' + (v>0?'color:var(--coral);':'') + '">' + v + '</td>' +
      '<td>' + new Date(r.submitted_at).toLocaleString('id-ID') + '</td>' +
      '<td><button class="btn-reset" onclick="resetStudentResult(\'' + r.id + '\',\'' + titleCase(r.name).replace(/'/g, "\\'") + '\',\'' + (r.type==='pretest'?'Pretest':'Posttest') + '\')"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg> Reset (Susulan)</button></td>' +
      '</tr>';
  });
  wrap.innerHTML = html + '</tbody></table>';
}

async function resetStudentResult(id, displayName, typeLabel){
  var ok = confirm('Reset hasil ' + typeLabel + ' milik "' + displayName + '"?\n\nSkor dan jawaban yang tersimpan akan DIHAPUS PERMANEN, dan siswa ini akan bisa mengerjakan ' + typeLabel + ' sekali lagi (misalnya untuk ujian susulan). Lanjutkan?');
  if(!ok) return;
  try{
    await db.deleteById(id);
    await loadAdminData();
    alert('Berhasil direset. "' + displayName + '" kini dapat mengerjakan ' + typeLabel + ' kembali.');
  }catch(e){
    console.error(e);
    alert("Gagal mereset data. Silakan coba lagi.");
  }
}

function exportCSV(){
  if(!lastReportRows.length){ alert("Tidak ada data untuk diunduh."); return; }
  var csv = "Nama,Kelas,Jenis,Skor,Benar,Total,Pelanggaran,Waktu\n";
  lastReportRows.forEach(function(r){
    csv += '"' + titleCase(r.name) + '","' + (r.kelas || '') + '","' + (r.type==='pretest'?'Pretest':'Posttest') + '",' + r.score + ',' + r.correct + ',' + r.total + ',' + (r.violations||0) + ',"' + new Date(r.submitted_at).toLocaleString('id-ID') + '"\n';
  });
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "rekap_evaluasi_" + SUBJECT + "_bab" + BAB_NUM + ".csv";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================
   ADMIN TIMER SETTINGS
   ========================================================= */
async function loadAdminTimerSettings(){
  if(!_supabase) return;
  try{
    var preRes = await _supabase.from('exam_settings').select('duration').eq('subject', SUBJECT).eq('bab', BAB_NUM).eq('type', 'pretest').maybeSingle();
    var postRes = await _supabase.from('exam_settings').select('duration').eq('subject', SUBJECT).eq('bab', BAB_NUM).eq('type', 'posttest').maybeSingle();
    var preDur = (preRes.data && preRes.data.duration) ? preRes.data.duration : 0;
    var postDur = (postRes.data && postRes.data.duration) ? postRes.data.duration : 0;
    $("admin-timer-pre").value = preDur;
    $("admin-timer-post").value = postDur;
    updateAdminTimerStatus('pre');
    updateAdminTimerStatus('post');
  }catch(e){
    console.warn("Gagal memuat pengaturan timer admin:", e.message);
  }
}

function updateAdminTimerStatus(type){
  var input = $(type === 'pre' ? 'admin-timer-pre' : 'admin-timer-post');
  var status = $(type === 'pre' ? 'admin-timer-pre-status' : 'admin-timer-post-status');
  var val = parseInt(input.value) || 0;
  if(val > 0){
    status.textContent = 'Timer aktif: ' + val + ' menit';
    status.className = 'status on';
  } else {
    status.textContent = 'Tanpa batas waktu';
    status.className = 'status';
  }
}

async function saveAdminTimerSettings(){
  if(!_supabase){ alert("Supabase tidak tersedia."); return; }
  var preDur = Math.max(0, parseInt($("admin-timer-pre").value) || 0);
  var postDur = Math.max(0, parseInt($("admin-timer-post").value) || 0);
  try{
    await _supabase.from('exam_settings').upsert(
      { subject: SUBJECT, bab: BAB_NUM, type: 'pretest', duration: preDur, updated_at: new Date().toISOString() },
      { onConflict: 'subject,bab,type' }
    );
    await _supabase.from('exam_settings').upsert(
      { subject: SUBJECT, bab: BAB_NUM, type: 'posttest', duration: postDur, updated_at: new Date().toISOString() },
      { onConflict: 'subject,bab,type' }
    );
    alert('Pengaturan timer berhasil disimpan!');
  }catch(e){
    console.error(e);
    alert('Gagal menyimpan pengaturan timer: ' + e.message);
  }
}

/* =========================================================
   JALANKAN
   ========================================================= */
init();
