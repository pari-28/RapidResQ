import React from 'react';
import { 
  Home, 
  PhoneCall, 
  Map, 
  Search, 
  Activity, 
  ShieldAlert, 
  Languages as LangIcon, 
  Settings as SettingsIcon,
  Building,
  ClipboardList,
  Camera
} from 'lucide-react';
import { ActiveTab } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language?: 'en' | 'hi';
}

export default function Sidebar({ activeTab, setActiveTab, language = 'en' }: SidebarProps) {
  const t = TRANSLATIONS[language];
  const menuItems = [
    { id: ActiveTab.Home, icon: Home, label: t.home },
    { id: ActiveTab.EmergencyHelp, icon: PhoneCall, label: t.emergencyHelp, badge: 'SOS' },
    { id: ActiveTab.CommandCenter, icon: Building, label: t.commandHub, badge: 'AI' },
    { id: ActiveTab.ReportsManagement, icon: ClipboardList, label: t.reportsManagement || 'Reports Management' },
    { id: ActiveTab.CCTV, icon: Camera, label: language === 'hi' ? '📹 सीसीटीवी केंद्र' : '📹 CCTV Monitoring Center', badge: 'NEW' },
    { id: ActiveTab.LiveMap, icon: Map, label: t.liveMap },
    { id: ActiveTab.LostAndFound, icon: Search, label: t.lostFound },
    { id: ActiveTab.MedicalAssistance, icon: Activity, label: t.medicalCare },
    { id: ActiveTab.SafetyAlerts, icon: ShieldAlert, label: t.safetyAlerts, count: 2 },
    { id: ActiveTab.Languages, icon: LangIcon, label: t.languages },
    { id: ActiveTab.Settings, icon: SettingsIcon, label: t.settings },
  ];

  return (
    <aside id="sidebar-rail" className="w-80 h-screen fixed top-0 left-0 bg-gradient-to-b from-[#fdfbf8] via-[#f8f2e7] to-[#ebe1d3] border-r border-[#eddcc1] flex flex-col justify-between z-40 select-none shadow-sm shadow-[#541d17]/5">
      {/* Brand Header */}
      <div className="p-8 pt-10" id="sidebar-header">
        <div 
          onClick={() => setActiveTab(ActiveTab.Home)} 
          className="flex items-center gap-3 cursor-pointer group"
          id="brand-logo"
        >
          {/* Spiritual Golden Trishul Icon */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#e67e22] via-[#e74c3c] to-[#f1c40f] flex items-center justify-center shadow-md shadow-[#e67e22]/10 group-hover:scale-105 transition-transform duration-300">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-7 h-7 text-white drop-shadow"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M12 2s-3 3-3 8h6c0-5-3-8-3-8z" />
              <path d="M5 10c0-1 1-3 4-3h6c3 0 4 2 4 3 0 4-3 7-7 7s-7-3-7-7z" />
              <path d="M9 20h6" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#541d17] tracking-wide leading-none group-hover:text-[#e67e22] transition-colors">
              {t.brandTitle}
            </h1>
            <div className="text-[11px] font-mono tracking-widest text-[#a04000] font-semibold mt-1">
              {language === 'hi' ? '— उज्जैन २०२८ —' : '— UJJAIN 2028 —'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1" id="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-[#541d17]/5 to-[#eddcc1]/20 border-l-4 border-[#e67e22] text-[#541d17] font-semibold translate-x-1 shadow-sm' 
                  : 'text-[#62534e] hover:text-[#541d17] hover:bg-[#541d17]/5 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'text-[#e67e22] scale-110' : 'text-[#9c8577] group-hover:text-[#e67e22]'
                }`} />
                <span className="font-sans text-[15px] tracking-wide">{item.label}</span>
              </div>
              
              {/* Badges and Counts */}
              {item.badge && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-bold border border-red-200 uppercase tracking-widest animate-pulse">
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="w-5 h-5 rounded-full bg-[#e67e22] text-white flex items-center justify-center text-[10px] font-mono font-bold shadow-sm shadow-[#e67e22]/20">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Fine-Art Scenic Pilgrim Silhouette Footer */}
      <div className="p-4 relative overflow-hidden h-36 flex items-end justify-center select-none" id="sidebar-footer">
        {/* Scenic outline drawing overlay */}
        <svg 
          viewBox="0 0 100 45" 
          className="absolute bottom-0 left-0 w-full opacity-35 filter sepia-[0.3] hover:opacity-50 transition-opacity duration-500"
          fill="none"
        >
          <defs>
            <linearGradient id="warmGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#541d17" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#e67e22" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#fdf0da" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0 45 L100 45 L100 30 Q75 35 50 32 T0 35 Z" 
            fill="url(#warmGrad)" 
          />
          {/* Temple 1 */}
          <path d="M12 30 L16 12 L18 12 L22 30 Z" stroke="#541d17" strokeWidth="0.5" />
          <path d="M14 20 H20" stroke="#541d17" strokeWidth="0.5" />
          <path d="M17 12 V8" stroke="#541d17" strokeWidth="0.5" />
          {/* Pennant flag */}
          <path d="M17 8 L22 10 L17 11" fill="#e67e22" />
          
          {/* Big Temple Center */}
          <path d="M38 33 L45 8 L47 8 L54 33 Z" stroke="#541d17" strokeWidth="0.75" />
          <path d="M41 22 H51" stroke="#541d17" strokeWidth="0.5" />
          <path d="M43 14 Q46 16 49 14" stroke="#541d17" strokeWidth="0.5" />
          <path d="M46 8 V2" stroke="#541d17" strokeWidth="0.5" />
          <path d="M46 2 L52 4 L46 6" fill="#e67e22" />

          {/* Temple 3 */}
          <path d="M72 32 L75 16 L77 16 L80 32 Z" stroke="#541d17" strokeWidth="0.5" />
          <path d="M76 16 V11" stroke="#541d17" strokeWidth="0.5" />
          <path d="M76 11 L80 12.5 L76 14" fill="#60a5fa" />

          {/* Crowds pilgrim silhouette paths */}
          <circle cx="5" cy="38" r="1" fill="#541d17" />
          <circle cx="8" cy="36" r="1.2" fill="#541d17" />
          <circle cx="10" cy="37" r="1" fill="#541d17" />
          <circle cx="28" cy="35" r="1.3" fill="#541d17" />
          <circle cx="31" cy="36" r="1.1" fill="#541d17" />
          <circle cx="62" cy="37" r="1" fill="#541d17" />
          <circle cx="66" cy="35" r="1.4" fill="#541d17" />
          <circle cx="88" cy="37" r="1" fill="#541d17" />
          <circle cx="92" cy="36" r="1.2" fill="#541d17" />
          
          {/* River ripples */}
          <path d="M5 41 C12 40 18 42 25 41 T45 42 T65 41 T85 41" stroke="#c05621" strokeWidth="0.3" strokeDasharray="3 2" />
          <path d="M15 43 C22 42 28 44 35 43 T55 44 T75 43 T95 43" stroke="#e67e22" strokeWidth="0.3" strokeDasharray="5 3" />
        </svg>
        <div className="relative text-center z-10 pb-2">
          <p className="text-[11px] font-sans text-[#a04000] font-medium tracking-wide">
            Shipra River Heritage
          </p>
          <p className="text-[9px] font-mono text-[#9c8577] mt-0.5">
            Ujjain, Madhya Pradesh
          </p>
        </div>
      </div>
    </aside>
  );
}
