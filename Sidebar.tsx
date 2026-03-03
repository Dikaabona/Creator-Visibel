
import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-yellow-400 text-black flex flex-col min-h-screen sticky top-0 border-r border-yellow-500 shadow-sm transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header Area */}
      <div className="p-6 flex items-center justify-between relative">
        <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
          <h1 className="text-2xl font-black tracking-tight text-black whitespace-nowrap">Visibel Creator</h1>
        </div>
        
        {/* Minimize / Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg hover:bg-yellow-500 transition-all active:scale-95 text-black border-2 border-transparent hover:border-black/10 ${isCollapsed ? 'mx-auto' : 'ml-2'}`}
          title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
        >
          {isCollapsed ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        <div className={`px-3 py-2 text-[10px] font-black text-black/60 uppercase tracking-wider transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
          {!isCollapsed && "Main Menu"}
        </div>
        
        <a href="#" className="flex items-center space-x-3 p-3 bg-black rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 group relative">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Creators Database
          </span>
          {isCollapsed && (
            <div className="absolute left-16 bg-black text-white px-3 py-1.5 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 whitespace-nowrap z-50">
              Creators Database
            </div>
          )}
        </a>

        <a href="#" className="flex items-center space-x-3 p-3 text-black hover:bg-yellow-500 rounded-xl transition-all font-bold group relative">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Campaigns
          </span>
          {isCollapsed && (
            <div className="absolute left-16 bg-black text-white px-3 py-1.5 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 whitespace-nowrap z-50">
              Campaigns
            </div>
          )}
        </a>

        <a href="#" className="flex items-center space-x-3 p-3 text-black hover:bg-yellow-500 rounded-xl transition-all font-bold group relative">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            Analytics
          </span>
          {isCollapsed && (
            <div className="absolute left-16 bg-black text-white px-3 py-1.5 rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity ml-2 whitespace-nowrap z-50">
              Analytics
            </div>
          )}
        </a>
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 border-t border-yellow-500/50">
        <div className={`flex items-center space-x-3 p-2 rounded-xl bg-black/5 transition-all overflow-hidden ${isCollapsed ? 'justify-center p-1' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-black flex-shrink-0 flex items-center justify-center font-bold text-xs text-yellow-400">
            A
          </div>
          <div className={`transition-all duration-300 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <p className="text-sm font-black truncate whitespace-nowrap">Administrator</p>
            <p className="text-[10px] text-black/60 uppercase font-black tracking-tighter whitespace-nowrap">Full Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
