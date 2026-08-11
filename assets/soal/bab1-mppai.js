/* Bank soal BAB I MPP AI — Kecerdasan Buatan (AI) dalam Desain */
window.EXAM_CONFIG = {
  bab: 1,
  subject: "mppai",
  judul: "Kecerdasan Buatan (AI) dalam Desain",
  babLabel: "I",
  useKelas: true,
  kelasOptions: ["XI DKV 1", "XI DKV 2", "XI DKV 3", "XI DKV 4"],
  mediaKind: "svg",
  sumber: "Ilustrasi konsep - Materi Pertemuan 1: Pengenalan AI dalam Desain",
  media: {
timeline:`<svg viewBox="0 0 700 320" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#ff3ea5"/></linearGradient></defs>
  <line x1="40" y1="160" x2="660" y2="160" stroke="rgba(238,241,251,0.15)" stroke-width="2"/>
  <circle cx="75" cy="160" r="6" fill="#00e5ff"/><text x="75" y="135" text-anchor="middle" fill="#00e5ff" font-size="10" font-weight="600">1956</text><text x="75" y="185" text-anchor="middle" fill="rgba(238,241,251,0.6)" font-size="8">Dartmouth</text>
  <circle cx="195" cy="160" r="6" fill="#8b5cf6"/><text x="195" y="135" text-anchor="middle" fill="#8b5cf6" font-size="10" font-weight="600">1980-90</text><text x="195" y="185" text-anchor="middle" fill="rgba(238,241,251,0.6)" font-size="8">AI Winter</text>
  <circle cx="315" cy="160" r="6" fill="#00e5ff"/><text x="315" y="135" text-anchor="middle" fill="#00e5ff" font-size="10" font-weight="600">2012</text><text x="315" y="185" text-anchor="middle" fill="rgba(238,241,251,0.6)" font-size="8">Deep Learning</text>
  <circle cx="420" cy="160" r="6" fill="#8b5cf6"/><text x="420" y="135" text-anchor="middle" fill="#8b5cf6" font-size="10" font-weight="600">2014</text><text x="420" y="185" text-anchor="middle" fill="rgba(238,241,251,0.6)" font-size="8">GAN</text>
  <circle cx="540" cy="160" r="8" fill="url(#tg)"/><text x="540" y="135" text-anchor="middle" fill="#ff3ea5" font-size="10" font-weight="600">2020-an</text><text x="540" y="185" text-anchor="middle" fill="rgba(238,241,251,0.6)" font-size="8">AI Generatif</text>
  <text x="350" y="260" text-anchor="middle" fill="rgba(238,241,251,0.35)" font-size="9" font-style="italic">Sejarah Perkembangan Artificial Intelligence</text>
</svg>`,

compare:`<svg viewBox="0 0 660 260" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <rect x="20" y="20" width="290" height="200" rx="12" fill="none" stroke="#00e5ff" stroke-width="1.5" opacity="0.5"/>
  <text x="165" y="55" text-anchor="middle" fill="#00e5ff" font-size="12" font-weight="700">AI Konvensional</text>
  <text x="45" y="85" fill="rgba(238,241,251,0.7)" font-size="9">• Berbasis aturan (if-then)</text>
  <text x="45" y="105" fill="rgba(238,241,251,0.7)" font-size="9">• Klasifikasi data berlabel</text>
  <text x="45" y="125" fill="rgba(238,241,251,0.7)" font-size="9">• Hasil deterministik</text>
  <text x="45" y="145" fill="rgba(238,241,251,0.7)" font-size="9">• Contoh: Expert System</text>
  <text x="165" y="190" text-anchor="middle" fill="#00e5ff" font-size="10" font-weight="600">Input → Output tetap</text>
  <rect x="350" y="20" width="290" height="200" rx="12" fill="none" stroke="#ff3ea5" stroke-width="1.5" opacity="0.5"/>
  <text x="495" y="55" text-anchor="middle" fill="#ff3ea5" font-size="12" font-weight="700">AI Generatif</text>
  <text x="375" y="85" fill="rgba(238,241,251,0.7)" font-size="9">• Menghasilkan konten baru</text>
  <text x="375" y="105" fill="rgba(238,241,251,0.7)" font-size="9">• Berbasis probabilitas</text>
  <text x="375" y="125" fill="rgba(238,241,251,0.7)" font-size="9">• Hasil variatif</text>
  <text x="375" y="145" fill="rgba(238,241,251,0.7)" font-size="9">• Contoh: GAN, Diffusion, LLM</text>
  <text x="495" y="190" text-anchor="middle" fill="#ff3ea5" font-size="10" font-weight="600">Prompt → Konten baru</text>
</svg>`,

diffusion:`<svg viewBox="0 0 700 280" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <text x="350" y="30" text-anchor="middle" fill="#00e5ff" font-size="13" font-weight="700">Diffusion Model</text>
  <text x="180" y="60" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="9">Forward Diffusion (Training)</text>
  <text x="540" y="60" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="9">Reverse Diffusion (Generate)</text>
  <rect x="60" y="80" width="50" height="50" rx="6" fill="none" stroke="#00e5ff" stroke-width="1.2" opacity="0.8"/>
  <text x="85" y="106" text-anchor="middle" fill="#00e5ff" font-size="7">Gambar</text>
  <text x="85" y="118" text-anchor="middle" fill="#00e5ff" font-size="7">Asli</text>
  <text x="70" y="145" fill="rgba(238,241,251,0.3)" font-size="7">t=0</text>
  <line x1="110" y1="105" x2="150" y2="105" stroke="rgba(238,241,251,0.2)" stroke-width="1.5" marker-end="url(#a)"/>
  <text x="135" y="96" text-anchor="middle" fill="rgba(238,241,251,0.3)" font-size="7">+ noise</text>
  <rect x="155" y="80" width="50" height="50" rx="6" fill="none" stroke="#00e5ff" stroke-width="1" opacity="0.4"/>
  <line x1="205" y1="105" x2="245" y2="105" stroke="rgba(238,241,251,0.2)" stroke-width="1.5"/>
  <rect x="250" y="80" width="50" height="50" rx="6" fill="none" stroke="#00e5ff" stroke-width="0.8" opacity="0.2"/>
  <line x1="300" y1="105" x2="330" y2="105" stroke="rgba(238,241,251,0.2)" stroke-width="1.5"/>
  <rect x="335" y="75" width="60" height="60" rx="6" fill="rgba(255,62,165,0.08)" stroke="#ff3ea5" stroke-width="1.2"/>
  <text x="365" y="106" text-anchor="middle" fill="#ff3ea5" font-size="7">Noise</text>
  <text x="365" y="118" text-anchor="middle" fill="#ff3ea5" font-size="7">Murni</text>
  <text x="350" y="145" fill="rgba(238,241,251,0.3)" font-size="7">t=T</text>
  <line x1="365" y1="75" x2="365" y2="240" stroke="rgba(238,241,251,0.15)" stroke-width="1" stroke-dasharray="4"/>
  <text x="365" y="260" text-anchor="middle" fill="rgba(238,241,251,0.25)" font-size="8">Proses Denoising Bertahap (puluhan-ratusan langkah)</text>
  <rect x="460" y="75" width="60" height="60" rx="6" fill="rgba(255,62,165,0.08)" stroke="#ff3ea5" stroke-width="1.2"/>
  <text x="490" y="106" text-anchor="middle" fill="#ff3ea5" font-size="7">Noise</text>
  <text x="490" y="118" text-anchor="middle" fill="#ff3ea5" font-size="7">Murni</text>
  <text x="475" y="145" fill="rgba(238,241,251,0.3)" font-size="7">t=T</text>
  <line x1="520" y1="105" x2="558" y2="105" stroke="rgba(238,241,251,0.2)" stroke-width="1.5"/>
  <text x="545" y="96" text-anchor="middle" fill="rgba(238,241,251,0.3)" font-size="7">denoise</text>
  <rect x="565" y="80" width="50" height="50" rx="6" fill="none" stroke="#ff3ea5" stroke-width="1" opacity="0.4"/>
  <line x1="615" y1="105" x2="640" y2="105" stroke="rgba(238,241,251,0.2)" stroke-width="1.5"/>
  <rect x="645" y="80" width="50" height="50" rx="6" fill="none" stroke="#ff3ea5" stroke-width="1.2" opacity="0.8"/>
  <text x="670" y="106" text-anchor="middle" fill="#ff3ea5" font-size="7">Gambar</text>
  <text x="670" y="118" text-anchor="middle" fill="#ff3ea5" font-size="7">Baru</text>
  <text x="655" y="145" fill="rgba(238,241,251,0.3)" font-size="7">t=0</text>
  <text x="365" y="280" text-anchor="middle" fill="rgba(238,241,251,0.2)" font-size="8">Text Encoder → Prompt Embedding → Panduan Denoising</text>
</svg>`,

gan:`<svg viewBox="0 0 660 280" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <text x="330" y="30" text-anchor="middle" fill="#00e5ff" font-size="13" font-weight="700">Generative Adversarial Network (GAN)</text>
  <rect x="40" y="55" width="130" height="80" rx="10" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1.5"/>
  <text x="105" y="88" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="600">Generator (G)</text>
  <text x="105" y="108" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Noise → Gambar Palsu</text>
  <text x="105" y="122" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Menciptakan gambar</text>
  <rect x="250" y="55" width="130" height="80" rx="10" fill="rgba(255,62,165,0.06)" stroke="#ff3ea5" stroke-width="1.5"/>
  <text x="315" y="88" text-anchor="middle" fill="#ff3ea5" font-size="11" font-weight="600">Discriminator (D)</text>
  <text x="315" y="108" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Membedakan Asli/Palsu</text>
  <text x="315" y="122" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Memberi umpan balik</text>
  <line x1="170" y1="95" x2="250" y2="95" stroke="rgba(238,241,251,0.25)" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="210" y="84" text-anchor="middle" fill="rgba(238,241,251,0.35)" font-size="7">gambar palsu</text>
  <path d="M280 135 L280 170 L105 170 L105 135" fill="none" stroke="#ff3ea5" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.6"/>
  <text x="195" y="187" text-anchor="middle" fill="#ff3ea5" font-size="8">Umpan balik (loss) → backpropagation</text>
  <rect x="460" y="55" width="100" height="80" rx="10" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" stroke-width="1.5"/>
  <text x="510" y="88" text-anchor="middle" fill="#8b5cf6" font-size="11" font-weight="600">Data Asli</text>
  <text x="510" y="108" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Dataset</text>
  <text x="510" y="122" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Pelatihan</text>
  <line x1="380" y1="95" x2="460" y2="95" stroke="rgba(238,241,251,0.25)" stroke-width="1.5"/>
  <text x="420" y="84" text-anchor="middle" fill="rgba(238,241,251,0.35)" font-size="7">gambar asli</text>
  <text x="330" y="240" text-anchor="middle" fill="rgba(238,241,251,0.3)" font-size="9">Generator ↔ Discriminator saling bertanding hingga konvergen</text>
</svg>`,

daily:`<svg viewBox="0 0 660 260" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <text x="330" y="25" text-anchor="middle" fill="#00e5ff" font-size="13" font-weight="700">AI dalam Kehidupan Sehari-hari</text>
  <g transform="translate(30,45)">
    <rect width="90" height="70" rx="8" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1" opacity="0.7"/>
    <svg x="36" y="23" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    <text x="45" y="52" text-anchor="middle" fill="rgba(238,241,251,0.7)" font-size="8" font-weight="600">Rekomendasi</text>
    <text x="45" y="64" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="7">Musik/Video</text>
  </g>
  <g transform="translate(130,45)">
    <rect width="90" height="70" rx="8" fill="rgba(255,62,165,0.06)" stroke="#ff3ea5" stroke-width="1" opacity="0.7"/>
    <svg x="36" y="23" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3ea5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
    <text x="45" y="52" text-anchor="middle" fill="rgba(238,241,251,0.7)" font-size="8" font-weight="600">Voice Assistant</text>
    <text x="45" y="64" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="7">Siri/Google</text>
  </g>
  <g transform="translate(230,45)">
    <rect width="90" height="70" rx="8" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" stroke-width="1" opacity="0.7"/>
    <svg x="36" y="23" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
    <text x="45" y="52" text-anchor="middle" fill="rgba(238,241,251,0.7)" font-size="8" font-weight="600">Face Detection</text>
    <text x="45" y="64" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="7">Unlock HP</text>
  </g>
  <g transform="translate(330,45)">
    <rect width="90" height="70" rx="8" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1" opacity="0.7"/>
    <svg x="36" y="23" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    <text x="45" y="52" text-anchor="middle" fill="rgba(238,241,251,0.7)" font-size="8" font-weight="600">Navigasi</text>
    <text x="45" y="64" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="7">Google Maps</text>
  </g>
  <g transform="translate(430,45)">
    <rect width="90" height="70" rx="8" fill="rgba(255,62,165,0.06)" stroke="#ff3ea5" stroke-width="1" opacity="0.7"/>
    <svg x="36" y="23" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3ea5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    <text x="45" y="52" text-anchor="middle" fill="rgba(238,241,251,0.7)" font-size="8" font-weight="600">Spam Filter</text>
    <text x="45" y="64" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="7">Email</text>
  </g>
  <g transform="translate(530,45)">
    <rect width="90" height="70" rx="8" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" stroke-width="1" opacity="0.7"/>
    <svg x="36" y="23" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>
    <text x="45" y="52" text-anchor="middle" fill="rgba(238,241,251,0.7)" font-size="8" font-weight="600">Predictive Text</text>
    <text x="45" y="64" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="7">Keyboard AI</text>
  </g>
  <text x="330" y="175" text-anchor="middle" fill="rgba(238,241,251,0.25)" font-size="8">AI telah meresap ke berbagai aspek kehidupan sehari-hari tanpa disadari</text>
  <text x="330" y="195" text-anchor="middle" fill="rgba(238,241,251,0.2)" font-size="7">dari rekomendasi konten hingga keamanan dan produktivitas</text>
</svg>`,

platforms:`<svg viewBox="0 0 660 220" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <text x="330" y="25" text-anchor="middle" fill="#00e5ff" font-size="13" font-weight="700">Platform AI Generatif untuk Desain</text>
  <g transform="translate(30,55)">
    <rect width="130" height="100" rx="10" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1.2"/>
    <text x="65" y="38" text-anchor="middle" fill="#00e5ff" font-size="20" font-weight="800">MJ</text>
    <text x="65" y="58" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="600">Midjourney</text>
    <text x="65" y="75" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Discord-based</text>
    <text x="65" y="88" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Diffusion Model</text>
  </g>
  <g transform="translate(175,55)">
    <rect width="130" height="100" rx="10" fill="rgba(255,62,165,0.06)" stroke="#ff3ea5" stroke-width="1.2"/>
    <svg x="56" y="29" width="18" height="18" viewBox="0 0 24 24" fill="#ff3ea5" stroke="none"><path d="M12 2c.8 4.5 3.5 7.2 8 8-4.5.8-7.2 3.5-8 8-.8-4.5-3.5-7.2-8-8 4.5-.8 7.2-3.5 8-8z"/></svg>
    <text x="65" y="58" text-anchor="middle" fill="#ff3ea5" font-size="11" font-weight="600">Leonardo AI</text>
    <text x="65" y="75" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Web-based</text>
    <text x="65" y="88" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Diffusion Model</text>
  </g>
  <g transform="translate(320,55)">
    <rect width="130" height="100" rx="10" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" stroke-width="1.2"/>
    <svg x="56" y="29" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
    <text x="65" y="58" text-anchor="middle" fill="#8b5cf6" font-size="11" font-weight="600">Adobe Firefly</text>
    <text x="65" y="75" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Photoshop-integ.</text>
    <text x="65" y="88" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Diffusion Model</text>
  </g>
  <g transform="translate(465,55)">
    <rect width="130" height="100" rx="10" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1.2"/>
    <svg x="56" y="29" width="18" height="18" viewBox="0 0 24 24" fill="#00e5ff" stroke="none"><path d="M12 4l8 8-8 8-8-8z"/></svg>
    <text x="65" y="58" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="600">Canva AI</text>
    <text x="65" y="75" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">All-in-one</text>
    <text x="65" y="88" text-anchor="middle" fill="rgba(238,241,251,0.4)" font-size="8">Magic Studio</text>
  </g>
  <text x="330" y="195" text-anchor="middle" fill="rgba(238,241,251,0.2)" font-size="8">Mayoritas platform berbasis Diffusion Model (2024-2026)</text>
</svg>`,

prompt:`<svg viewBox="0 0 660 200" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <text x="330" y="25" text-anchor="middle" fill="#00e5ff" font-size="13" font-weight="700">Prompt Engineering — Alur Kerja AI Generatif</text>
  <rect x="40" y="55" width="140" height="80" rx="10" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1.5"/>
  <svg x="103" y="81" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  <text x="110" y="88" text-anchor="middle" fill="#00e5ff" font-size="11" font-weight="600">Prompt Teks</text>
  <text x="110" y="108" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">"Gambar kucing cyberpunk</text>
  <text x="110" y="122" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">dengan neon magenta..."</text>
  <line x1="180" y1="95" x2="240" y2="95" stroke="rgba(238,241,251,0.25)" stroke-width="2"/>
  <polygon points="235,90 245,95 235,100" fill="rgba(238,241,251,0.25)"/>
  <rect x="250" y="55" width="140" height="80" rx="10" fill="rgba(255,62,165,0.06)" stroke="#ff3ea5" stroke-width="1.5"/>
  <svg x="313" y="75" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3ea5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>
  <text x="320" y="82" text-anchor="middle" fill="#ff3ea5" font-size="11" font-weight="600">AI Model</text>
  <text x="320" y="102" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Diffusion / GAN</text>
  <text x="320" y="118" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Text Encoder</text>
  <text x="320" y="130" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">→ Embedding</text>
  <line x1="390" y1="95" x2="450" y2="95" stroke="rgba(238,241,251,0.25)" stroke-width="2"/>
  <polygon points="445,90 455,95 445,100" fill="rgba(238,241,251,0.25)"/>
  <rect x="460" y="55" width="150" height="80" rx="10" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" stroke-width="1.5"/>
  <svg x="528" y="81" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
  <text x="535" y="88" text-anchor="middle" fill="#8b5cf6" font-size="11" font-weight="600">Gambar Baru</text>
  <text x="535" y="108" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Hasil generatif</text>
  <text x="535" y="122" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">sesuai prompt</text>
  <text x="330" y="175" text-anchor="middle" fill="rgba(238,241,251,0.2)" font-size="8">Prompt yang baik = Deskripsi detail + Gaya + Konteks</text>
</svg>`,

role:`<svg viewBox="0 0 660 240" xmlns="http://www.w3.org/2000/svg" style="font-family:'Inter',sans-serif">
  <text x="330" y="25" text-anchor="middle" fill="#00e5ff" font-size="13" font-weight="700">Peran AI Generatif bagi Desainer DKV</text>
  <rect x="40" y="55" width="160" height="100" rx="12" fill="rgba(0,229,255,0.06)" stroke="#00e5ff" stroke-width="1.5"/>
  <svg x="110" y="75" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  <text x="120" y="108" text-anchor="middle" fill="#00e5ff" font-size="12" font-weight="600">Desainer DKV</text>
  <text x="120" y="125" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Kreativitas</text>
  <text x="120" y="140" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Konsep &amp; Kurasi</text>
  <line x1="100" y1="155" x2="200" y2="195" stroke="rgba(238,241,251,0.2)" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="140" y1="155" x2="300" y2="185" stroke="rgba(238,241,251,0.2)" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="260" y1="55" x2="200" y2="55" stroke="rgba(238,241,251,0.2)" stroke-width="1.5" stroke-dasharray="5,3"/>
  <rect x="270" y="55" width="160" height="100" rx="12" fill="rgba(255,62,165,0.06)" stroke="#ff3ea5" stroke-width="1.5"/>
  <svg x="340" y="75" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff3ea5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
  <text x="350" y="108" text-anchor="middle" fill="#ff3ea5" font-size="12" font-weight="600">AI Generatif</text>
  <text x="350" y="125" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Efisiensi</text>
  <text x="350" y="140" text-anchor="middle" fill="rgba(238,241,251,0.5)" font-size="8">Eksekusi Cepat</text>
  <line x1="370" y1="155" x2="410" y2="195" stroke="rgba(238,241,251,0.2)" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="350" y1="155" x2="350" y2="195" stroke="rgba(238,241,251,0.2)" stroke-width="1.5" stroke-dasharray="5,3"/>
  <rect x="230" y="185" width="200" height="40" rx="20" fill="rgba(139,92,246,0.1)" stroke="#8b5cf6" stroke-width="1.2"/>
  <svg x="324" y="204" width="12" height="12" viewBox="0 0 24 24" fill="#8b5cf6" stroke="none"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/></svg>
  <text x="330" y="210" text-anchor="middle" fill="#8b5cf6" font-size="10" font-weight="600">Kolaborasi: Alat Bantu, Bukan Pengganti</text>
</svg>`
  },
  soal: [
{q:"Kecerdasan Buatan (Artificial Intelligence/AI) adalah cabang ilmu komputer yang memungkinkan mesin...",o:["Meniru kemampuan berpikir manusia seperti mengenali pola dan mengambil keputusan","Hanya menjalankan instruksi tetap tanpa bisa berubah","Menyimpan data dalam jumlah besar tanpa diproses","Menggantikan seluruh pekerjaan manusia secara total"],a:0},
{q:"Istilah Artificial Intelligence pertama kali diperkenalkan pada Konferensi Dartmouth tahun 1956 oleh...",o:["Ian Goodfellow","John McCarthy","Alan Turing","Geoffrey Hinton"],a:1,img:"timeline"},
{q:"Periode 1980an\u20131990an dalam sejarah AI ditandai dengan istilah AI Winter karena...",o:["AI berkembang sangat pesat berkat internet","Munculnya GAN yang mengejutkan dunia","Mengalami masa stagnasi akibat keterbatasan komputasi","Ditemukannya Diffusion Model pertama"],a:2,img:"timeline"},
{q:"Deep Learning mulai mendominasi pada tahun 2012 setelah keberhasilan model...",o:["ChatGPT","AlexNet dalam kompetisi pengenalan gambar","DALL\u00b7E","Stable Diffusion"],a:1,img:"timeline"},
{q:"Generative Adversarial Network (GAN) diperkenalkan pada tahun 2014 oleh...",o:["John McCarthy","Ian Goodfellow","Sam Altman","Alan Turing"],a:1,img:"timeline"},
{q:"Ledakan AI Generatif pada era 2020an ditandai dengan menjadi arus utamanya...",o:["Sistem pakar berbasis aturan (expert system)","Model Diffusion dan Large Language Model (LLM)","Kalkulator elektronik","Basis data relasional"],a:1,img:"timeline"},
{q:"Berikut ini yang merupakan contoh penerapan AI dalam kehidupan sehari-hari adalah...",o:["Sistem rekomendasi pada aplikasi streaming musik dan video","Mesin ketik manual tanpa listrik","Kalkulator sederhana penjumlahan","Buku catatan fisik"],a:0,img:"daily"},
{q:"AI Generatif (Generative AI) adalah cabang AI yang mampu...",o:["Hanya mengklasifikasikan data tanpa menghasilkan apa pun","Menghasilkan (generate) konten baru seperti gambar, teks, musik, dan video","Menyimpan data mentah tanpa pengolahan","Menghapus data yang sudah tidak terpakai"],a:1},
{q:"Cara kerja AI Konvensional pada umumnya berbasis...",o:["Distribusi data berskala besar","Aturan (if-then) atau klasifikasi pola dari data berlabel","Proses denoising bertahap","Kompetisi dua jaringan saraf tiruan"],a:1,img:"compare"},
{q:"Contoh teknologi yang termasuk AI Konvensional adalah...",o:["GAN dan Diffusion Model","Large Language Model (LLM)","Expert System dan Chatbot rule-based","Midjourney dan Adobe Firefly"],a:2,img:"compare"},
{q:"Contoh teknologi yang termasuk AI Generatif adalah...",o:["Expert System","Model klasifikasi/prediksi sederhana","GAN, Diffusion Model, dan Large Language Model (LLM)","Kalkulator digital"],a:2,img:"compare"},
{q:"Sifat hasil dari AI Konvensional bersifat deterministik, artinya...",o:["Hasil berbeda meski input sama","Hasil sama untuk input yang sama","Hasil selalu berupa gambar","Hasil tidak dapat diprediksi"],a:1,img:"compare"},
{q:"Sifat hasil dari AI Generatif bersifat variatif/probabilistik, artinya...",o:["Hasil dapat berbeda meski prompt yang diberikan sama","Hasil selalu identik untuk prompt yang sama","Hasil tidak pernah berubah","Hasil hanya berupa angka"],a:0,img:"compare"},
{q:"Contoh penerapan AI Konvensional dalam bidang desain adalah...",o:["Membuat ilustrasi baru dari deskripsi teks","Software yang otomatis meluruskan objek atau memberi peringatan resolusi rendah","Menciptakan variasi mockup produk","Menghasilkan musik latar orisinal"],a:1},
{q:"Diffusion Model adalah arsitektur AI generatif yang paling banyak digunakan pada platform desain seperti...",o:["Midjourney, Stable Diffusion, dan Adobe Firefly","Microsoft Excel dan Word","Photoshop versi lama tanpa AI","Aplikasi pengolah kata biasa"],a:0,img:"diffusion"},
{q:"Proses Forward Diffusion pada saat pelatihan bekerja dengan cara...",o:["Menghasilkan gambar akhir yang jelas","Menambahkan noise secara bertahap hingga gambar berubah total menjadi noise murni","Mengubah teks menjadi suara","Menggabungkan dua gambar berbeda"],a:1,img:"diffusion"},
{q:"Proses Reverse Diffusion saat menghasilkan gambar baru dimulai dari...",o:["Gambar yang sudah jadi dan sempurna","Sebuah gambar berisi noise/piksel acak sepenuhnya","Teks murni tanpa gambar","Data suara pengguna"],a:1,img:"diffusion"},
{q:"Pada proses Reverse Diffusion, prompt teks pengguna diubah menjadi representasi numerik (embedding) oleh...",o:["Discriminator","Text encoder","Generator","Ruler tool"],a:1,img:"diffusion"},
{q:"Pada Reverse Diffusion, langkah denoising (mengurangi noise sedikit demi sedikit) umumnya diulang sebanyak...",o:["Hanya satu kali langsung selesai","Puluhan hingga ratusan kali secara bertahap","Ribuan tahun proses manual","Tidak pernah diulang"],a:1,img:"diffusion"},
{q:"Generative Adversarial Network (GAN) terdiri dari dua jaringan saraf tiruan yang saling bertanding, yaitu...",o:["Encoder dan Decoder","Generator dan Discriminator","Input Layer dan Output Layer","Prompt dan Embedding"],a:1,img:"gan"},
{q:"Tugas Generator dalam arsitektur GAN adalah...",o:["Membedakan gambar asli dan palsu","Menciptakan gambar baru dari noise acak agar menyerupai data asli","Menghitung akurasi model","Menyimpan data pelatihan"],a:1,img:"gan"},
{q:"Tugas Discriminator dalam arsitektur GAN adalah...",o:["Menciptakan gambar baru dari noise","Membedakan mana gambar asli (data pelatihan) dan mana gambar palsu buatan Generator","Menambahkan noise ke gambar","Mengubah prompt menjadi embedding"],a:1,img:"gan"},
{q:"Jika Discriminator berhasil mengenali gambar palsu buatan Generator, maka Generator akan menerima umpan balik berupa...",o:["Hadiah berupa data tambahan","Nilai kesalahan (loss) yang besar untuk memperbarui bobot melalui backpropagation","Perintah untuk berhenti bekerja","Gambar asli baru secara langsung"],a:1,img:"gan"},
{q:"Proses tarik-menarik antara Generator dan Discriminator berulang terus-menerus hingga...",o:["Generator berhenti bekerja sama sekali","Generator mampu menghasilkan gambar yang sangat sulit dibedakan dari gambar asli","Discriminator dihapus dari sistem","Data pelatihan habis digunakan"],a:1,img:"gan"},
{q:"Perbedaan utama GAN dengan Diffusion Model dari segi jumlah jaringan yang bersaing adalah...",o:["GAN menggunakan dua jaringan yang bersaing (Generator vs Discriminator), Diffusion Model tidak","Diffusion Model menggunakan dua jaringan yang bersaing, GAN tidak","Keduanya sama-sama tidak memiliki jaringan yang bersaing","Keduanya sama-sama menggunakan tiga jaringan"],a:0},
{q:"Proses denoising bertahap merupakan ciri khas dari...",o:["GAN","Diffusion Model","Expert System","Chatbot rule-based"],a:1},
{q:"Berdasarkan materi, platform AI generatif yang lebih banyak digunakan pada rentang 2024\u20132026 adalah yang berbasis...",o:["GAN, karena lebih modern","Diffusion Model, karena mayoritas platform saat ini menggunakannya","Expert System, karena paling stabil","Tidak ada yang dominan"],a:1},
{q:"Kemampuan GAN dalam memahami prompt teks dibandingkan Diffusion Model tergolong...",o:["Lebih unggul dan otomatis tanpa tambahan apa pun","Terbatas, umumnya perlu arsitektur tambahan","Sama persis dengan Diffusion Model","GAN tidak pernah bisa diberi prompt"],a:1},
{q:"Berikut ini yang termasuk contoh platform AI generatif untuk desain adalah...",o:["Midjourney, Leonardo AI, dan Adobe Firefly","Microsoft Word dan Excel","WhatsApp dan Telegram","Windows Explorer"],a:0,img:"platforms"},
{q:"Prompt engineering dalam konteks AI generatif untuk desain berarti...",o:["Memperbaiki perangkat keras komputer","Menerapkan prinsip dasar penyusunan instruksi teks agar menghasilkan gambar sesuai kebutuhan desain","Menghapus riwayat penggunaan aplikasi","Menginstal ulang sistem operasi"],a:1,img:"prompt"},
{q:"Menurut materi, peran AI generatif bagi seorang desainer DKV di masa depan sebaiknya dipahami sebagai...",o:["Pengganti penuh peran desainer manusia","Alat bantu (tool) bagi desainer, bukan pengganti","Ancaman yang harus dihindari sepenuhnya","Hal yang tidak relevan dengan dunia desain"],a:1,img:"role"}
  ]
};
