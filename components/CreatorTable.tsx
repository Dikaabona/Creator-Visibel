import React from 'react';
import { Creator, CreatorTier, UserRole } from '../types';

interface CreatorTableProps {
  creators: Creator[];
  userRole: UserRole;
  selectedCreatorIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (creator: Creator) => void;
}

const CreatorTable: React.FC<CreatorTableProps> = ({ 
  creators, 
  userRole, 
  selectedCreatorIds, 
  onSelectionChange,
  onEdit
}) => {
  const formatFollowers = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTierBadgeClass = (tier: CreatorTier) => {
    switch (tier) {
      case CreatorTier.MEGA: return 'bg-purple-100 text-purple-800 border-purple-200';
      case CreatorTier.MAKRO: return 'bg-blue-100 text-blue-800 border-blue-200';
      case CreatorTier.MIKRO: return 'bg-green-100 text-green-800 border-green-200';
      case CreatorTier.NANO: return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100';
    }
  };

  const isValidUrl = (url: string | undefined) => {
    if (!url) return false;
    const cleanUrl = url.trim();
    return cleanUrl !== '' && cleanUrl !== '#' && cleanUrl !== 'https://' && cleanUrl !== 'http://';
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange(creators.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedCreatorIds.includes(id)) {
      onSelectionChange(selectedCreatorIds.filter(sid => sid !== id));
    } else {
      onSelectionChange([...selectedCreatorIds, id]);
    }
  };

  const isAllSelected = creators.length > 0 && selectedCreatorIds.length === creators.length;
  const isSomeSelected = selectedCreatorIds.length > 0 && selectedCreatorIds.length < creators.length;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="p-4 w-10">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  // Fix: Wrapped assignment in a block to ensure the ref callback returns void, resolving the TypeScript error
                  ref={el => { if (el) el.indeterminate = isSomeSelected; }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2 cursor-pointer transition-all"
                />
              </div>
            </th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Creator</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Niche</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Followers</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TikTok</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instagram</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Domisili</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate Card</th>
            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {creators.length > 0 ? (
            creators.map((c) => {
              const isSelected = selectedCreatorIds.includes(c.id);
              return (
                <tr key={c.id} className={`hover:bg-yellow-50/50 transition-colors group ${isSelected ? 'bg-yellow-50/80' : ''}`}>
                  <td className="p-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectRow(c.id)}
                        className="w-4 h-4 text-yellow-500 bg-gray-100 border-gray-300 rounded focus:ring-yellow-400 focus:ring-2 cursor-pointer transition-all"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{c.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-600 font-medium">{c.category || 'General'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getTierBadgeClass(c.tier)}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600">
                    {formatFollowers(c.followers)}
                  </td>
                  <td className="p-4">
                    {isValidUrl(c.tiktokUrl) ? (
                      <a href={c.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700 text-sm font-bold underline flex items-center space-x-1">
                        <span>TikTok</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isValidUrl(c.instagramUrl) ? (
                      <a href={c.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 text-sm font-medium underline flex items-center space-x-1">
                        <span>Instagram</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </a>
                    ) : (
                      <span className="text-gray-400 font-medium">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{c.domicile || 'Unknown'}</td>
                  <td className="p-4 text-sm font-mono text-gray-900">
                    Rp {c.rateCard?.toLocaleString('id-ID') || '0'}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => onEdit(c)}
                      className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all"
                      title="Edit Creator"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={10} className="p-8 text-center text-gray-500 italic bg-gray-50/30">
                Tidak ada data creator yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CreatorTable;