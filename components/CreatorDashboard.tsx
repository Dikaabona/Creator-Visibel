import React, { useState } from 'react';
import { Creator, Campaign, Application, ApplicationStatus, CampaignStatus } from '../types';

interface CreatorDashboardProps {
  creator: Creator;
  campaigns: Campaign[];
  applications: Application[];
  onApply: (campaignId: string) => void;
  onUploadContent: (applicationId: string, url: string) => void;
  onAcceptBrief: (applicationId: string) => void;
  onRejectBrief: (applicationId: string) => void;
}

const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ 
  creator, 
  campaigns, 
  applications,
  onApply,
  onUploadContent,
  onAcceptBrief,
  onRejectBrief
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'my-jobs'>('explore');

  const getApplication = (campaignId: string) => applications.find(a => a.campaignId === campaignId);

  return (
    <div className="space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center text-3xl font-black text-black shadow-lg shadow-yellow-400/20">
          {creator.name[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 mb-2">{creator.name}</h2>
          <p className="text-slate-500 font-medium mb-4 max-w-md">{creator.bio || 'Belum ada bio.'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">{creator.category}</span>
            <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">{creator.domicile}</span>
            <span className="px-4 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-widest">{creator.followers.toLocaleString()} Followers</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end space-y-2">
          <div className="text-sm font-black text-slate-400 uppercase tracking-widest">Engagement Rate</div>
          <div className="text-4xl font-black text-slate-900">{(creator.engagementRate * 100).toFixed(1)}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('explore')}
          className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'explore' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Cari Campaign
          {activeTab === 'explore' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('my-jobs')}
          className={`pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'my-jobs' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Campaign Saya
          {activeTab === 'my-jobs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-t-full"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'explore' ? (
          campaigns
            .filter(c => c.status === CampaignStatus.ACTIVE)
            .map(campaign => {
              const app = getApplication(campaign.id);
              return (
                <div key={campaign.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-yellow-400/5 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{campaign.brandName}</div>
                    <div className="text-yellow-600 font-black text-sm">Rp {campaign.budget.toLocaleString()}</div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">{campaign.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 font-medium">{campaign.brief}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deadline: {new Date(campaign.deadline).toLocaleDateString()}</div>
                    {app ? (
                      <span className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest">Applied</span>
                    ) : (
                      <button 
                        onClick={() => onApply(campaign.id)}
                        className="px-6 py-2 bg-yellow-400 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-400/20"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          applications.map(app => {
            const campaign = campaigns.find(c => c.id === app.campaignId);
            if (!campaign) return null;
            return (
              <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{app.status}</div>
                  <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{app.paymentStatus}</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{campaign.name}</h3>
                
                <div className="mt-6 space-y-4">
                  {app.status === ApplicationStatus.BRIEF_SENT && (
                    <div className="flex space-x-2">
                      <button onClick={() => onAcceptBrief(app.id)} className="flex-1 py-3 bg-black text-yellow-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Accept Brief</button>
                      <button onClick={() => onRejectBrief(app.id)} className="flex-1 py-3 bg-white text-red-500 border border-red-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all">Reject</button>
                    </div>
                  )}
                  {app.status === ApplicationStatus.BRIEF_ACCEPTED && (
                    <button 
                      onClick={() => {
                        const url = prompt('Masukkan URL konten Anda (TikTok/Instagram):');
                        if (url) onUploadContent(app.id, url);
                      }}
                      className="w-full py-3 bg-yellow-400 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-500 transition-all"
                    >
                      Upload Content
                    </button>
                  )}
                  {app.status === ApplicationStatus.CONTENT_APPROVED && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-bold text-center">
                      Konten disetujui! Menunggu pembayaran.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
