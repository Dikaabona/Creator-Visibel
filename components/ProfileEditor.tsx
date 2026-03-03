import React, { useState } from 'react';
import { Creator, CreatorTier } from '../types';

interface ProfileEditorProps {
  creator: Creator;
  onSave: (data: Partial<Creator>) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ creator, onSave }) => {
  const [formData, setFormData] = useState({
    name: creator.name || '',
    bio: creator.bio || '',
    niche: creator.category || '',
    kota: creator.domicile || '',
    followers: creator.followers || 0,
    engagementRate: creator.engagementRate || 0,
    rateCard: creator.rateCard || 0,
    tiktokUrl: creator.tiktokUrl || '',
    instagramUrl: creator.instagramUrl || '',
    whatsapp: creator.whatsapp || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { niche, kota, ...rest } = formData;
    onSave({
      ...rest,
      category: niche,
      domicile: kota,
      tier: formData.followers > 1000000 ? CreatorTier.MEGA : formData.followers > 100000 ? CreatorTier.MAKRO : formData.followers > 10000 ? CreatorTier.MIKRO : CreatorTier.NANO
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-black/5">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Edit Profil Creator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Niche / Kategori</label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) => setFormData({...formData, niche: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
              placeholder="e.g. Beauty, Tech, Food"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium h-32 resize-none"
            placeholder="Ceritakan sedikit tentang diri Anda..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kota</label>
            <input
              type="text"
              value={formData.kota}
              onChange={(e) => setFormData({...formData, kota: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Followers</label>
            <input
              type="number"
              value={formData.followers}
              onChange={(e) => setFormData({...formData, followers: parseInt(e.target.value) || 0})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Engagement Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.engagementRate * 100}
              onChange={(e) => setFormData({...formData, engagementRate: (parseFloat(e.target.value) || 0) / 100})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rate Card (Rp)</label>
          <input
            type="number"
            value={formData.rateCard}
            onChange={(e) => setFormData({...formData, rateCard: parseInt(e.target.value) || 0})}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">TikTok URL</label>
            <input
              type="text"
              value={formData.tiktokUrl}
              onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Instagram URL</label>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">No Whatsapp</label>
          <input
            type="text"
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-yellow-400 outline-none transition-all font-medium"
            placeholder="e.g. 081234567890"
          />
        </div>

        <button
          type="submit"
          className="w-full py-5 bg-black text-yellow-400 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
        >
          Simpan Profil
        </button>
      </form>
    </div>
  );
};

export default ProfileEditor;
