import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Map, 
  Users, 
  FileCheck2,
  Lock, 
  Shield,
  Clock
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface SettingsProps {
  language?: 'en' | 'hi';
}

export default function Settings({ language = 'en' }: SettingsProps) {
  const t = TRANSLATIONS[language];
  const [offlineMap, setOfflineMap] = useState(true);
  const [safetyNotifications, setSafetyNotifications] = useState(true);
  const [synced, setSynced] = useState(false);
  const [customContact, setCustomContact] = useState({
    name: "Ramesh Sharma (Kinsfolk)",
    phone: "+91 98452 77412"
  });

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSynced(true);
    setTimeout(() => setSynced(false), 3000);
  };

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="settings-workspace">
      
      {/* Title */}
      <div className="mb-8" id="settings-title-sec">
        <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-[#e67e22]" />
          <span>{t.stTitle}</span>
        </h2>
        <p className="text-sm font-sans text-[#8e746a] mt-1.5">
          {t.stSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="settings-grid-body">
        
        {/* Left Toggles (7 cols) */}
        <div className="lg:col-span-7 space-y-6" id="settings-options-column">
          
          {/* Caches and notifications */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm space-y-6" id="preferences-card">
            <h3 className="font-sans font-bold text-[#541d17] text-base border-b border-[#eddcc1]/20 pb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#e67e22]" />
              <span>{t.stGuardsHeading}</span>
            </h3>

            {/* Offline Maps toggle */}
            <div className="flex items-center justify-between" id="toggle-offlinemaps">
              <div className="max-w-[80%]">
                <h4 className="font-sans font-bold text-sm text-[#541d17] flex items-center gap-2">
                  <Map className="w-4 h-4 text-blue-600" />
                  <span>{t.stPreCacheMap}</span>
                </h4>
                <p className="text-xs text-[#8e746a] mt-1 pr-4 font-sans leading-relaxed">
                  {t.stPreCacheDesc}
                </p>
              </div>
              <button
                id="btn-toggle-maps"
                type="button"
                onClick={() => setOfflineMap(!offlineMap)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  offlineMap ? 'bg-emerald-500' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    offlineMap ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Safety whistle toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100" id="toggle-whistle">
              <div className="max-w-[80%]">
                <h4 className="font-sans font-bold text-sm text-[#541d17] flex items-center gap-2">
                  <Bell className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>{t.stSirenWhistles}</span>
                </h4>
                <p className="text-xs text-[#8e746a] mt-1 pr-4 font-sans leading-relaxed">
                  {t.stSirenWhistlesDesc}
                </p>
              </div>
              <button
                id="btn-toggle-sirens"
                type="button"
                onClick={() => setSafetyNotifications(!safetyNotifications)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  safetyNotifications ? 'bg-emerald-500' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    safetyNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Kinsfolk contact registration */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm" id="kinsfolk-form-card">
            <h3 className="font-sans font-bold text-[#541d17] text-base border-b border-[#eddcc1]/20 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#e67e22]" />
              <span>{t.stFamilyRegistry}</span>
            </h3>

            <p className="text-xs text-[#8e746a] mt-1.5 mb-5 font-sans">
              {t.stFamilyRegistryDesc}
            </p>

            <form onSubmit={handleSaveContact} className="space-y-4" id="kinsfolk-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="form-kinsfolk-inputs">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.stKinName}</label>
                  <input
                    type="text"
                    required
                    value={customContact.name}
                    onChange={(e) => setCustomContact({ ...customContact, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.stKinPhone}</label>
                  <input
                    type="text"
                    required
                    value={customContact.phone}
                    onChange={(e) => setCustomContact({ ...customContact, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3" id="kinsfolk-actions">
                <button
                  type="submit"
                  id="btn-save-settings"
                  className="px-5 py-2 rounded-full bg-[#541d17] hover:bg-[#e67e22] text-white font-sans text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{t.stUpdateBtn}</span>
                </button>
              </div>

              {synced && (
                <p className="text-[11px] text-emerald-700 font-semibold font-sans animate-bounce text-right" id="synced-success-msg">
                  {t.stSavedMsg}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Right Info (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6" id="settings-sidebar">
          
          {/* Security and privacy notice */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm relative overflow-hidden" id="privacy-card">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#e67e22]" />

            <div className="flex items-center gap-2 mb-4" id="privacy-header">
              <Lock className="w-5 h-5 text-[#e67e22]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a04000]">{t.stSecNoticeTitle}</span>
            </div>

            <h4 className="font-serif text-lg font-bold text-[#541d17]">
              {t.stZeroTrustTitle}
            </h4>

            <p className="text-xs text-[#8e746a] font-sans mt-3 leading-relaxed">
              {t.stZeroTrustDesc}
            </p>

            <ul className="mt-5 space-y-3" id="privacy-standards">
              <li className="text-xs text-[#541d17] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{t.stPrivacyA}</span>
              </li>
              <li className="text-xs text-[#541d17] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{t.stPrivacyB}</span>
              </li>
              <li className="text-xs text-[#541d17] font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{t.stPrivacyC}</span>
              </li>
            </ul>
          </div>

          {/* Caching storage telemetry mock detail */}
          <div className="glass-panel p-5 rounded-2xl border border-[#eddcc1]/20 bg-white/40 flex items-center gap-4 text-xs font-sans text-[#a04000]" id="storage-telemetry">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#e67e22]">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-[#541d17]">Offline Map Database Version</p>
              <p className="text-[10px] text-[#8e746a] mt-0.5 font-mono">{t.stSizeTelemetryValue}</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
