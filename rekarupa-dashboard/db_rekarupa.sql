-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2026 at 08:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_rekarupa`
--

-- --------------------------------------------------------

--
-- Table structure for table `log_transaksi`
--

CREATE TABLE `log_transaksi` (
  `id` int(11) NOT NULL,
  `tanggal_waktu` datetime DEFAULT current_timestamp(),
  `tipe` enum('Masuk','Keluar') NOT NULL,
  `id_barang` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `kasir` varchar(100) DEFAULT 'Sistem'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log_transaksi`
--

INSERT INTO `log_transaksi` (`id`, `tanggal_waktu`, `tipe`, `id_barang`, `qty`, `total`, `kasir`) VALUES
(1, '2026-04-24 16:09:12', 'Masuk', 2, 30, 60000.00, 'Sistem'),
(2, '2026-04-24 16:09:51', 'Masuk', 3, 30, 105000.00, 'Sistem'),
(3, '2026-04-25 16:11:33', 'Masuk', 4, 20, 300000.00, 'Sistem'),
(4, '2026-04-26 16:18:17', 'Keluar', 3, 5, 17500.00, 'Sistem'),
(5, '2026-04-28 16:18:28', 'Keluar', 2, 5, 10000.00, 'Sistem'),
(6, '2026-04-28 16:18:37', 'Keluar', 4, 2, 30000.00, 'Sistem'),
(7, '2026-04-24 16:23:17', 'Masuk', 5, 100, 25000.00, 'Sistem'),
(8, '2026-04-24 16:23:25', 'Keluar', 5, 10, 2500.00, 'Sistem'),
(9, '2026-04-24 16:25:56', 'Masuk', 6, 100, 50000.00, 'Sistem'),
(11, '2026-04-24 16:27:12', 'Masuk', 7, 100, 300000.00, 'Sistem'),
(12, '2026-04-24 16:47:07', 'Keluar', 7, 3, 9000.00, 'Sistem'),
(13, '2026-04-27 12:02:13', 'Keluar', 3, 3, 10500.00, 'Sistem'),
(16, '2026-04-27 12:15:32', 'Keluar', 3, 2, 7000.00, 'Sistem'),
(18, '2026-04-27 12:21:58', 'Keluar', 4, 5, 75000.00, 'Arif');

-- --------------------------------------------------------

--
-- Table structure for table `pengguna`
--

CREATE TABLE `pengguna` (
  `id_pengguna` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','owner') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengguna`
--

INSERT INTO `pengguna` (`id_pengguna`, `username`, `password`, `role`) VALUES
(1, 'dewi', '123', 'owner'),
(2, 'Arif', 'kasir123', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `stok_barang`
--

CREATE TABLE `stok_barang` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `jenis` enum('Material','Layanan') NOT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `harga` decimal(10,2) NOT NULL,
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stok_barang`
--

INSERT INTO `stok_barang` (`id`, `nama`, `jenis`, `stok`, `harga`, `foto`) VALUES
(1, 'Pulpen Matrix', 'Material', 15, 4000.00, '1777021038079.jpg'),
(2, 'Kertas HVS A4 75 gram SIDU Sinar Dunia', 'Material', 22, 2000.00, '1777021752904.jpg'),
(3, 'Pencil 2B', 'Material', 20, 3500.00, '1777021791062.jpg'),
(4, 'Sketch Book (Buku Gambar)', 'Material', 13, 15000.00, '1777021893423.jpg'),
(5, 'Fotocopy', 'Layanan', 90, 250.00, '1777022597142.jpg'),
(6, 'Hitam putih (BW) A4/F4 (Print)', 'Layanan', 85, 500.00, '1777022756366.jpg'),
(7, 'Print Warna A4 ', 'Layanan', 97, 3000.00, '1777022832189.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_operasional`
--

CREATE TABLE `transaksi_operasional` (
  `id_transaksi` int(11) NOT NULL,
  `tanggal_waktu` datetime NOT NULL,
  `kategori_layanan` enum('Fotocopy','Percetakan','Lainnya') NOT NULL,
  `keterangan_pekerjaan` text DEFAULT NULL,
  `kuantitas` int(11) NOT NULL,
  `total_pendapatan` decimal(10,2) NOT NULL,
  `status_pekerjaan` enum('Selesai','Dalam Proses') NOT NULL DEFAULT 'Selesai'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_barang` (`id_barang`);

--
-- Indexes for table `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id_pengguna`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `stok_barang`
--
ALTER TABLE `stok_barang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksi_operasional`
--
ALTER TABLE `transaksi_operasional`
  ADD PRIMARY KEY (`id_transaksi`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id_pengguna` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `stok_barang`
--
ALTER TABLE `stok_barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `transaksi_operasional`
--
ALTER TABLE `transaksi_operasional`
  MODIFY `id_transaksi` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `log_transaksi`
--
ALTER TABLE `log_transaksi`
  ADD CONSTRAINT `log_transaksi_ibfk_1` FOREIGN KEY (`id_barang`) REFERENCES `stok_barang` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
