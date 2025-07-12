# OrchidCare 🌿

**OrchidCare** adalah aplikasi mobile berbasis React Native yang digunakan untuk memantau pertumbuhan tanaman anggrek menggunakan data dari sensor IoT. Sistem ini mendukung tampilan grafik, notifikasi, dan evaluasi pertumbuhan berbasis fuzzy logic.

## 🗂️ Struktur Direktori

```
Orchidcare-Final-master/
├── app/                     # Struktur navigasi dan state manajemen
│   ├── (tabs)/             # Halaman utama (Charts, Logs, Notification, dsb.)
│   └── features/           # Redux slice untuk homepage
├── assets/                 # Gambar ikon, splashscreen, dan aset visual
├── components/             # Komponen UI yang dapat digunakan ulang
│   └── charts/             # Komponen grafik suhu, kelembapan, dll
├── constants/              # Konstanta global (warna, tema, dsb.)
├── hook/                   # Custom hooks (e.g., realtime data)
├── lib/                    # Koneksi ke Supabase
├── utils/                  # Fuzzy logic, notifikasi, dan utils lainnya
├── global.css              # Styling global
├── package.json            # Konfigurasi dependencies
├── app.json, eas.json      # Konfigurasi Expo
└── readme.txt              # Catatan tambahan (tidak terformat sebagai README)
```

## 🚀 Instalasi & Setup

Pastikan sudah menginstal [Node.js](https://nodejs.org/) dan [Expo CLI](https://docs.expo.dev/workflow/expo-cli/).

```bash
# Clone repository
git clone https://github.com/krisnawandhana/Orchidcare-Final.git
cd Orchidcare-Final

# Install dependencies
npm install

# Jalankan aplikasi
npx expo start
```

## 🧠 Fitur Utama

- 📈 **Monitoring Tanaman**  
  Menampilkan grafik real-time suhu, kelembapan, intensitas cahaya, dan nilai pertumbuhan.

- 🔔 **Notifikasi**  
  Sistem notifikasi berbasis local notification.

- 🤖 **Fuzzy Logic Evaluation**  
  Menggunakan fuzzy logic untuk memberikan rekomendasi berdasarkan status suhu, kelembapan, dan cahaya.

- 💬 **Chatbot**  
  Bot responsif untuk konsultasi atau interaksi pengguna (menggunakan gambar bot/icon).

## 🔍 Modul Penting

### `/utils/fuzzyLogic.js`

- `calculateEfficiency(volt, ampere)`  
  Menghitung efisiensi daya listrik menggunakan metode fuzzy.

### `/components/charts/`

- `TemperatureChart.jsx`, `HumidityChart.jsx`, `LightChart.jsx`  
  Menampilkan grafik berdasarkan data realtime dari Supabase.

### `/hook/useRealtime.js`

- Hook untuk mengambil data real-time dari Supabase berdasarkan ID individu.

### `/app/features/homepageSlice.js`

- Mengatur state global (Redux) untuk data sensor dan user interface.

## 🧪 Contoh Tampilan

- Dashboard: Menampilkan semua parameter sensor secara visual.
- Logs: Riwayat nilai pengukuran.
- Notification: Riwayat peringatan dan notifikasi.
- Charts: Grafik suhu, cahaya, kelembapan, dan skor pertumbuhan.

## 🤝 Kontribusi

Ingin menyumbang? Berikut langkah mudahnya:

```bash
# Fork project
# Buat branch baru
git checkout -b fitur-baru

# Commit perubahan
git commit -m "Menambahkan fitur baru"

# Push ke branch
git push origin fitur-baru

# Buat Pull Request
```

## 📜 Lisensi

Proyek ini bersifat open-source. Gunakan sesuai kebutuhan riset, edukasi, dan pengembangan.
