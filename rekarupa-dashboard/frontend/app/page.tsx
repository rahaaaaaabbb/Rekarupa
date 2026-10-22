// src/app/page.tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Spline from '@splinetool/react-spline';

export default function LoginPage() {
  const [inputUsername, setInputUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  // State Preloader
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  const [is3DLoaded, setIs3DLoaded] = useState(false);

  const { setRole, setUsername: setContextUsername } = useAppContext(); 
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: inputUsername,
        password
      });

      if (response.data.status === 'success') {
        const { role, username } = response.data.data; 
        
        setRole(role); 
        setContextUsername(username); 
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
        sessionStorage.setItem('isNewLogin', 'true'); 

        setIsLoading(false);
        setIsSuccess(true); 

        setTimeout(() => setProgress(100), 100);
        setTimeout(() => setIsSlidingUp(true), 2000);
        setTimeout(() => router.push('/dashboard'), 2600);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('Kredensial tidak valid. Periksa kembali username & password.');
      } else {
        setError('Gagal terhubung ke server MySQL.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden flex flex-col lg:flex-row">
      
      {/* --- LAYAR PRELOADER TRANSISI --- */}
      {isSuccess && (
        <div className={`fixed inset-0 z-50 bg-indigo-950 flex flex-col items-center justify-center transition-transform duration-700 ease-in-out ${isSlidingUp ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className={`relative w-28 h-28 mb-8 flex items-center justify-center transition-opacity duration-300 ${isSlidingUp ? 'opacity-0' : 'opacity-100'}`}>
            <svg className="absolute -top-4 -right-2 w-10 h-10 text-violet-400 animate-bounce z-10 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            <svg className="w-24 h-24 text-indigo-500 animate-pulse drop-shadow-2xl" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div className={`text-center transition-opacity duration-300 ${isSlidingUp ? 'opacity-0' : 'opacity-100'}`}>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Menyiapkan Ruang Kerja...</h2>
            <p className="text-indigo-200 font-medium mb-10">Membuka catatan logistik Reka Rupa.</p>
            <div className="w-64 h-1.5 bg-indigo-900 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-violet-400 rounded-full transition-all ease-out" style={{ width: `${progress}%`, transitionDuration: '2000ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* --- ILUSI SKELETON DASHBOARD --- */}
      {isSuccess && (
        <div className="absolute inset-0 flex bg-slate-50 z-0">
          <div className="w-64 bg-white border-r border-slate-200 hidden lg:block"></div>
          <div className="flex-1 flex flex-col">
            <div className="h-20 bg-white border-b border-slate-200"></div>
            <div className="p-8">
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse"></div>
                <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse"></div>
                <div className="h-32 bg-white rounded-2xl border border-slate-200 shadow-sm animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- KONTEN FORM LOGIN --- */}
      {!isSuccess && (
        <>
          {/* SISI KIRI: Background Spline 3D */}
          <div className="relative w-full lg:w-3/5 h-64 lg:h-auto bg-gradient-to-br from-indigo-500 via-violet-600 to-indigo-900 overflow-hidden flex items-center justify-center">
            
            {/* Animasi Loading selagi 3D memuat */}
            {!is3DLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            
            {/* Kanvas 3D - */}
            <div className="absolute inset-0 w-full h-full">
              <Spline 
                scene="https://prod.spline.design/jqst7obg3ukKOrWz/scene.splinecode" 
                onLoad={() => setIs3DLoaded(true)}
              />
            </div>
          </div>

          {/* SISI KANAN: Form Login Glassmorphism */}
          <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-slate-50 lg:bg-transparent">
            
            {/* Latar belakang putih halus untuk versi mobile */}
            <div className="absolute inset-0 bg-white/40 lg:hidden backdrop-blur-xl"></div>

            <div className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] relative z-20 animate-fade-in transform hover:-translate-y-1 transition-transform duration-500">
              
              <div className="mb-10 text-left flex flex-col items-start">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200/50">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reka Rupa</h1>
                <p className="text-slate-500 mt-2 font-medium text-sm">Masuk untuk mengelola logistik operasional.</p>
              </div>

              {error && (
                <div className="mb-6 bg-rose-50/80 backdrop-blur-sm border-l-4 border-rose-400 text-rose-700 px-4 py-3 rounded-r-xl text-sm font-medium flex items-center shadow-sm">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Username Database</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input 
                      type="text" 
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      className="w-full bg-slate-50/50 text-slate-900 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium placeholder-slate-400"
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50/50 text-slate-900 border border-slate-200 rounded-xl pl-11 pr-12 py-3.5 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium tracking-wide placeholder-slate-400"
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`w-full text-white font-bold py-4 mt-6 rounded-xl transition-all flex justify-center items-center ${
                    isLoading 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-900 hover:bg-indigo-800 shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30 hover:-translate-y-0.5'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Memverifikasi...
                    </>
                  ) : (
                    'Masuk ke Sistem'
                  )}
                </button>
              </form>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
