import React, { useState } from 'react';
import { 
  Globe, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  Clock, 
  CheckCircle,
  X 
} from 'lucide-react';
import { ActiveTab } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export default function Header({ activeTab, setActiveTab, language, setLanguage }: HeaderProps) {
  const t = TRANSLATIONS[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguagesMenu, setShowLanguagesMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Somvati Amavasya Holy Bath Scheduled",
      time: "Today, Sunrise 06:12 AM",
      desc: "Millions are heading to Ram Ghat and Dutt Akhara Sector 2 main platform. Secure guides and rescue boat lines are active",
      category: "Auspicious Bathing"
    },
    {
      id: 2,
      title: "Clean Shipra Rating: Excellent",
      time: "1 hour ago",
      desc: "Water quality tests show supreme purity and safe current speeds on the Shipra River. Enjoy prayers of salvation.",
      category: "Environment"
    }
  ];

  return (
    <header id="app-top-header" className="w-full h-18 px-10 flex items-center justify-between z-30 select-none relative bg-gradient-to-r from-transparent to-[#fef0da]/10">
      
      {/* Search / Nav context title indicator bar */}
      <div className="flex items-center gap-2" id="header-context-title">
        <span className="text-[10px] font-mono uppercase bg-[#541d17]/5 text-[#a04000] border border-[#541d17]/10 px-2.5 py-1 rounded-full font-bold">
          {t.digitalStation}
        </span>
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        <span className="text-xs font-sans text-[#a04000] font-semibold">
          {activeTab === ActiveTab.Home ? t.gpsStatus : t.sandboxStatus}
        </span>
      </div>

      {/* Action panel right */}
      <div className="flex items-center gap-4 relative" id="header-interactive-actions">
        
        {/* Language selector toggle tab */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#541d17]/5 border border-[#eddcc1]/80 shadow-inner" id="header-lang-switcher-pill">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 cursor-pointer ${
              language === 'en'
                ? 'bg-[#e67e22] text-white shadow-md'
                : 'bg-transparent text-[#62534e] hover:text-[#e67e22] hover:bg-[#e67e22]/5'
            }`}
            id="lang-toggle-en"
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 cursor-pointer font-hindi ${
              language === 'hi'
                ? 'bg-[#e67e22] text-white shadow-md'
                : 'bg-transparent text-[#62534e] hover:text-[#e67e22] hover:bg-[#e67e22]/5'
            }`}
            id="lang-toggle-hi"
          >
            हिन्दी
          </button>
        </div>

        {/* Notification Bell with red bubble overlay */}
        <div className="relative">
          <button
            id="header-bell-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowLanguagesMenu(false);
            }}
            className="w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-[#eddcc1]/80 text-[#541d17] hover:text-[#e67e22] flex items-center justify-center shadow-sm relative transition-all cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {/* Animated Red count dot */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 border border-white ring-2 ring-red-600/10 animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 border border-white shadow-sm" />
          </button>

          {/* Interactive Notifications drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-3xl bg-[#ffffff]/98 border border-[#eddcc1] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-250" id="notification-flyout">
              
              {/* Header inside */}
              <div className="bg-gradient-to-r from-[#541d17] to-[#7f2d24] px-5 py-4 flex items-center justify-between text-white" id="flyout-header">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-orange-400" />
                  <h4 className="font-serif text-sm font-bold tracking-wide">Live Simhastha Bulletins</h4>
                </div>
                <button 
                  id="btn-close-notifs"
                  onClick={() => setShowNotifications(false)}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Bulletins lists */}
              <div className="p-4 space-y-4 max-h-72 overflow-y-auto" id="flyout-body">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 bg-neutral-50/50 hover:bg-orange-50/20 border border-[#eddcc1]/30 rounded-2xl relative transition-all" id={`notif-item-${notif.id}`}>
                    <div className="flex items-center justify-between" id={`notif-head-inside-${notif.id}`}>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-wider bg-orange-100 text-[#a04000] px-2 py-0.5 rounded-full">
                        {notif.category}
                      </span>
                      <span className="text-[9px] font-sans text-neutral-400 font-semibold">{notif.time}</span>
                    </div>

                    <h5 className="font-sans font-bold text-xs text-[#541d17] mt-2">
                      {notif.title}
                    </h5>
                    
                    <p className="text-[11px] text-[#8e746a] font-sans leading-normal mt-1 pr-1.5">
                      {notif.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Safe check footnote */}
              <div className="p-3 bg-emerald-50 text-emerald-800 text-[10px] font-semibold text-center border-t border-emerald-100 flex items-center justify-center gap-1.5 font-sans" id="safe-checks-footnote">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sector Control reports absolute normal flow.</span>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
