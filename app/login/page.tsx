"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk melacak fokus input (Untuk Animasi Maskot)
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const controls = useAnimation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/");
      } else {
        setError(data.message || "Gagal login, periksa kembali data Anda.");
        controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
      controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
    } finally {
      setIsLoading(false);
    }
  };

  // Kalkulasi pergerakan mata maskot (melirik mengikuti ketikan username)
  // Semakin panjang teks, pupil akan bergerak sedikit ke kanan
  const pupilX = isUsernameFocused ? Math.min(username.length * 0.5, 5) : 0;
  // Mata akan melihat ke bawah jika username atau password sedang diisi
  const pupilY = (isUsernameFocused || isPasswordFocused) ? 4 : 8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center p-4 text-gray-800 overflow-hidden perspective-1000">
      
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div 
          animate={controls} 
          className="bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
        >
          <div className="flex flex-col items-center mb-6">
            
            {/* AREA MASKOT INTERAKTIF (Security Bot) */}
            <div className="relative w-28 h-28 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full mb-4 flex items-center justify-center border-4 border-white shadow-lg shadow-blue-100/50 overflow-hidden">
              
              {/* Mata Maskot */}
              <div className="flex gap-3 relative z-10">
                {/* Mata Kiri */}
                <div className="w-6 h-8 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                  <motion.div
                    animate={{ x: isPasswordFocused ? 0 : pupilX, y: pupilY }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-3 h-3 bg-gray-800 rounded-full"
                  />
                </div>
                {/* Mata Kanan */}
                <div className="w-6 h-8 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden border border-gray-100">
                  <motion.div
                    animate={{ x: isPasswordFocused ? 0 : pupilX, y: pupilY }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-3 h-3 bg-gray-800 rounded-full"
                  />
                </div>
              </div>

              {/* Tangan Kiri Maskot (Menutup mata) */}
              <motion.div
                initial="idle"
                animate={isPasswordFocused ? "covering" : "idle"}
                variants={{
                  idle: { y: 100, x: -80, rotate: 0 },
                  covering: { y: -20, x: 2, rotate: 15 } // Naik dan miring ke dalam
                }}
                transition={{ type: "spring", stiffness: 150 }}
                className="absolute w-10 h-10 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full shadow-md z-20"
                style={{ bottom: 0, left: 0 }}
              />

              {/* Tangan Kanan Maskot (Menutup mata & Mengintip) */}
              <motion.div
                initial="idle"
                animate={isPasswordFocused ? (showPassword ? "peeking" : "covering") : "idle"}
                variants={{
                  idle: { y: 60, x: 20, rotate: 0 },
                  covering: { y: -20, x: -2, rotate: -15 }, // Naik dan miring ke dalam
                  peeking: { y: 45, x: 5, rotate: -5 } // Turun sedikit untuk mengintip
                }}
                transition={{ type: "spring", stiffness: 150 }}
                className="absolute w-10 h-10 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full shadow-md z-20"
                style={{ bottom: 0, right: 0 }}
              />
            </div>

            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              REKA RUPA
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">Sistem Pelaporan Operasional</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center font-medium">
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsUsernameFocused(true)}
                  onBlur={() => setIsUsernameFocused(false)}
                  className="w-full pl-11 pr-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                  placeholder="Masukan username akun"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full pl-11 pr-12 py-3 bg-white/70 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 font-medium shadow-sm"
                  placeholder="Masukkan sandi..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Masuk ke Dashboard"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}