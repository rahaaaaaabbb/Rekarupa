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
