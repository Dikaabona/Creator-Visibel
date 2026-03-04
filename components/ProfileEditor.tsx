import React, { useState } from 'react';
import { Creator, CreatorTier } from '../types';

interface ProfileEditorProps {
  creator: Creator;
  onSave: (data: Partial<Creator>) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ creator, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
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
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-black/5 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-slate-900">Profil Creator</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-yellow-400 text-black rounded-xl font-black text-sm hover:bg-yellow-500 transition-all active:scale-95 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Profil</span>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Niche / Kategori</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.niche}
              onChange={(e) => setFormData({...formData, niche: e.target.value})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
              placeholder="e.g. Beauty, Tech, Food"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bio</label>
          <textarea
            disabled={!isEditing}
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium h-32 resize-none ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            placeholder="Ceritakan sedikit tentang diri Anda..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kota</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.kota}
              onChange={(e) => setFormData({...formData, kota: e.target.value})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Followers</label>
            <input
              type="number"
              disabled={!isEditing}
              value={formData.followers}
              onChange={(e) => setFormData({...formData, followers: parseInt(e.target.value) || 0})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Engagement Rate (%)</label>
            <input
              type="number"
              step="0.1"
              disabled={!isEditing}
              value={formData.engagementRate * 100}
              onChange={(e) => setFormData({...formData, engagementRate: (parseFloat(e.target.value) || 0) / 100})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Rate Card (Rp)</label>
          <input
            type="number"
            disabled={!isEditing}
            value={formData.rateCard}
            onChange={(e) => setFormData({...formData, rateCard: parseInt(e.target.value) || 0})}
            className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium font-mono ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">TikTok URL</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.tiktokUrl}
              onChange={(e) => setFormData({...formData, tiktokUrl: e.target.value})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Instagram URL</label>
            <input
              type="text"
              disabled={!isEditing}
              value={formData.instagramUrl}
              onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}
              className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">No Whatsapp</label>
          <input
            type="text"
            disabled={!isEditing}
            value={formData.whatsapp}
            onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
            className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all font-medium ${isEditing ? 'bg-slate-50 border-slate-100 focus:ring-2 focus:ring-yellow-400' : 'bg-slate-50/50 border-transparent text-slate-500 cursor-not-allowed'}`}
            placeholder="e.g. 081234567890"
          />
        </div>

        {isEditing && (
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-200 transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 bg-black text-yellow-400 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              Simpan Profil
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileEditor;
