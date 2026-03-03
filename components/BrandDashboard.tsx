import React, { useState } from 'react';
import { Brand, Campaign, Application, ApplicationStatus, Creator, CampaignStatus } from '../types';

interface BrandDashboardProps {
  brand: Brand;
  campaigns: Campaign[];
  applications: Application[];
  creators: Creator[];
  onCreateCampaign: () => void;
  onApproveContent: (applicationId: string) => void;
  onRejectContent: (applicationId: string) => void;
  onSendBrief: (applicationId: string) => void;
  onRateCreator: (applicationId: string, rating: number, feedback: string) => void;
}

const BrandDashboard: React.FC<BrandDashboardProps> = ({
  brand,
  campaigns,
  applications,
  creators,
  onCreateCampaign,
  onApproveContent,
  onRejectContent,
  onSendBrief,
  onRateCreator
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'tracking'>('campaigns');

  const getCampaignApplications = (campaignId: string) => applications.filter(a => a.campaignId === campaignId);
  const getCreator = (creatorId: string) => creators.find(c => c.id === creatorId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Brand Dashboard</h2>
          <p className="text-slate-500 font-medium">Kelola campaign dan pantau performa creator Anda.</p>
        </div>
        <button 
          onClick={onCreateCampaign}
          className="px-8 py-4 bg-yellow-400 text-black rounded-2xl font-black text-sm hover:bg-yellow-500 transition-all shadow-xl shadow-yellow-400/20 active:scale-95 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          <span>Buat Campaign</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('campaigns')} className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'campaigns' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}>
          My Campaigns
          {activeTab === 'campaigns' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('tracking')} className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'tracking' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}>
          Tracking & Approval
          {activeTab === 'tracking' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'campaigns' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${campaign.status === CampaignStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {campaign.status}
                  </span>
                  <div className="text-yellow-600 font-black text-sm">Rp {campaign.budget.toLocaleString()}</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{campaign.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Creators</div>
                    <div className="text-xl font-black text-slate-900">{getCampaignApplications(campaign.id).length}</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target</div>
                    <div className="text-xl font-black text-slate-900">{(campaign.targetFollowers / 1000).toFixed(0)}K+</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Creator</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map(app => {
                  const creator = getCreator(app.creatorId);
                  const campaign = campaigns.find(c => c.id === app.campaignId);
                  if (!creator || !campaign) return null;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-black text-black">{creator.name[0]}</div>
                          <div>
                            <div className="font-bold text-slate-900">{creator.name}</div>
                            <div className="text-xs text-slate-400">{creator.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-600">{campaign.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{app.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        {app.status === ApplicationStatus.PENDING && (
                          <button onClick={() => onSendBrief(app.id)} className="px-4 py-2 bg-black text-yellow-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Send Brief</button>
                        )}
                        {app.status === ApplicationStatus.CONTENT_UPLOADED && (
                          <div className="flex space-x-2">
                            <button onClick={() => onApproveContent(app.id)} className="px-4 py-2 bg-yellow-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all">Approve</button>
                            <button onClick={() => onRejectContent(app.id)} className="px-4 py-2 bg-white text-red-500 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
                          </div>
                        )}
                        {app.status === ApplicationStatus.PAID && !app.rating && (
                          <button 
                            onClick={() => {
                              const rating = parseInt(prompt('Beri rating (1-5):') || '0');
                              const feedback = prompt('Beri feedback:') || '';
                              if (rating > 0) onRateCreator(app.id, rating, feedback);
                            }}
                            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                          >
                            Rate Creator
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandDashboard;
