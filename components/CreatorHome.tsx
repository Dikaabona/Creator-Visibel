import React, { useMemo } from 'react';
import { Creator, Campaign, Application, ApplicationStatus, CampaignStatus } from '../types';

interface CreatorHomeProps {
  creator: Creator;
  campaigns: Campaign[];
  applications: Application[];
  onApply: (campaignId: string) => void;
  onNavigate: (view: any) => void;
}

const CreatorHome: React.FC<CreatorHomeProps> = ({ creator, campaigns, applications, onApply, onNavigate }) => {
  const myApplications = useMemo(() => {
    return applications.filter(app => app.creatorId === creator.id);
  }, [applications, creator.id]);

  const stats = useMemo(() => {
    const activeApps = myApplications.filter(app => 
      app.status !== ApplicationStatus.REJECTED && 
      app.status !== ApplicationStatus.PAID
    );
    const completedApps = myApplications.filter(app => app.status === ApplicationStatus.PAID);
    
    return {
      active: activeApps.length,
      completed: completedApps.length,
      total: myApplications.length
    };
  }, [myApplications]);

  const myCampaigns = useMemo(() => {
    return myApplications
      .map(app => {
        const campaign = campaigns.find(c => c.id === app.campaignId);
        return { ...campaign, appStatus: app.status };
      })
      .filter(c => c.id) as any[];
  }, [myApplications, campaigns]);

  const availableCampaigns = useMemo(() => {
    const myCampaignIds = new Set(myApplications.map(app => app.campaignId));
    return campaigns.filter(c => !myCampaignIds.has(c.id) && c.status === CampaignStatus.ACTIVE);
  }, [campaigns, myApplications]);

  return (
    <div className="space-y-12">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Halo, {creator.name}! 👋</h2>
        <p className="text-slate-500 font-medium">Selamat datang kembali di dashboard Anda.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Campaign Aktif</div>
          <div className="text-4xl font-black text-slate-900">{stats.active}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Selesai</div>
          <div className="text-4xl font-black text-slate-900">{stats.completed}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Apply</div>
          <div className="text-4xl font-black text-slate-900">{stats.total}</div>
        </div>
      </div>

      {/* Available Campaigns */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-black text-slate-900">Campaign Tersedia</h3>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
              {availableCampaigns.length} New
            </span>
          </div>
          <button 
            onClick={() => onNavigate('my-campaigns')}
            className="text-xs font-black text-yellow-600 uppercase tracking-widest hover:text-yellow-700 transition-colors flex items-center space-x-1"
          >
            <span>Lihat Semua</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCampaigns.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
              Belum ada campaign baru yang tersedia untuk Anda.
            </div>
          ) : (
            availableCampaigns.slice(0, 3).map(campaign => (
              <div key={campaign.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{campaign.brandName}</div>
                  <div className="text-yellow-600 font-black text-sm">Rp {campaign.budget.toLocaleString()}</div>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">{campaign.name}</h4>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6">{campaign.brief}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niche</span>
                    <span className="text-xs font-bold text-slate-700">{campaign.targetNiche}</span>
                  </div>
                  <button 
                    onClick={() => onApply(campaign.id)}
                    className="px-6 py-3 bg-black text-yellow-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* My Campaigns */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900">Campaign Saya</h3>
          <button 
            onClick={() => onNavigate('my-campaigns')}
            className="text-xs font-black text-yellow-600 uppercase tracking-widest hover:text-yellow-700 transition-colors flex items-center space-x-1"
          >
            <span>Lihat Semua</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Progres</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold">
                      Anda belum mengikuti campaign apapun.
                    </td>
                  </tr>
                ) : (
                  myCampaigns.slice(0, 5).map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{campaign.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{campaign.targetNiche}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-700">{campaign.brandName}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          campaign.appStatus === ApplicationStatus.ACCEPTED ? 'bg-emerald-100 text-emerald-700' :
                          campaign.appStatus === ApplicationStatus.REJECTED ? 'bg-red-100 text-red-700' :
                          campaign.appStatus === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                          campaign.appStatus === ApplicationStatus.PAID ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {campaign.appStatus}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">Rp {campaign.budget.toLocaleString()}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreatorHome;
