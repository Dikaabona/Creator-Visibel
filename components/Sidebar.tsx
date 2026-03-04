import React, { useState } from 'react';
import { getSupabase } from '../services/supabase';
import { UserRole } from '../types';

interface SidebarProps {
  activeView: 'home' | 'creators' | 'campaigns' | 'analytics' | 'profile' | 'my-campaigns' | 'system';
  onNavigate: (view: any) => void;
  onBackToLanding?: () => void;
  userEmail?: string;
  userRole?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, onBackToLanding, userEmail, userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getNavItemClass = (view: string) => {
    const isActive = activeView === view;
    const baseClass = "flex items-center space-x-3 p-3 rounded-xl font-bold transition-all active:scale-95 group relative w-full text-left";
    if (isActive) {
      return `${baseClass} bg-yellow-400 text-black shadow-lg shadow-yellow-400/20`;
    }
    return `${baseClass} text-white hover:bg-slate-800`;
  };

  const logoUrl = "https://lh3.googleusercontent.com/d/1aGXJp0RwVbXlCNxqL_tAfHS5dc23h7nA";

  return (
    <div className={`bg-black text-white flex flex-col min-h-screen sticky top-0 border-r border-slate-800 shadow-sm transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`p-6 flex items-center justify-between relative min-h-[88px] ${isCollapsed ? 'justify-center' : ''}`}>
        <div 
          onClick={onBackToLanding}
          className={`overflow-hidden transition-all duration-300 cursor-pointer hover:opacity-80 active:scale-95 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
        >
          <div className="flex items-center">
            <img src={logoUrl} alt="Visibel" className="h-9 w-auto object-contain" />
          </div>
        </div>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-slate-800 transition-all active:scale-95 text-white border-2 border-transparent ${isCollapsed ? '' : 'ml-2'}`}
        >
          {isCollapsed ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        <div className={`px-3 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          {!isCollapsed && "MENU"}
        </div>
        
        {userRole === UserRole.ADMIN && (
          <>
            <button onClick={() => onNavigate('creators')} className={getNavItemClass('creators')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              {!isCollapsed && <span>Creators Database</span>}
            </button>
            <button onClick={() => onNavigate('campaigns')} className={getNavItemClass('campaigns')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              {!isCollapsed && <span>All Campaigns</span>}
            </button>
            <button onClick={() => onNavigate('system')} className={getNavItemClass('system')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {!isCollapsed && <span>System Settings</span>}
            </button>
          </>
        )}

        {userRole === UserRole.BRAND && (
          <>
            <button onClick={() => onNavigate('creators')} className={getNavItemClass('creators')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              {!isCollapsed && <span>Find Creators</span>}
            </button>
            <button onClick={() => onNavigate('my-campaigns')} className={getNavItemClass('my-campaigns')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              {!isCollapsed && <span>My Campaigns</span>}
            </button>
          </>
        )}

        {userRole === UserRole.CREATOR && (
          <>
            <button onClick={() => onNavigate('home')} className={getNavItemClass('home')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              {!isCollapsed && <span>Home</span>}
            </button>
            <button onClick={() => onNavigate('profile')} className={getNavItemClass('profile')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {!isCollapsed && <span>My Profile</span>}
            </button>
            <button onClick={() => onNavigate('my-campaigns')} className={getNavItemClass('my-campaigns')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {!isCollapsed && <span>Campaigns</span>}
            </button>
          </>
        )}

        <button onClick={() => onNavigate('analytics')} className={getNavItemClass('analytics')}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          {!isCollapsed && <span>Analytics</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <div className={`flex items-center space-x-3 p-2 rounded-xl bg-slate-800/50 transition-all overflow-hidden ${isCollapsed ? 'justify-center p-1' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex-shrink-0 flex items-center justify-center font-bold text-xs text-black uppercase">
            {userEmail ? userEmail[0] : 'A'}
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <p className="text-sm font-black truncate whitespace-nowrap text-white">
              {userEmail ? userEmail.split('@')[0] : 'User'}
            </p>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
              {userRole} ACCESS
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all active:scale-95 group relative ${isCollapsed ? 'justify-center' : ''}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          {!isCollapsed && <span className="text-sm">Keluar</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
