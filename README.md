Kegunaan dan Fitur Utama AplikasiManajemen Logistik dan Transaksi: Aplikasi ini digunakan untuk mencatat dan memantau pergerakan stok barang, baik barang masuk (restock) maupun barang keluar (penjualan kasir).
Hak Akses Berbasis Peran (RBAC): Sistem ini membagi pengguna menjadi dua peran, yaitu Admin dan Owner.
Analitik Finansial: Untuk pengguna dengan peran Owner, aplikasi akan menampilkan kalkulasi laba bersih, pendapatan kotor, pengeluaran modal, serta grafik komparasi secara detail. 
Pengguna dengan peran Admin hanya diberikan akses ke fitur mesin kasir dan ringkasan total penjualan harian untuk menjaga privasi finansial. 

Framework dan Arsitektur IntiFrontend Framework: Dibangun menggunakan Next.js (versi 16.2.4) yang berjalan di atas ekosistem React (versi 19.2.4). 

Proyek ini menggunakan arsitektur App Router modern (direktori app/).   

Database: Menggunakan relasional database MySQL yang mencakup tabel log_transaksi, pengguna, stok_barang, dan transaksi_operasional.   

Komunikasi Data: Menggunakan Axios untuk melakukan pengambilan data (HTTP Requests) ke server backend yang beroperasi secara lokal pada http://localhost:5000.   
Manajemen State Global: Menggunakan React Context API (AppContext.tsx) untuk menyimpan state sementara di sisi klien, seperti data sesi pengguna, keranjang stok, dan daftar transaksi.   

Tools dan Pustaka Pendukung (Libraries)Desain Antarmuka (Styling): Menggunakan Tailwind CSS v4 untuk menyusun antarmuka secara responsif. 

Desainnya banyak mengimplementasikan gaya Glassmorphism (elemen tembus pandang dengan efek blur) dan gradien warna.   
Elemen Visual 3D: Halaman login memanfaatkan Spline (@splinetool/react-spline) untuk menampilkan latar belakang 3D yang interaktif. 

Proyek ini juga memuat Three.js, React Three Fiber, dan Drei untuk komponen render kanvas 3D lainnya.  

Visualisasi Data: Mengandalkan Chart.js (melalui integrasi react-chartjs-2) untuk merender grafik analitik operasional interaktif pada halaman dasbor utama.   
Animasi dan Interaksi: Menggunakan Lenis (@studio-freight/lenis) untuk memanipulasi gulungan halaman web agar terasa sangat halus (smooth scrolling). 
Proyek ini juga memuat GSAP untuk potensi kebutuhan animasi tingkat lanjut.


1. Persiapan Kebutuhan Sistem

Pastikan Node.js (versi LTS terbaru) sudah terinstal di komputer Anda untuk menjalankan lingkungan React/Next.js.

Pasang server database MySQL. Anda bisa menggunakan perangkat lunak praktis seperti XAMPP, Laragon, atau MySQL bawaan.

Siapkan source code aplikasi (terdiri dari folder frontend dan backend).

2. Konfigurasi Database

Jalankan layanan MySQL di komputer Anda.

Buat database baru (misalnya reka_rupa_db) menggunakan phpMyAdmin atau terminal MySQL.

Impor file struktur database (biasanya berformat .sql) yang disertakan dalam source code untuk membuat tabel yang dibutuhkan: log_transaksi, pengguna, stok_barang, dan transaksi_operasional.

3. Instalasi dan Menjalankan Backend

Buka terminal/Command Prompt dan arahkan ke direktori folder backend.

Sesuaikan file .env untuk menghubungkan backend dengan database MySQL yang baru dibuat (atur nama database, user, dan password).

Ketik perintah npm install lalu tekan Enter untuk mengunduh semua dependensi server.

Jalankan server dengan perintah npm start atau npm run dev. Pastikan indikator terminal menunjukkan backend berhasil berjalan di http://localhost:5000.

4. Instalasi dan Menjalankan Frontend (Next.js)

Buka jendela terminal baru dan arahkan ke direktori folder frontend.

Jika ada file .env.local atau .env, pastikan variabel lingkungan untuk API sudah mengarah ke lokal: NEXT_PUBLIC_API_URL=http://localhost:5000.

Ketik perintah npm install untuk memasang semua pustaka pendukung seperti Next.js 16, Tailwind CSS v4, Axios, Three.js, dan Chart.js.

Setelah instalasi selesai, jalankan antarmuka klien dengan perintah npm run dev.

5. Mengakses Aplikasi

Buka web browser (Chrome/Firefox/Edge).

Akses alamat http://localhost:3000 (port default pengembangan Next.js).

Anda akan diarahkan ke halaman login interaktif dengan elemen 3D Spline, siap digunakan dengan akun berbasis peran (Admin/Owner) yang ada di database.
