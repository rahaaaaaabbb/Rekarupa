// src/components/charts/RingkasanChart.tsx
"use client";
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend
} from 'chart.js';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext'; // Mengimpor Global Context

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RingkasanChart() {
  const [chartData, setChartData] = useState<any>(null);
  const { role } = useAppContext(); // Mengambil role pengguna aktif

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/laporan/ringkasan');
        const apiData = response.data.data;

        // 1. Data Base (Selalu di-render untuk semua role)
        const datasets = [
          {
            label: 'Pemasukan (Barang Keluar)',
            data: apiData.map((item: any) => item.total_pendapatan),
            backgroundColor: '#10b981', // Hijau
            borderRadius: 4,
          }
        ];

        // 2. Kondisional Keamanan Rendering (Hanya jika role === 'owner')
        // Algoritma akan mendorong (push) data rahasia finansial ke dalam grafik
        if (role === 'owner') {
          datasets.push(
            {
              label: 'Pengeluaran (Barang Masuk)',
              data: apiData.map((item: any) => item.total_pengeluaran),
              backgroundColor: '#f43f5e', // Merah
              borderRadius: 4,
            },
            {
              label: 'Laba / Profit Bersih',
              data: apiData.map((item: any) => item.profit_bersih),
              backgroundColor: '#6366f1', // Biru
              borderRadius: 4,
            }
          );
        }

        setChartData({
          labels: apiData.map((item: any) => item.kategori_layanan),
          datasets: datasets
        });
      } catch (error) {
        console.error("Gagal mengambil data operasional:", error);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);

  }, [role]); // Parameter dependensi: Grafik di-render ulang jika role berubah

  if (!chartData) return (
    <div className="flex h-full items-center justify-center animate-pulse text-slate-400 font-medium">
        Menghitung algoritma visualisasi...
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full w-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-extrabold text-slate-800">Analitik Operasional</h3>
        <p className="text-sm text-slate-500 font-medium">
          {role === 'owner' 
            ? 'Komparasi Pemasukan, Pengeluaran, dan Profit per Kategori' 
            : 'Akumulasi Pemasukan Transaksi Kasir per Kategori'
          }
        </p>
      </div>
      
      <div className="relative flex-grow w-full min-h-[250px]">
        <Bar 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) { label += ': '; }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
          }} 
        />
      </div>
    </div>
  );
}