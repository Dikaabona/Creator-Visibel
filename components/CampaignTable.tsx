
import React from 'react';
import { Campaign, CampaignStatus } from '../types';

interface CampaignTableProps {
  campaigns: Campaign[];
  onDelete: (id: string) => void;
  onAddCreator: (campaignId: string) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ campaigns, onDelete, onAddCreator }) => {
  const getStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case CampaignStatus.DRAFT:
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case CampaignStatus.COMPLETED:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case CampaignStatus.ON_HOLD:
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <tr>
            <th className="p-4">Campaign Name</th>
            <th className="p-4">Brand</th>
            <th className="p-4">Status</th>
            <th className="p-4">Budget</th>
            <th className="p-4 text-center">Creators</th>
            <th className="p-4">Timeline</th>
            <th className="p-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {campaigns.map((c) => (
            <tr key={c.id} className="hover:bg-yellow-50/30 transition-colors group">
              <td className="p-4">
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{c.targetNiche}</div>
              </td>
              <td className="p-4 text-sm font-medium text-slate-600">{c.brandName}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-md text-[10px] font-black border uppercase tracking-tighter ${getStatusBadge(c.status)}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </td>
              <td className="p-4 text-sm font-mono font-bold text-slate-900">
                Rp {c.budget.toLocaleString('id-ID')}
              </td>
              <td className="p-4 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 border border-slate-100 text-xs font-black text-slate-600">
                  {c.creatorCount}
                </div>
              </td>
              <td className="p-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Starts: {c.startDate}</div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Ends: {c.endDate}</div>
              </td>
              <td className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button className="p-2 text-slate-300 hover:text-yellow-600 transition-colors" title="Lihat Detail">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => onAddCreator(c.id)}
                    className="p-2 text-slate-300 hover:text-yellow-600 transition-colors" 
                    title="Tambah Creator ke Campaign"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Hapus campaign ini?')) {
                        onDelete(c.id);
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-red-600 transition-colors" 
                    title="Hapus Campaign"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
