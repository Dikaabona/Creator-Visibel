import React from 'react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const logoUrl = "https://lh3.googleusercontent.com/d/1aGXJp0RwVbXlCNxqL_tAfHS5dc23h7nA";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-yellow-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logoUrl} alt="Visibel" className="h-8 w-auto" />
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
            <a href="#brands" className="hover:text-black transition-colors">For Brands</a>
            <a href="#creators" className="hover:text-black transition-colors">For Creators</a>
            <a href="#security" className="hover:text-black transition-colors">Security</a>
          </div>
          <button 
            onClick={onEnterApp}
            className="px-6 py-2.5 bg-black text-yellow-400 rounded-full text-sm font-black hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Masuk ke Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            Your Trusted Growth Partner
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Temukan Creator Terbaik. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Jalankan Campaign Lebih Profit</span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl mb-12 font-medium">
            Visibel menghubungkan brand kamu dengan influencer berbasis data akurat. Agar setiap campaign bukan cuma jalan, tapi menghasilkan
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onEnterApp}
              className="w-full sm:w-auto px-10 py-5 bg-yellow-400 text-black rounded-2xl font-black text-lg hover:bg-yellow-500 transition-all shadow-2xl shadow-yellow-400/20 active:scale-95"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </section>


      {/* For Brands Section */}
      <section id="brands" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="w-16 h-1 bg-yellow-400 mb-8"></div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Untuk Brand: <br />Cari Creator Tanpa Menebak.</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-400/20">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Pencarian Berbasis Data</h4>
                    <p className="text-slate-500 font-medium">Temukan creator berdasarkan domisili, tier, kategori, dan performa nyata. Bukan sekadar jumlah followers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Manajemen Campaign Mudah</h4>
                    <p className="text-slate-500 font-medium">Buat campaign, pilih creator, dan pantau progres dalam satu dashboard terpusat yang intuitif.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-slate-100 rounded-[40px] aspect-square overflow-hidden shadow-2xl relative group">
              <img 
                src="https://picsum.photos/seed/brand-dashboard/800/800" 
                alt="Brand Dashboard" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                <div className="text-white">
                  <div className="text-sm font-black uppercase tracking-widest text-yellow-400 mb-2">Brand Experience</div>
                  <div className="text-2xl font-bold">"Mencari creator jadi 10x lebih cepat dengan Visibel."</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section id="creators" className="py-24 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="bg-slate-900 rounded-[40px] aspect-square overflow-hidden shadow-2xl relative group">
              <img 
                src="https://picsum.photos/seed/creator-job/800/800" 
                alt="Creator Job" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-12">
                <div>
                  <div className="text-sm font-black uppercase tracking-widest text-yellow-400 mb-2">Creator Life</div>
                  <div className="text-2xl font-bold">"Fokus berkarya, biarkan Visibel yang mencarikan Brand."</div>
                </div>
              </div>
            </div>
            <div>
              <div className="w-16 h-1 bg-yellow-400 mb-8"></div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">Untuk Creator: <br />Dapatkan Job yang Relevan.</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-400/20">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Monetisasi Konten Anda</h4>
                    <p className="text-slate-400 font-medium">Terhubung dengan brand besar yang mencari audiens spesifik Anda. Tingkatkan pendapatan secara konsisten.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/10">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Profil Profesional</h4>
                    <p className="text-slate-400 font-medium">Tampilkan data performa Anda secara otomatis kepada brand. Biarkan data yang berbicara untuk kualitas konten Anda.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Keamanan Transaksi Terjamin.</h2>
          <p className="text-slate-500 text-lg font-medium mb-12">
            Kami menggunakan sistem <span className="text-slate-900 font-black">Escrow (Rekening Bersama)</span>. Dana brand akan ditahan oleh sistem dan hanya akan dicairkan ke creator setelah pekerjaan selesai dan disetujui.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4">Step 1</div>
              <div className="font-bold text-slate-900">Brand Deposit</div>
              <p className="text-sm text-slate-500 mt-2">Brand membayar biaya campaign ke sistem Visibel.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4">Step 2</div>
              <div className="font-bold text-slate-900">Creator Works</div>
              <p className="text-sm text-slate-500 mt-2">Creator mengerjakan konten sesuai brief campaign.</p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-4">Step 3</div>
              <div className="font-bold text-slate-900">Safe Payout</div>
              <p className="text-sm text-slate-500 mt-2">Dana dicairkan setelah konten dipublish dan diverifikasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <img src={logoUrl} alt="Visibel" className="h-8 w-auto" />
            <div className="flex space-x-8 text-sm font-bold text-slate-400">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Contact Us</a>
            </div>
            <div className="text-slate-400 text-sm font-medium">
              © 2026 Visibel. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
