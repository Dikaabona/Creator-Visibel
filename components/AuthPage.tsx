import React, { useState } from 'react';
import { getSupabase } from '../services/supabase';
import { UserRole } from '../types';

interface AuthPageProps {
  onAuthSuccess: (session: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.CREATOR);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const logoUrl = "https://lh3.googleusercontent.com/d/1aGXJp0RwVbXlCNxqL_tAfHS5dc23h7nA";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = getSupabase();

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess(data.session);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role }
          }
        });
        if (error) throw error;
        alert('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Left Side: Branding */}
      <div className="hidden md:flex md:w-1/2 bg-black p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-yellow-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-600 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10">
          <img src={logoUrl} alt="Visibel" className="h-10 w-auto mb-12" />
          <h1 className="text-6xl font-black text-white leading-tight tracking-tighter">
            Your Trusted <br />
            <span className="text-yellow-400"> Growth Partner</span>
          </h1>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-lg font-medium max-w-md">
            Visibel membantu brand dan creator terhubung secara cerdas melalui data dan transparansi.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-2xl shadow-black/5 border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Masuk untuk mengelola campaign Anda.' : 'Daftar sebagai Brand atau Creator.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.CREATOR)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${role === UserRole.CREATOR ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === UserRole.CREATOR ? 'bg-yellow-400 text-black' : 'bg-slate-100 text-slate-400'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Creator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.BRAND)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${role === UserRole.BRAND ? 'border-yellow-400 bg-yellow-50' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === UserRole.BRAND ? 'bg-yellow-400 text-black' : 'bg-slate-100 text-slate-400'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Brand</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all font-medium"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all font-medium"
                placeholder="email@contoh.com"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kata Sandi</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:bg-white outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center space-x-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-yellow-400 text-black rounded-2xl font-black text-lg hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-500 font-bold hover:text-black transition-colors"
            >
              {isLogin ? 'Belum punya akun? Daftar gratis' : 'Sudah punya akun? Masuk'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
