// src/context/AppContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type InventoryItem = { id: number; nama: string; jenis: string; stok: number; harga: number; foto?: string };
type Transaction = { id: number; tanggal: string; tipe: 'Masuk' | 'Keluar'; item: string; qty: number; total: number; kasir: string };

interface AppContextType {
  role: 'admin' | 'owner' | null;
  setRole: (role: 'admin' | 'owner' | null) => void;
  username: string;
  setUsername: (name: string) => void;
  inventory: InventoryItem[];
  transactions: Transaction[];
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // 1. Initial state dikembalikan ke kosong agar Server (SSR) tenang
  const [role, setRole] = useState<'admin' | 'owner' | null>(null);
  const [username, setUsername] = useState<string>('');
  
  // FITUR BARU: State penahan Hydration
  const [isMounted, setIsMounted] = useState(false);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // 2. Baca localStorage murni di dalam useEffect (Hanya berjalan di Client/Browser)
  useEffect(() => {
    const storedRole = localStorage.getItem('role') as 'admin' | 'owner' | null;
    const storedUsername = localStorage.getItem('username');
    
    if (storedRole) setRole(storedRole);
    if (storedUsername) setUsername(storedUsername);
    
    // Beri sinyal bahwa client sudah siap dan data memori sudah sinkron
    setIsMounted(true);
  }, []);

  const refreshData = useCallback(async () => {
    if (!role) return;
    try {
      const resStok = await axios.get('http://localhost:5000/api/operasional/stok');
      const resLog = await axios.get('http://localhost:5000/api/operasional/transaksi');
      
      setInventory(resStok.data.data);
      setTransactions(resLog.data.data);
    } catch (error) {
      console.error("Gagal melakukan sinkronisasi data dengan server database", error);
    }
  }, [role]);

  useEffect(() => {
    if (isMounted) {
      refreshData();
    }
  }, [refreshData, isMounted]);

  // 3. CEGAH HYDRATION ERROR: Jangan render anak komponen apapun sampai client siap
  if (!isMounted) {
    return <div className="min-h-screen bg-slate-50"></div>; // Layar kosong rapi selama sepersekian milidetik
  }

  return (
    <AppContext.Provider value={{ role, setRole, username, setUsername, inventory, transactions, refreshData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
}