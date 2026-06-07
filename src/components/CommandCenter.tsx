import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Activity, 
  Shield, 
  Flame, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Users, 
  Truck, 
  AlertOctagon,
  Lock,
  LogOut,
  RefreshCw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Incident } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { auth, signInWithEmailAndPassword, signOut } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface CommandCenterProps {
  incidents: Incident[];
  onUpdateIncidentStatus: (id: string, status: Incident['status'], team?: string) => void;
  onDeployResource: (category: string, unitName: string) => void;
  language?: 'en' | 'hi';
  onViewOnMap?: (incidentId: string) => void;
}

export default function CommandCenter({ 
  incidents, 
  onUpdateIncidentStatus, 
  onDeployResource,
  language = 'en',
  onViewOnMap
}: CommandCenterProps) {
  const t = TRANSLATIONS[language];
  const [activeRole, setActiveRole] = useState<'central' | 'medical' | 'police' | 'fire'>('central');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Admin Logged-In Security Protection state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return auth.currentUser ? !auth.currentUser.isAnonymous : false;
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Reports Management Console Tab Filters State
  const [reportsFilterTab, setReportsFilterTab] = useState<'all' | 'active' | 'resolved' | 'unresolved' | 'critical'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'standard' | 'priority' | 'nearby' | 'ranking'>('standard');

  // AI Incident Prioritization states
  const [aiPriorities, setAiPriorities] = useState<any[]>([]);
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [prioritizeError, setPrioritizeError] = useState<string | null>(null);

  // Backwards compatibility auto-seeding of AI priorities
  useEffect(() => {
    if (incidents.length > 0 && aiPriorities.length === 0) {
      const autoQueue = incidents.map(inc => {
        let pLevel = inc.severity;
        let rText = `Assessed category threat index for ${inc.category.toLowerCase()} at ${inc.location}. Keep vigilant.`;
        if (inc.category === 'Medical Emergency') {
          pLevel = 'Critical';
          rText = `Possible unconscious pilgrim requiring immediate medical treatment at ${inc.location}. Delay presents severe life hazard.`;
        } else if (inc.category === 'Water Rescue') {
          pLevel = 'Critical';
          rText = `Deep water current drowning hazard. Immediate SDRF scuba team mobilization required.`;
        } else if (inc.category === 'Fire Hazard') {
          pLevel = 'Critical';
          rText = `Dry log sparks spreading rapidly in congested pontoon sector near ${inc.location}.`;
        } else if (inc.category === 'Crowd Congestion') {
          pLevel = 'High';
          rText = `Extreme human bottlenecking at pontoon gates in ${inc.location}. Cordon recommended.`;
        }
        return {
          id: inc.id,
          priority: pLevel,
          reason: rText,
          recommendedTeam: inc.category === 'Medical Emergency' || inc.category === 'Water Rescue' ? 'Medical Team' : inc.category === 'Fire Hazard' ? 'Fire Team' : 'Police'
        };
      });
      setAiPriorities(autoQueue);
    }
  }, [incidents, aiPriorities]);

  // Telemetry sub-caches to simulate live feedback
  const [medicalBeds, setMedicalBeds] = useState({ A: 14, B: 3, C: 8 });
  const [barricadesState, setBarricadesState] = useState({ A: true, B: true });
  const [firePumpsActive, setFirePumpsActive] = useState(true);

  // Handler for secure administrator authentication challenge
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, adminEmail.trim(), adminPassword);
    } catch (error: any) {
      console.error("Firebase auth login error:", error);
      const friendlyMessage = error.message || String(error);
      if (friendlyMessage.includes('auth/invalid-credential') || friendlyMessage.includes('auth/user-not-found') || friendlyMessage.includes('auth/wrong-password') || friendlyMessage.includes('auth/invalid-email')) {
        setLoginError(language === 'hi' ? 'गलत क्रेडेंशियल! कृपया अपने प्रमाणित ईमेल और पासवर्ड की जाँच करें।' : 'Access denied. Please check registered email and password.');
      } else {
        setLoginError(friendlyMessage);
      }
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Run server-side Gemini AI Prioritization on current active incident reports
  const handleAIPrioritization = async () => {
    setIsPrioritizing(true);
    setPrioritizeError(null);
    const activeIncidents = incidents.filter(inc => inc.status !== 'Resolved');
    
    if (activeIncidents.length === 0) {
      setPrioritizeError(language === 'hi' ? 'प्राथमिकता देने के लिए कोई सक्रिय रिपोर्ट उपलब्ध नहीं है।' : 'No active incident reports found to analyze.');
      setIsPrioritizing(false);
      return;
    }

    try {
      const res = await fetch('/api/gemini/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents: activeIncidents })
      });
      if (!res.ok) throw new Error('Prioritize function returned status code: ' + res.status);
      const data = await res.json();
      setAiPriorities(data.queue || []);
    } catch (err: any) {
      console.error('AI prioritization extraction failed:', err);
      setPrioritizeError(err.message || 'Error occurred during AI-powered crowd prioritization.');
    } finally {
      setIsPrioritizing(false);
    }
  };

  // Filter incidents based on active role and reports management sub-tabs
  const getFilteredIncidents = () => {
    let list = [...incidents];
    
    // Role level separation matching specific incident domains
    if (activeRole === 'medical') {
      list = list.filter(inc => inc.category === 'Medical Emergency' || inc.category === 'Water Rescue');
    } else if (activeRole === 'police') {
      list = list.filter(inc => inc.category === 'Crowd Congestion' || inc.category === 'Lost Person' || inc.category === 'Security Threat');
    } else if (activeRole === 'fire') {
      list = list.filter(inc => inc.category === 'Fire Hazard' || inc.category === 'Infrastructure Issue');
    }

    // Secondary Reports tab level filters (Active only on Central control or reports grids)
    if (activeRole === 'central') {
      if (reportsFilterTab === 'active') {
        list = list.filter(inc => inc.status !== 'Resolved');
      } else if (reportsFilterTab === 'resolved') {
        list = list.filter(inc => inc.status === 'Resolved');
      } else if (reportsFilterTab === 'unresolved') {
        list = list.filter(inc => inc.status === 'Reported' || inc.status === 'AI Analyzing');
      } else if (reportsFilterTab === 'critical') {
        list = list.filter(inc => inc.severity === 'Critical');
      }
    }
    return list;
  };

  const filteredIncidents = getFilteredIncidents();

  // Multi-lingual translation mapping overrides
  const severityLabels: Record<string, string> = {
    Critical: language === 'hi' ? 'अति-गंभीर' : 'Critical',
    High: language === 'hi' ? 'उच्च' : 'High',
    Medium: language === 'hi' ? 'सामान्य' : 'Medium',
    Low: language === 'hi' ? 'न्यून' : 'Low'
  };

  const statusLabels: Record<string, string> = {
    Reported: language === 'hi' ? 'दर्ज' : 'Reported',
    'AI Analyzing': language === 'hi' ? 'एआई विश्लेषण' : 'AI Analyzing',
    Routed: language === 'hi' ? 'मार्गित' : 'Routed',
    'Responders Dispatched': language === 'hi' ? 'सुरक्षाकर्मी रवाना' : 'Responders Dispatched',
    Resolved: language === 'hi' ? 'पूर्ण सुलझाया गया' : 'Resolved'
  };

  const categoryLabels: Record<string, string> = {
    'Medical Emergency': language === 'hi' ? 'चिकित्सा आपात' : 'Medical Emergency',
    'Water Rescue': language === 'hi' ? 'जल बचाव' : 'Water Rescue',
    'Crowd Congestion': language === 'hi' ? 'अत्यधिक भीड़ स्थल' : 'Crowd Congestion',
    'Lost Person': language === 'hi' ? 'लापता तीर्थयात्री' : 'Lost Person',
    'Security Threat': language === 'hi' ? 'सुरक्षा खतरा' : 'Security Threat',
    'Fire Hazard': language === 'hi' ? 'अग्नि संकट' : 'Fire Hazard',
    'Infrastructure Issue': language === 'hi' ? 'अवसंरचना क्षति' : 'Infrastructure Issue'
  };

  const totalCount = incidents.length;
  const criticalCount = incidents.filter(inc => inc.severity === 'Critical').length;
  const activeCount = incidents.filter(inc => inc.status !== 'Resolved').length;
  const resolvedCount = incidents.filter(inc => inc.status === 'Resolved').length;
  const unresolvedCount = incidents.filter(inc => inc.status === 'Reported' || inc.status === 'AI Analyzing').length;

  // Visual roles definitions
  const roles = [
    { id: 'central', label: t.centralCommandLabel, icon: Building, color: 'border-orange-500 text-[#541d17]' },
    { id: 'medical', label: t.medicalResponseLabel, icon: Activity, color: 'border-emerald-500 text-[#541d17]' },
    { id: 'police', label: t.policeSecurityLabel, icon: Shield, color: 'border-blue-500 text-[#541d17]' },
    { id: 'fire', label: t.fireDisasterLabel, icon: Flame, color: 'border-red-500 text-[#541d17]' }
  ] as const;

  // Render the unauthenticated admin gate view if credential has not been entered
  if (!isAdminLoggedIn) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center p-6 bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="admin-gate-screen">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-[#eddcc1]/80 shadow-xl flex flex-col space-y-6" id="login-card">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#541d17]/5 text-[#541d17] border border-[#eddcc1] rounded-full flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8 text-[#e67e22]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#541d17]">{language === 'hi' ? 'कुंभ नियंत्रण कक्ष लॉगिन' : 'Simhastha Admin Portal'}</h2>
            <p className="text-xs text-[#8e746a] font-sans">
              {language === 'hi' ? 'संवेदनशील मेला रिकॉर्ड देखने के लिए क्रेडेंशियल दर्ज करें।' : 'Enter secure administrative credentials to access command routing.'}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4" id="login-form">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-[#a04000] tracking-wider block">{language === 'hi' ? 'ईमेल पता' : 'Email Address'}</label>
              <input 
                type="email" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@mahakumbh2028.gov.in"
                className="w-full px-4 py-2.5 rounded-xl border border-[#eddcc1] text-xs font-sans text-[#541d17] focus:outline-none focus:ring-1 focus:ring-[#e67e22] focus:border-[#e67e22] bg-[#fffcfb]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase text-[#a04000] tracking-wider block">{language === 'hi' ? 'गोपनीय पासवर्ड' : 'Password'}</label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#eddcc1] text-xs font-sans text-[#541d17] focus:outline-none focus:ring-1 focus:ring-[#e67e22] focus:border-[#e67e22] bg-[#fffcfb]"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[11px] text-red-650 font-medium text-center" id="login-error-tip">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#541d17] hover:bg-[#e67e22] text-white text-xs font-bold font-sans transition-all cursor-pointer shadow-md text-center"
              id="btn-admin-submit"
            >
              🚀 {language === 'hi' ? 'नियंत्रण कक्ष में प्रवेश करें' : 'Authorize & Unlock Deck'}
            </button>
          </form>

          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50 text-[10px] font-mono text-[#a04000]/80 flex gap-2" id="demo-guide-box">
            <span className="font-bold shrink-0">👉 INFO:</span>
            <span>Authenticate using your registered administrator account email and password setup in the Firebase console. No mock anonymous credentials are permitted.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="command-center-workspace">
      
      {/* Upper Title Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" id="cc-headline-sec">
        <div>
          <div className="flex items-center gap-2 mb-2" id="header-context-title">
            <span className="text-[10px] font-mono uppercase bg-[#e67e22]/10 text-[#a04000] border border-[#e67e22]/20 px-2.5 py-1 rounded-full font-bold">
              Simhastha 25-Sector Dispatch Matrix
            </span>
            <span className="w-1.5 h-1.5 bg-[#e67e22] rounded-full animate-ping" />
            <span className="text-xs font-sans text-emerald-600 font-bold">✓ Secure Admin Shell</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
            <Building className="w-8 h-8 text-[#e67e22]" />
            <span>{t.ccTitle}</span>
          </h2>
          <p className="text-sm font-sans text-[#8e746a] mt-1.5 max-w-3xl leading-relaxed">
            {t.ccSubtitle}
          </p>
        </div>
        
        {/* Logout Control Button */}
        <button
          onClick={handleAdminLogout}
          className="self-start md:self-center px-4 py-2 bg-white hover:bg-red-50 border border-[#eddcc1] text-[#541d17] font-semibold text-xs rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          id="btn-admin-logout"
          type="button"
        >
          <LogOut className="w-3.5 h-3.5 text-red-650" />
          <span>{language === 'hi' ? 'सुरक्षित लॉगआउट' : 'Lock Console'}</span>
        </button>
      </div>

      {/* Role Navigation Dashboard Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="cc-role-nav">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => {
                setActiveRole(role.id);
                setSelectedIncident(null);
              }}
              className={`flex items-center gap-3 p-4 rounded-3xl border text-left transition-all duration-300 cursor-pointer ${
                isActive 
                  ? 'border-[#e67e22] bg-gradient-to-br from-white to-[#fff2e6] shadow-md -translate-y-0.5' 
                  : 'border-[#eddcc1]/60 hover:border-gray-300 bg-white/40 hover:bg-white/60'
              }`}
              id={`role-tab-${role.id}`}
              type="button"
            >
              <div className={`p-2.5 rounded-xl ${
                isActive 
                  ? 'bg-[#e67e22] text-white' 
                  : role.id === 'medical' ? 'bg-emerald-50 text-emerald-600'
                  : role.id === 'police' ? 'bg-blue-50 text-blue-600'
                  : role.id === 'fire' ? 'bg-red-50 text-red-600'
                  : 'bg-orange-50 text-[#e67e22]'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold uppercase text-[#a04000] tracking-wider">{t.activeChannel}</p>
                <h4 className="font-sans font-bold text-xs text-[#541d17]">{role.label}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Numerical Quick Counters widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="cc-metric-cards">
        <div className="glass-panel p-4.5 rounded-2xl border border-[#eddcc1]/40 flex items-center justify-between" id="metric-total-box">
          <div>
            <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">{t.totalIncidents}</span>
            <span className="text-2xl font-serif font-extrabold text-[#541d17] block mt-1">{totalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#e67e22]">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4.5 rounded-2xl border border-[#eddcc1]/40 flex items-center justify-between" id="metric-critical-box">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider block">{t.criticalRisk}</span>
            <span className="text-2xl font-serif font-extrabold text-red-600 block mt-1">{criticalCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4.5 rounded-2xl border border-[#eddcc1]/40 flex items-center justify-between" id="metric-active-box">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#e67e22] uppercase tracking-wider block">{t.activeQueue}</span>
            <span className="text-2xl font-serif font-extrabold text-[#e67e22] block mt-1">{activeCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#e67e22]">
            <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <div className="glass-panel p-4.5 rounded-2xl border border-[#eddcc1]/40 flex items-center justify-between" id="metric-resolved-box">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">{t.resolvedCases}</span>
            <span className="text-2xl font-serif font-extrabold text-emerald-600 block mt-1">{resolvedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main split dashboard pane */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start" id="cc-main-grid">
        
        {/* LEFT COMPONENT: Incident Desk & Reports Tabs (8/12 block) */}
        <div className="xl:col-span-8 space-y-6" id="cc-left-column">
          
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm bg-white" id="incidents-panel-main">
            
            {/* Headers and Management Category Filters */}
            <div className="flex flex-col border-b border-[#eddcc1]/20 pb-4 mb-5 gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#541d17] flex items-center gap-2">
                    <span>{t.activeIncidentDesks}</span>
                    <span className="text-xs bg-orange-100 text-[#a04000] border border-orange-200 px-2.5 py-0.5 rounded-full font-mono font-bold">
                      {filteredIncidents.length} {language === 'hi' ? 'रिकॉर्ड्स' : 'Records'}
                    </span>
                  </h3>
                  <p className="text-[11px] font-sans text-[#8e746a] mt-0.5">
                    {language === 'hi' ? 'सक्रिय विंग:' : 'Reviewing reports catalog for status wing:'} <strong className="text-[#a04000]">{roles.find(r => r.id === activeRole)?.label || activeRole}</strong>.
                  </p>
                </div>

                {/* AI Triage Dispatch Core analysis trigger */}
                {activeRole === 'central' && (
                  <button
                    onClick={handleAIPrioritization}
                    disabled={isPrioritizing}
                    className="px-4 py-2 rounded-full bg-purple-650 hover:bg-purple-700 disabled:bg-purple-300 text-white font-sans text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-200"
                    id="btn-ai-triage-analytics"
                  >
                    {isPrioritizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />}
                    <span>{language === 'hi' ? '🤖 एआई प्राथमिकता विश्लेषण' : '🤖 AI Prioritization Analyser'}</span>
                  </button>
                )}
              </div>

              {/* Secure Reports Management tab selector (All, Active, Resolved, Unresolved, Critical Reports) */}
              {activeRole === 'central' && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2 bg-neutral-50 p-1 rounded-xl border border-neutral-150-etc" id="reports-subtabs-controller">
                  <button 
                    onClick={() => setReportsFilterTab('all')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${reportsFilterTab === 'all' ? 'bg-[#541d17] text-white shadow' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    🚀 All Reports ({totalCount})
                  </button>
                  <button 
                    onClick={() => setReportsFilterTab('active')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${reportsFilterTab === 'active' ? 'bg-[#541d17] text-white shadow' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    ⏳ Active Reports ({activeCount})
                  </button>
                  <button 
                    onClick={() => setReportsFilterTab('resolved')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${reportsFilterTab === 'resolved' ? 'bg-[#541d17] text-white shadow' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    ✓ Resolved Reports ({resolvedCount})
                  </button>
                  <button 
                    onClick={() => setReportsFilterTab('unresolved')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${reportsFilterTab === 'unresolved' ? 'bg-[#541d17] text-white shadow' : 'text-neutral-500 hover:text-neutral-800'}`}
                  >
                    ⚠️ Unresolved Reports ({unresolvedCount})
                  </button>
                  <button 
                    onClick={() => setReportsFilterTab('critical')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${reportsFilterTab === 'critical' ? 'bg-red-650 text-white shadow animate-pulse' : 'text-red-700 hover:text-red-900 border border-red-100'}`}
                  >
                    🚨 Critical Reports ({criticalCount})
                  </button>
                </div>
              )}

              {/* Dynamic Dispatch Sub-tab triggers (Standard, Priority Queue, Nearby Proximity, Sector Risk index) */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5 pt-3 border-t border-[#eddcc1]/20" id="dynamic-dispatch-control-triggers">
                <button
                  type="button"
                  onClick={() => { setActiveSubTab('standard'); setSelectedIncident(null); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSubTab === 'standard' ? 'bg-[#541d17] text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-250'
                  }`}
                >
                  📁 {language === 'hi' ? 'मानक सूची' : 'Standard View'}
                </button>

                {activeRole !== 'central' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => { setActiveSubTab('priority'); setSelectedIncident(null); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeSubTab === 'priority' ? 'bg-[#e25c00] text-white font-extrabold shadow-sm animate-pulse' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-105'
                      }`}
                    >
                      <span>🤖 {language === 'hi' ? 'प्राथमिकता कतार' : 'View Priority Queue'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveSubTab('nearby'); setSelectedIncident(null); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeSubTab === 'nearby' ? 'bg-[#27ae60] text-white font-extrabold shadow-sm' : 'bg-emerald-50 text-emerald-750 hover:bg-emerald-100 border border-emerald-105'
                      }`}
                    >
                      <span>📍 {language === 'hi' ? 'आसपास की घटनाएं' : 'View Nearby Incidents'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => { setActiveSubTab('priority'); setSelectedIncident(null); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeSubTab === 'priority' ? 'bg-[#e25c00] text-white font-extrabold shadow-sm' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-105'
                      }`}
                    >
                      <span>🤖 {language === 'hi' ? 'सभी प्राथमिकताएं' : 'View All Priority Queues'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveSubTab('nearby'); setSelectedIncident(null); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeSubTab === 'nearby' ? 'bg-[#27ae60] text-white font-extrabold shadow-sm' : 'bg-emerald-50 text-emerald-750 hover:bg-emerald-100 border border-emerald-105'
                      }`}
                    >
                      <span>📍 {language === 'hi' ? 'सभी आसपास की घटनाएं' : 'View All Nearby Incidents'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveSubTab('ranking'); setSelectedIncident(null); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeSubTab === 'ranking' ? 'bg-indigo-600 text-white font-extrabold shadow-sm' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-105'
                      }`}
                    >
                      <span>📊 {language === 'hi' ? 'शहर-व्यापी रैंकिंग' : 'View City-Wide Incident Ranking'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* AI prioritization display box if generated */}
            {aiPriorities.length > 0 && activeRole === 'central' && (
              <div className="p-4 bg-purple-50/50 border border-purple-200/50 rounded-2xl mb-5 space-y-3.5 animate-in slide-in-from-top duration-300" id="ai-priority-results-board">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-purple-750 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-spin" style={{ animationDuration: '10s' }} />
                    <span>{language === 'hi' ? 'एआई प्राथमिकताप्राप्त आपातकालीन कतार (सॉर्टेड)' : 'AI-Prioritized Emergency Dispatch Triage (Real-Time sorted)'}</span>
                  </span>
                  <button 
                    onClick={() => setAiPriorities([])}
                    className="text-[10px] font-sans hover:underline text-[#a04000] font-bold"
                  >
                    ✕ {language === 'hi' ? 'सूची छिपाएं' : 'Hide Queue'}
                  </button>
                </div>

                <div className="divide-y divide-purple-100 space-y-2.5">
                  {aiPriorities.map((item, index) => {
                    const originalIncident = incidents.find(i => i.id === item.id);
                    if (!originalIncident) return null;
                    return (
                      <div key={item.id} className="pt-2.5 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs leading-relaxed">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-extrabold text-purple-800 font-bold">#{index + 1} Index (ID: {item.id})</span>
                            <span className={`px-2 py-0.2 rounded-full font-mono font-black text-[9px] uppercase ${item.priority === 'Critical' ? 'bg-red-600 text-white animate-pulse' : item.priority === 'High' ? 'bg-orange-500 text-white' : 'bg-yellow-400 text-neutral-900'}`}>{item.priority} priority</span>
                            <span className="text-[10px] text-neutral-400">({originalIncident.category})</span>
                          </div>
                          <p className="text-[#541d17] font-bold">"{originalIncident.description}"</p>
                          <p className="text-purple-900 text-[11px] font-sans bg-purple-50 p-2 rounded-lg italic">🧠 <strong>Triage Explanation:</strong> {item.reason}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className="text-[9px] font-mono uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">Recommend: {item.recommendedTeam}</span>
                          <button
                            onClick={() => {
                              setSelectedIncident(originalIncident);
                              const targetElement = document.getElementById('incident-detail-panel');
                              if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-[10px] text-blue-600 font-bold hover:underline py-1 px-2 hover:bg-blue-50 rounded"
                          >
                            🔍 {language === 'hi' ? 'विवरण देखें व प्रेषण' : 'Inspect Details'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {prioritizeError && (
              <div className="p-3 bg-red-50 border border-red-150 text-xs text-red-650 rounded-xl mb-4 text-center">
                ⚠️ {prioritizeError}
              </div>
            )}

            {/* Incidents feed rendering loops, dynamically switching based on activeSubTab state */}
            {activeSubTab === 'standard' ? (
              filteredIncidents.length === 0 ? (
                <div className="text-center py-16 bg-neutral-50/20 rounded-2xl border border-dashed border-[#eddcc1]/50" id="cc-empty-state">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-60 animate-bounce" />
                  <h4 className="font-sans font-bold text-[#541d17] text-sm">{t.allQuietInSector}</h4>
                  <p className="text-xs text-[#8e746a] mt-1 max-w-sm mx-auto font-sans leading-normal">
                    {t.allQuietDesc}
                  </p>
                </div>
              ) : (
                <div className="space-y-3" id="incidents-feed-list">
                  {filteredIncidents.map((incident) => {
                    const isSelected = selectedIncident?.id === incident.id;
                    const severityColors = {
                      Critical: 'bg-red-650 border-red-300 text-white font-bold animate-pulse',
                      High: 'bg-orange-500 border-orange-600 text-white font-semibold',
                      Medium: 'bg-yellow-400 border-yellow-500 text-[#541d17] font-semibold',
                      Low: 'bg-gray-100 border-gray-300 text-gray-700'
                    };

                    const statusColors = {
                      Reported: 'bg-indigo-50 text-indigo-750 border-indigo-200',
                      'AI Analyzing': 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
                      Routed: 'bg-blue-50 text-blue-700 border-blue-200',
                      'Responders Dispatched': 'bg-amber-100 text-[#a04000] border-amber-300 animate-pulse font-bold',
                      Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    };

                    return (
                      <button
                        key={incident.id}
                        onClick={() => setSelectedIncident(incident)}
                        className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                          isSelected 
                            ? 'border-[#e67e22] bg-[#fffaf5] shadow-md shadow-orange-100/40 ring-1 ring-[#e67e22]/20' 
                            : 'border-[#eddcc1]/30 bg-neutral-50/40 hover:bg-neutral-50/80 hover:border-[#eddcc1]'
                        }`}
                        id={`incident-item-${incident.id}`}
                        type="button"
                      >
                        <div className="space-y-2 max-w-[85%]" id={`incident-head-${incident.id}`}>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md border ${severityColors[incident.severity]}`}>
                              {severityLabels[incident.severity] || incident.severity}
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md border ${statusColors[incident.status]}`}>
                              {statusLabels[incident.status] || incident.status}
                            </span>
                            <span className="text-[10px] font-sans font-black text-[#541d17] uppercase tracking-wider block">
                              {categoryLabels[incident.category] || incident.category}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400">
                              • {incident.timestamp}
                            </span>
                          </div>

                          <p className="font-sans font-bold text-xs text-[#541d17] leading-relaxed">
                            "{incident.description}"
                          </p>

                          <div className="flex flex-wrap items-center gap-3.5 text-[10px] text-neutral-500 font-sans" id={`incident-foot-${incident.id}`}>
                            <span className="flex items-center gap-1 text-[#e67e22] font-semibold">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{incident.location || 'Unknown Location'}</span>
                            </span>
                            <span>•</span>
                            <span>By: {incident.reporterName} ({incident.reporterPhone})</span>
                            {incident.assignedTeam && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-700 font-bold uppercase font-mono tracking-wider bg-emerald-50 border border-emerald-100 px-2 py-0.2 rounded-md">
                                  {t.deployedLabel}: {incident.assignedTeam}
                                </span>
                              </>
                            )}
                          </div>

                          {incident.aiAnalysisNotes && (
                            <div className="p-2 py-1.5 bg-[#541d17]/5 rounded-xl text-[10px] text-[#541d17] md:max-w-2xl font-sans italic border border-[#eddcc1]/25">
                              📖 {incident.aiAnalysisNotes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center" id={`incident-actions-${incident.id}`}>
                          {incident.status !== 'Resolved' ? (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-red-650 animate-ping" />
                              <span className="text-[10px] uppercase font-mono font-bold text-red-600">{t.pendingBadge}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{t.resolvedBadge}</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            ) : activeSubTab === 'priority' ? (
              // 1. AI-PRIORITIZED VIEW
              <div className="space-y-4" id="view-priority-queue-block">
                <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-xs text-orange-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold flex items-center gap-1">🤖 AI-Triage Prioritized Dispatch Board</span>
                    <p className="text-[11px] text-orange-800 mt-0.5">Chronologically sorted prioritizing life safety, crowd density risk index, and waterway hazard levels.</p>
                  </div>
                  <span className="text-[10px] font-mono bg-orange-600 text-white px-2.5 py-1 rounded-lg uppercase font-black">Urgent Focus</span>
                </div>

                <div className="space-y-3">
                  {[...filteredIncidents]
                    .filter(inc => inc.status !== 'Resolved')
                    .sort((a, b) => {
                      const valueMap: Record<string, number> = { Critical: 1, High: 2, Medium: 3, Low: 4 };
                      return (valueMap[a.severity] || 5) - (valueMap[b.severity] || 5);
                    })
                    .map((incident, idx) => {
                      // Retrieve triage reason from aiPriorities or fallback gracefully
                      const priorityItem = aiPriorities.find(p => p.id === incident.id);
                      const priorityReason = priorityItem ? priorityItem.reason : (
                        incident.category === 'Medical Emergency' 
                          ? 'Possible unconscious pilgrim requiring immediate medical treatment. Delay presents high life hazard.' 
                          : incident.category === 'Water Rescue'
                          ? 'Water drowning flow risk. Scuba rescue boat allocation mandated.'
                          : `Identified active safety alert on ${incident.location || 'site'}. Deploy emergency officers.`
                      );

                      return (
                        <div 
                          key={incident.id}
                          className="bg-white p-5 rounded-2xl border border-orange-200/60 shadow-sm flex flex-col md:flex-row items-start justify-between gap-4"
                        >
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-mono font-bold text-xs">
                                #{idx + 1}
                              </span>
                              <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold ${
                                incident.severity === 'Critical' ? 'bg-red-650 text-white animate-pulse' : 'bg-orange-50 text-orange-700 border border-orange-200'
                              }`}>
                                🔴 {severityLabels[incident.severity] || incident.severity} Priority
                              </span>
                              <span className="text-[10px] font-mono bg-neutral-100 text-[#541d17] border border-neutral-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                                Case ID: {incident.id}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">({incident.timestamp})</span>
                            </div>

                            <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
                              {categoryLabels[incident.category] || incident.category} — <strong className="text-red-700">{incident.location}</strong>
                            </h4>

                            <p className="text-[#62534e] text-xs font-sans italic bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                              "{incident.description}"
                            </p>

                            {/* Priority triage explanation */}
                            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 text-xs text-[#a04000] space-y-0.5">
                              <span className="font-black font-mono text-[9px] tracking-wider uppercase block">🧠 AI Triage Rationale</span>
                              <p className="leading-normal italic">"{priorityReason}"</p>
                            </div>

                            <div className="flex flex-wrap gap-x-4 text-[11px] text-[#8e746a] pt-1">
                              <span>🧑 Reporter: <strong>{incident.reporterName}</strong></span>
                              <span>📞 Tel: <strong className="font-mono">{incident.reporterPhone}</strong></span>
                              <span>Platoon: <strong className="text-[#541d17]">{incident.assignedTeam || 'Pending Allocation'}</strong></span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIncident(incident);
                              const detailBlock = document.getElementById('incident-detail-panel');
                              if (detailBlock) detailBlock.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="shrink-0 py-2 px-3.5 bg-orange-100 hover:bg-orange-200 border border-orange-200 text-[#a04000] text-xs font-sans font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Inspect Dispatch 🔎</span>
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : activeSubTab === 'nearby' ? (
              // 2. NEARBY RESPONDER WORKFLOW VIEW
              <div className="space-y-4" id="view-nearby-proximity-block">
                {/* Display Responder Location anchor coordinates */}
                {(() => {
                  const rCoords = (() => {
                    if (activeRole === 'police') return { name: '👮 Platoon 7 HQ', x: 26, y: 50 };
                    if (activeRole === 'medical') return { name: '🚑 Disaster Mobile Trauma clinic 3', x: 42, y: 60 };
                    if (activeRole === 'fire') return { name: '🔥 SDRF Boat Hazard response unit', x: 68, y: 35 };
                    return { name: 'Central Command Center HQ', x: 50, y: 50 };
                  })();

                  // List of mapped coordinate locations
                  const coordGuide: Record<string, { x: number; y: number }> = {
                    'Ram Ghat, Sector 2': { x: 50, y: 55 },
                    'Mahakaleshwar Corridor Exit': { x: 18, y: 72 },
                    'Harisiddhi Gate Compound': { x: 30, y: 48 },
                    'Mangalnath Sector 5': { x: 80, y: 68 },
                    'Shipra Pontoon Bridge 3': { x: 58, y: 40 },
                    'Dutt Akhara Circle': { x: 65, y: 22 }
                  };

                  const getIncidentDistance = (inc: Incident) => {
                    const coords = coordGuide[inc.location] || (() => {
                      let hash = 0;
                      for (let i = 0; i < inc.location.length; i++) {
                        hash = inc.location.charCodeAt(i) + ((hash << 5) - hash);
                      }
                      return { x: 20 + Math.abs(hash % 65), y: 20 + Math.abs((hash >> 8) % 65) };
                    })();
                    const dist = Math.sqrt(Math.pow(coords.x - rCoords.x, 2) + Math.pow(coords.y - rCoords.y, 2)) * 0.035;
                    const eta = Math.max(2, Math.round(dist * 4.5));
                    return { dist, eta };
                  };

                  const nearbyActiveList = [...filteredIncidents]
                    .filter(inc => inc.status !== 'Resolved')
                    .map(inc => {
                      const metrics = getIncidentDistance(inc);
                      
                      // Smart recommended action logic based on incident category
                      let recAction = "Monitor and deploy safety crowd guards.";
                      if (inc.category === 'Medical Emergency') recAction = "🚑 Dispatch nearest ambulance immediately; prepare clinical trauma beds.";
                      else if (inc.category === 'Water Rescue') recAction = "🏊 Deploy rescue speedboats & dispatch SDRF swimmers immediately.";
                      else if (inc.category === 'Fire Hazard') recAction = "🔥 Dispatch SDRF pressurized water trucks and chemical foam suppressors.";
                      else if (inc.category === 'Crowd Congestion') recAction = "🚧 Close Pontoon bridge entry gates and redirect tourist crowds.";
                      else if (inc.category === 'Security Threat') recAction = "🛡️ Cordon area and deploy rapid security Platoon guards.";

                      return { ...inc, distance: metrics.dist, eta: metrics.eta, recAction };
                    })
                    .sort((a, b) => a.distance - b.distance);

                  return (
                    <>
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950 block space-y-1">
                        <span className="font-bold block uppercase tracking-wider text-[10px] text-emerald-700">📍 Active Responder Proximity Radar</span>
                        <p className="font-semibold text-[#541d17]">Tracking relative distance from your deployed coordinates: <strong className="text-emerald-750">{rCoords.name}</strong> (X: {rCoords.x}%, Y: {rCoords.y}%)</p>
                      </div>

                      {nearbyActiveList.length === 0 ? (
                        <div className="text-center py-10 italic text-neutral-400 text-xs bg-white rounded-2xl border border-[#eddcc1]/30">
                          {language === 'hi' ? 'कोई सक्रिय घटना आसपास दर्ज नहीं है।' : 'Perfect peace. No active local incident reports within radar sweep.'}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {nearbyActiveList.map((inc) => (
                            <div 
                              key={inc.id}
                              className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-start justify-between gap-4 hover:border-emerald-250 transition-colors"
                            >
                              <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-mono font-bold text-xs">
                                    📍 {inc.distance.toFixed(1)} km Away
                                  </span>
                                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold text-xs">
                                    ⏱️ ETA: {inc.eta} mins
                                  </span>
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                                    inc.severity === 'Critical' ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' : 'bg-[#e67e22]/10 text-[#a04000]'
                                  }`}>
                                    {inc.severity} Severity
                                  </span>
                                </div>

                                <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide pt-1">
                                  {categoryLabels[inc.category] || inc.category} at <strong className="text-red-700">{inc.location}</strong>
                                </h4>

                                <p className="text-neutral-600 italic text-xs leading-relaxed bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100">
                                  "{inc.description}"
                                </p>

                                {/* Smart recommended action display */}
                                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-150 text-xs text-neutral-800">
                                  <span className="font-mono text-[9px] tracking-wider text-emerald-800 font-bold uppercase block mb-1">💡 Smart Recommended Action</span>
                                  <p className="font-semibold text-emerald-950 font-sans">{inc.recAction}</p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedIncident(inc);
                                  const detailBlock = document.getElementById('incident-detail-panel');
                                  if (detailBlock) detailBlock.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="shrink-0 py-2 px-3.5 bg-[#541d17] hover:bg-[#e67e22] text-white text-xs font-sans font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <span>Guide Team 🗺️</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              // 3. CITY-WIDE RISK DENSITY RANKINGS (FOR THE CHIEF OF CENTRAL COMMAND)
              <div className="space-y-4 animate-in fade-in" id="view-city-risk-ranking-block">
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-950 block space-y-1">
                  <span className="font-bold flex items-center gap-1">📊 Simhastha Sector Danger Matrix &amp; Crowd Index Level</span>
                  <p className="text-indigo-800 text-[11px]">Real-time cumulative safety risk index mapping sector complaints count and active critical life threat triggers.</p>
                </div>

                <div className="bg-white rounded-2xl border border-neutral-250-etc overflow-hidden">
                  <div className="grid grid-cols-12 bg-neutral-50 p-3.5 text-xs font-mono text-neutral-500 border-b border-neutral-200">
                    <span className="col-span-1 text-center font-bold">#</span>
                    <span className="col-span-5 font-bold">Sector / Location</span>
                    <span className="col-span-2 text-center font-bold">Active Cases</span>
                    <span className="col-span-2 text-center font-bold">Critical Count</span>
                    <span className="col-span-2 text-center font-bold">Threat Index</span>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {(() => {
                      // Sector danger aggregate ranking list
                      const sectorsAggregate: Record<string, { count: number; critical: number }> = {};
                      incidents.forEach(inc => {
                        const locName = inc.location || 'Central Sector';
                        if (!sectorsAggregate[locName]) {
                          sectorsAggregate[locName] = { count: 0, critical: 0 };
                        }
                        if (inc.status !== 'Resolved') {
                          sectorsAggregate[locName].count++;
                        }
                        if (inc.severity === 'Critical') {
                          sectorsAggregate[locName].critical++;
                        }
                      });

                      const sortedSectors = Object.entries(sectorsAggregate)
                        .map(([sector, meta]) => ({ sector, ...meta }))
                        .sort((a, b) => (b.critical * 3 + b.count) - (a.critical * 3 + a.count));

                      if (sortedSectors.length === 0) {
                        return <div className="p-8 text-center italic text-neutral-400 text-xs">No sector reports loaded. All ghat domains green.</div>;
                      }

                      return sortedSectors.map((sec, idx) => {
                        let riskBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                        let riskLevel = 'Stable Green';

                        if (sec.critical > 0) {
                          riskBadgeColor = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
                          riskLevel = '🚨 Critical High';
                        } else if (sec.count > 1) {
                          riskBadgeColor = 'bg-yellow-50 text-yellow-750 border-yellow-205';
                          riskLevel = '⚠️ Medium Risk';
                        }

                        return (
                          <div key={sec.sector} className="grid grid-cols-12 p-3.5 text-xs items-center font-sans">
                            <span className="col-span-1 font-mono text-center text-[#eddcc1] font-bold text-sm">#{idx + 1}</span>
                            <span className="col-span-5 font-semibold text-[#541d17]">{sec.sector}</span>
                            <span className="col-span-2 text-center font-mono font-bold text-neutral-800">{sec.count}</span>
                            <span className="col-span-2 text-center font-mono font-bold text-red-600">{sec.critical}</span>
                            <div className="col-span-2 text-center">
                              <span className={`px-2 py-0.5 rounded border text-[9px] uppercase font-mono font-bold ${riskBadgeColor}`}>
                                {riskLevel}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role specifics layout telemetry grids (Active on medical / police / fire dashboard layers) */}
          {activeRole === 'medical' && (
            <div className="p-6 rounded-3xl bg-white border border-[#eddcc1]/40 shadow-sm space-y-4" id="medical-camp-telemetry-layer">
              <h3 className="font-serif text-base font-bold text-[#541d17] flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span>{t.medicalCampsTelemetry}</span>
              </h3>
              <p className="text-xs text-[#8e746a] font-sans leading-normal">
                {t.medicalCampsDesc}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                  <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">Camp Ghat #1</span>
                  <h4 className="font-sans font-bold text-sm text-[#541d17] mt-1">{t.medicalGhatClinic}</h4>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-neutral-500">{t.bedsAvailable}</span>
                    <strong className="font-mono text-sm">{medicalBeds.A} / 20</strong>
                  </div>
                  <button 
                    onClick={() => setMedicalBeds(p => ({ ...p, A: Math.min(p.A + 1, 20) }))}
                    className="w-full mt-3 py-1.5 bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200 rounded-lg shadow-sm font-sans text-center cursor-pointer"
                  >
                    + {language === 'hi' ? 'बेड बहाल करें' : 'Release Patient Bed'}
                  </button>
                </div>

                <div className="p-4 bg-orange-50/30 border border-orange-100/40 rounded-2xl">
                  <span className="text-[9px] font-mono text-[#a04000] font-bold uppercase tracking-wider block">Camp Temple #2</span>
                  <h4 className="font-sans font-bold text-sm text-[#541d17] mt-1">{t.medicalTempleStation}</h4>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-neutral-500">{t.bedsAvailable}</span>
                    <strong className="font-mono text-sm text-red-650">{medicalBeds.B} / 10 (CRITICAL)</strong>
                  </div>
                  <button 
                    onClick={() => setMedicalBeds(p => ({ ...p, B: Math.min(p.B + 1, 10) }))}
                    className="w-full mt-3 py-1.5 bg-white text-[#a04000] text-[10px] font-bold border border-orange-200 rounded-lg shadow-sm font-sans text-center cursor-pointer"
                  >
                    + {language === 'hi' ? 'बेड बहाल करें' : 'Release Patient Bed'}
                  </button>
                </div>

                <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl">
                  <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-wider block">Transit Annex #3</span>
                  <h4 className="font-sans font-bold text-sm text-[#541d17] mt-1">{t.medicalGateTent}</h4>
                  <div className="flex justify-between items-center mt-3 text-xs">
                    <span className="text-neutral-500">{t.bedsAvailable}</span>
                    <strong className="font-mono text-sm">{medicalBeds.C} / 15</strong>
                  </div>
                  <button 
                    onClick={() => setMedicalBeds(p => ({ ...p, C: Math.min(p.C + 1, 15) }))}
                    className="w-full mt-3 py-1.5 bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200 rounded-lg shadow-sm font-sans text-center cursor-pointer"
                  >
                    + {language === 'hi' ? 'बेड बहाल करें' : 'Release Patient Bed'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'police' && (
            <div className="p-6 rounded-3xl bg-white border border-[#eddcc1]/40 shadow-sm space-y-4" id="police-telemetry-layer">
              <h3 className="font-serif text-base font-bold text-[#541d17] flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 animate-pulse" />
                <span>{t.policeDeployments}</span>
              </h3>
              <p className="text-xs text-[#8e746a] font-sans">
                {t.policeDeploymentsDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/20 border border-blue-100/50 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-blue-700 font-bold block uppercase tracking-wide">QRT Platoon 1</span>
                    <h4 className="font-sans font-bold text-sm text-[#541d17] mt-0.5">{t.policeCampA}</h4>
                    <p className="text-[11px] text-neutral-500 mt-1">{t.policeCampAStaff}</p>
                  </div>
                  <span className="mt-3 inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-100 font-bold font-mono text-[9px] uppercase tracking-wider text-center">
                    👮 Deployed & Monitoring
                  </span>
                </div>

                <div className="p-4 bg-orange-50/20 border border-orange-100/50 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#a04000] font-bold block uppercase tracking-wide">Barrier Control 2</span>
                    <h4 className="font-sans font-bold text-sm text-[#541d17] mt-0.5">{t.policeCampB}</h4>
                    <p className="text-[11px] text-neutral-500 mt-1">{t.policeCampBStaff}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-orange-100/20 pt-2">
                    <button 
                      onClick={() => setBarricadesState(p => ({ ...p, B: !p.B }))}
                      className={`px-3 py-1 py-1.5 rounded-lg text-[10px] font-sans font-extrabold cursor-pointer transition-colors ${barricadesState.B ? 'bg-orange-655 text-orange-950 border border-orange-300 bg-orange-100' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'}`}
                    >
                      {barricadesState.B ? t.barricadesActiveLabel : (language === 'hi' ? 'सेक्टर २ बैरिकेड बंद करें' : 'Close Barricades')}
                    </button>
                    <span className={`w-2 h-2 rounded-full ${barricadesState.B ? 'bg-orange-500 animate-ping' : 'bg-neutral-400'}`} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeRole === 'fire' && (
            <div className="p-6 rounded-3xl bg-white border border-[#eddcc1]/40 shadow-sm space-y-4" id="fire-telemetry-layer">
              <h3 className="font-serif text-base font-bold text-[#541d17] flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-650 animate-pulse" />
                <span>{t.fireDeployments}</span>
              </h3>
              <p className="text-xs text-[#8e746a] font-sans">
                {t.fireDeploymentsDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50/10 border border-red-100/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-red-700 font-bold uppercase tracking-wider block">Hydrant Post 1</span>
                    <h4 className="font-sans font-bold text-xs text-[#541d17] mt-1">{t.fireUnitF1}</h4>
                    <p className="text-[10px] text-neutral-400 mt-1">{t.fireUnitF1Desc}</p>
                  </div>
                  <span className="w-full mt-3 block bg-emerald-50 text-emerald-800 text-center font-bold text-[9px] border border-emerald-100/50 py-0.5 rounded uppercase">Standby Ready</span>
                </div>

                <div className="p-4 bg-orange-50/15 border border-orange-100/40 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-[#a04000] font-bold uppercase tracking-wider block">River Pressure Boat</span>
                    <h4 className="font-sans font-bold text-xs text-[#541d17] mt-1">{t.fireUnitF2}</h4>
                    <p className="text-[10px] text-neutral-400 mt-1">{t.fireUnitF2Desc}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px]">
                    <button 
                      onClick={() => setFirePumpsActive(!firePumpsActive)}
                      className={`px-2 py-1 font-bold rounded ${firePumpsActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                    >
                      {firePumpsActive ? t.pumpsActiveLabel : (language === 'hi' ? 'जेट पंप लोड करें' : 'Booster Active')}
                    </button>
                    <span className={`w-2.5 h-2.5 rounded-full ${firePumpsActive ? 'bg-blue-600 animate-ping' : 'bg-neutral-300'}`} />
                  </div>
                </div>

                <div className="p-4 bg-red-50/10 border border-red-100/50 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-red-700 font-bold uppercase tracking-wider block">Auxiliary Camp 3</span>
                    <h4 className="font-sans font-bold text-xs text-[#541d17] mt-1">{t.fireUnitF3}</h4>
                    <p className="text-[10px] text-neutral-400 mt-1">{t.fireUnitF3Desc}</p>
                  </div>
                  <span className="w-full mt-3 block bg-emerald-50 text-emerald-800 text-center font-bold text-[9px] border border-emerald-100/50 py-0.5 rounded uppercase font-sans">Patrolling ghats</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Specific Incident Action, Coordinates and Team Assignment (4/12 block) */}
        <div className="xl:col-span-4 space-y-6" id="cc-right-column">
          
          {selectedIncident ? (
            <div className="glass-panel p-6 rounded-3xl border border-[#e67e22]/30 bg-gradient-to-b from-white/95 to-white/75 shadow-lg relative overflow-hidden" id="incident-detail-panel">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-650 via-[#e67e22] to-red-600" />

              <div className="flex items-center justify-between border-b border-[#eddcc1]/20 pb-3 mb-5" id="detail-head">
                <span className="text-[10px] font-mono font-bold text-[#a04000] uppercase tracking-wider">
                  {t.caseId}: #{selectedIncident.id}
                </span>
                <span className="text-[10px] font-sans text-neutral-400 font-semibold">
                  {t.received}: {selectedIncident.timestamp}
                </span>
              </div>

              {/* Patient / Incident description card inside */}
              <div className="space-y-4" id="detail-card-body">
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#a04000] font-black block tracking-wider">{t.reportedDescription}</span>
                  <h4 className="font-sans font-black text-sm text-[#541d17] mt-1 leading-relaxed">
                    "{selectedIncident.description}"
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3" id="detail-grid-capsules">
                  <div className="p-2.5 rounded-xl bg-[#fffcf8] border border-orange-100">
                    <span className="text-[9px] font-mono text-[#a04000] block uppercase">{t.reporter}</span>
                    <span className="text-xs font-sans font-bold text-[#541d17] block truncate">{selectedIncident.reporterName}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fffcf8] border border-orange-100">
                    <span className="text-[9px] font-mono text-[#a04000] block uppercase">{t.phoneContact}</span>
                    <span className="text-xs font-sans font-bold text-[#541d17] block">{selectedIncident.reporterPhone}</span>
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 space-y-1.5" id="detail-location-sub">
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase">{t.mappedGpsAnchor}</span>
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <MapPin className="w-4 h-4 text-[#e67e22] shrink-0" />
                      <span className="text-xs font-sans font-bold text-[#541d17] truncate">{selectedIncident.location}</span>
                    </div>
                    {onViewOnMap && (
                      <button
                        type="button"
                        onClick={() => onViewOnMap(selectedIncident.id)}
                        className="px-2.5 py-1 bg-[#541d17] hover:bg-[#a04000] text-white text-[9.5px] font-bold rounded-lg cursor-pointer transition-transform hover:scale-103 flex items-center gap-1 shrink-0"
                      >
                        <span>🧭 Navigate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Structured Incident analysis report detail */}
                <div className="p-4 bg-orange-50/40 border border-[#e67e22]/20 rounded-2xl relative overflow-hidden" id="ai-triage-card">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Sparkles className="w-16 h-16 text-[#e67e22]" />
                  </div>

                  <div className="flex items-center gap-1.5 mb-2.5" id="ai-head-line">
                    <Sparkles className="w-4 h-4 text-[#e67e22] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#a04000]">{t.aiTriageHead}</span>
                  </div>

                  <p className="text-[11px] font-sans text-[#a04000] font-semibold leading-relaxed">
                    <strong>{t.aiSeverityDet}:</strong> <span className="text-red-700 font-bold">{severityLabels[selectedIncident.severity] || selectedIncident.severity}</span>
                  </p>
                  
                  <p className="text-[11px] font-sans text-neutral-600 leading-relaxed mt-2" id="ai-analysis-text">
                    {selectedIncident.aiAnalysisNotes || t.aiTriageDefaultText}
                  </p>

                  <div className="mt-3.5 pt-2 border-t border-orange-100/60 flex items-center justify-between text-[11px]" id="ai-category-badge">
                    <span className="text-[#a04000] font-medium font-sans">{t.routedTargetCat}:</span>
                    <span className="font-mono font-bold uppercase text-red-700 bg-red-100/50 px-2.5 py-0.5 rounded-full border border-red-200/50">
                      {categoryLabels[selectedIncident.category] || selectedIncident.category}
                    </span>
                  </div>
                </div>

                {/* Specific Team Assignments section with instant updates */}
                <div className="pt-4 border-t border-neutral-100 space-y-3.5" id="dispatch-controls-block">
                  <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wide">{language === 'hi' ? 'विशेष दल असाइनमेंट कमांड' : 'Response Team Assignment'}</span>

                  {selectedIncident.status !== 'Resolved' ? (
                    <div className="space-y-4" id="actions-button-grid">
                      
                      {/* Grid of four specific divisions */}
                      <div className="grid grid-cols-2 gap-2" id="specific-teams-grid">
                        <button
                          type="button"
                          onClick={() => {
                            const name = language === 'hi' ? 'एसपी महाकुंभ १ सुरक्षा दस्ता' : 'Simhastha Police Platoon 1';
                            onUpdateIncidentStatus(selectedIncident.id, 'Responders Dispatched', name);
                            setSelectedIncident(prev => prev ? { ...prev, status: 'Responders Dispatched', assignedTeam: name } : null);
                          }}
                          className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-left transition-all leading-tight cursor-pointer"
                        >
                          <span className="text-xs font-bold block">👮 Police</span>
                          <span className="text-[9px] text-blue-600 font-mono">Platoon Sector 2</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const name = language === 'hi' ? 'सेक्टर ९ घाट एम्बुलेंस टीम' : 'Ram Ghat Medical Ambulance Team';
                            onUpdateIncidentStatus(selectedIncident.id, 'Responders Dispatched', name);
                            setSelectedIncident(prev => prev ? { ...prev, status: 'Responders Dispatched', assignedTeam: name } : null);
                          }}
                          className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-left transition-all leading-tight cursor-pointer"
                        >
                          <span className="text-xs font-bold block">🚑 Medical Team</span>
                          <span className="text-[9px] text-emerald-600 font-mono">Camp Unit A</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const name = language === 'hi' ? 'शिप्रा दमकल वाहन स्टेशन ४' : 'Shipra Extinguisher Unit 4';
                            onUpdateIncidentStatus(selectedIncident.id, 'Responders Dispatched', name);
                            setSelectedIncident(prev => prev ? { ...prev, status: 'Responders Dispatched', assignedTeam: name } : null);
                          }}
                          className="p-2.5 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 rounded-xl text-left transition-all leading-tight cursor-pointer"
                        >
                          <span className="text-xs font-bold block">🚒 Fire Team</span>
                          <span className="text-[9px] text-red-650 font-mono">Booster Hydrants</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const name = language === 'hi' ? 'सेक्युलर महाकाल गाइड स्वयंसेवक प्रभाग' : 'Simhastha Guide Volunteers';
                            onUpdateIncidentStatus(selectedIncident.id, 'Responders Dispatched', name);
                            setSelectedIncident(prev => prev ? { ...prev, status: 'Responders Dispatched', assignedTeam: name } : null);
                          }}
                          className="p-2.5 bg-yellow-50 hover:bg-yellow-101 text-yellow-900 border border-yellow-200 rounded-xl text-left transition-all leading-tight cursor-pointer"
                        >
                          <span className="text-xs font-bold block">🙋 Volunteer Team</span>
                          <span className="text-[9px] text-yellow-750 font-mono">Lost & Found Booth</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onUpdateIncidentStatus(selectedIncident.id, 'Resolved');
                          setSelectedIncident(prev => prev ? { ...prev, status: 'Resolved' } : null);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-700/10"
                        id="btn-cc-resolve"
                        type="button"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>{t.markResolvedBtn}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-2xl border border-emerald-100 flex items-center gap-2" id="cc-resolved-card">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold">{t.resolvedClosedMsg}</p>
                        <p className="text-[10px] text-emerald-600 mt-1 font-normal font-sans leading-normal">
                          {t.resolvedClosedDesc}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-[#eddcc1]/45 text-center py-16 bg-white" id="no-incident-focus">
              <Building className="w-12 h-12 text-[#9c8577] mx-auto mb-3 opacity-50" />
              <h3 className="font-serif text-base font-bold text-[#541d17]">{t.operationalSandbox}</h3>
              <p className="text-xs text-[#8e746a] mt-2 max-w-[200px] mx-auto leading-relaxed font-sans">
                {t.selectIncidentHint}
              </p>
            </div>
          )}

          {/* Prayagraj Golden advice block */}
          <div className="glass-panel p-5 rounded-2xl border border-[#eddcc1]/20 bg-white/40 flex items-start gap-4 text-xs font-sans text-[#a04000]" id="cc-quick-tips">
            <span className="w-2 h-2 rounded-full bg-[#e67e22] mt-1 shrink-0 animate-ping" />
            <div>
              <p className="font-bold text-[#541d17]">{t.lessonsPrayagrajTitle}</p>
              <p className="text-[11px] text-[#8e746a] mt-1 font-sans leading-normal">
                {t.lessonsPrayagrajDesc}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
