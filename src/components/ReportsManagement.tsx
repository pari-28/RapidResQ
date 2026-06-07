import React, { useState } from 'react';
import { 
  ClipboardList, 
  MapPin, 
  User, 
  Phone, 
  Clock, 
  AlertOctagon, 
  CheckCircle, 
  SlidersHorizontal,
  Navigation,
  Eye,
  ArrowRight
} from 'lucide-react';
import { Incident } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface ReportsManagementProps {
  incidents: Incident[];
  onUpdateIncidentStatus?: (id: string, status: Incident['status'], team?: string) => void;
  onViewOnMap?: (incidentId: string) => void;
  language?: 'en' | 'hi';
}

export default function ReportsManagement({ 
  incidents, 
  onUpdateIncidentStatus, 
  onViewOnMap,
  language = 'en' 
}: ReportsManagementProps) {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'critical' | 'resolved' | 'unresolved'>('all');

  // Priority and status labels
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

  // Sort by newest first (since we usually assign ID or can look at newest in list)
  // Let's copy and reverse or sort by ID in descending order
  const getSortedIncidents = () => {
    return [...incidents].sort((a, b) => b.id.localeCompare(a.id));
  };

  const sortedIncidents = getSortedIncidents();

  // Filter based on selected Tab
  const getFilteredIncidents = () => {
    switch (activeTab) {
      case 'active':
        return sortedIncidents.filter(inc => inc.status !== 'Resolved');
      case 'critical':
        return sortedIncidents.filter(inc => inc.severity === 'Critical');
      case 'resolved':
        return sortedIncidents.filter(inc => inc.status === 'Resolved');
      case 'unresolved':
        return sortedIncidents.filter(inc => inc.status === 'Reported' || inc.status === 'AI Analyzing');
      case 'all':
      default:
        return sortedIncidents;
    }
  };

  const filteredList = getFilteredIncidents();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-750 border-yellow-250';
      default: return 'bg-slate-50 text-slate-650 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-250';
      case 'Responders Dispatched': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Routed': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'AI Analyzing': return 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse';
      default: return 'bg-neutral-50 text-neutral-700 border-neutral-250';
    }
  };

  return (
    <div className="flex-1 min-h-screen px-10 py-12 flex flex-col justify-between overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0] font-sans" id="reports-management-workspace">
      <div>
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="reports-header-block">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-orange-100 text-[#a04000] border border-orange-200 rounded-full px-2.5 py-0.5 font-bold uppercase">
                {language === 'hi' ? 'सिंहस्थ प्रहरी प्रशासन' : 'Simhastha Sentinel Hub'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-[#e67e22]" />
              <span>{language === 'hi' ? 'रिपोर्ट्स प्रबंधन' : 'Reports Management'}</span>
            </h2>
            <p className="text-sm font-sans text-[#8e746a] mt-1.5">
              {language === 'hi' 
                ? 'सिंहस्थ महाकुंभ के सभी आपातकालीन कॉल्स, लाइव शिकायतें और सक्रिय राहत-कार्यों की निगरानी करें।' 
                : 'Central database panel tracking pilgrim reports, disaster alerts, and deployment workflow transitions.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-[#eddcc1]/80 px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#541d17]" id="filter-meta-stats">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#e67e22]" />
            <span>{incidents.length} {language === 'hi' ? 'कुल रिपोर्ट' : 'Total Reports'}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-[#541d17]/5 p-1.5 rounded-2xl border border-[#eddcc1]/20" id="reports-main-tab-bar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-[#541d17] text-white shadow-md' : 'text-[#62534e] hover:bg-[#541d17]/5 hover:text-[#541d17]'
            }`}
          >
            📋 {language === 'hi' ? 'सभी' : 'All Reports'} ({sortedIncidents.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'active' ? 'bg-[#e67e22] text-white shadow-md' : 'text-[#62534e] hover:bg-[#541d17]/5 hover:text-[#541d17]'
            }`}
          >
            ⏳ {language === 'hi' ? 'सक्रिय' : 'Active'} ({sortedIncidents.filter(i => i.status !== 'Resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'critical' ? 'bg-red-650 text-white shadow-md animate-pulse' : 'text-red-750 hover:bg-red-50'
            }`}
          >
            🚨 {language === 'hi' ? 'गंभीर' : 'Critical'} ({sortedIncidents.filter(i => i.severity === 'Critical').length})
          </button>
          <button
            onClick={() => setActiveTab('resolved')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'resolved' ? 'bg-emerald-600 text-white shadow-md' : 'text-[#62534e] hover:bg-[#541d17]/5 hover:text-[#541d17]'
            }`}
          >
            ✓ {language === 'hi' ? 'निस्तारित' : 'Resolved'} ({sortedIncidents.filter(i => i.status === 'Resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('unresolved')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'unresolved' ? 'bg-amber-600 text-white shadow-md' : 'text-[#62534e] hover:bg-[#541d17]/5 hover:text-[#541d17]'
            }`}
          >
            ⚠️ {language === 'hi' ? 'अनसुलझे' : 'Unresolved'} ({sortedIncidents.filter(i => i.status === 'Reported' || i.status === 'AI Analyzing').length})
          </button>
        </div>

        {/* Reports Grid */}
        {filteredList.length === 0 ? (
          <div className="glass-panel p-16 text-center rounded-3xl border border-[#eddcc1]/40" id="reports-empty-state">
            <ClipboardList className="w-12 h-12 text-[#9c8577]/60 mx-auto mb-3.5" />
            <h4 className="font-serif text-lg font-bold text-[#541d17]">{language === 'hi' ? 'कोई रिपोर्ट उपलब्ध नहीं' : 'No Reports Found'}</h4>
            <p className="text-xs text-[#8e746a] mt-1">
              {language === 'hi' 
                ? 'इस फ़िल्टर के तहत कोई आपातकालीन रिपोर्ट या सजीव सूचनाएं दर्ज नहीं हैं।' 
                : 'No emergency telemetry fits the designated status filter parameters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="reports-cards-grid">
            {filteredList.map((inc) => (
              <div 
                key={inc.id}
                className="bg-white rounded-2xl border border-[#eddcc1]/60 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                id={`report-card-${inc.id}`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#eddcc1]/30 pb-3 mb-4">
                    <span className="font-mono text-[10px] font-extrabold text-[#a04000] tracking-wide">
                      CASE ID: {inc.id}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {inc.timestamp}
                    </span>
                  </div>

                  {/* Badges indicators */}
                  <div className="flex flex-wrap gap-1.5 mb-3.5">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getSeverityColor(inc.severity)}`}>
                      🔥 {severityLabels[inc.severity] || inc.severity}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(inc.status)}`}>
                      {statusLabels[inc.status] || inc.status}
                    </span>
                  </div>

                  {/* Category & Description */}
                  <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
                    {categoryLabels[inc.category] || inc.category}
                  </h4>
                  <p className="text-[#62534e] text-xs font-sans mt-2 leading-relaxed bg-[#541d17]/5 p-3 rounded-xl italic">
                    "{inc.description}"
                  </p>

                  {/* Metadata Stack */}
                  <div className="mt-4 space-y-2 text-xs border-t border-[#eddcc1]/20 pt-3" id="cards-meta-rows">
                    <div className="flex items-center gap-2 text-[#8e746a]">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-semibold text-neutral-800">{inc.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#8e746a]">
                      <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{inc.reporterName} (<span className="font-mono">{inc.reporterPhone}</span>)</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#8e746a]">
                      <ClipboardList className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>
                        {language === 'hi' ? 'तैनात दल' : 'Assigned Platoon'}:{' '}
                        <strong className="text-neutral-800">{inc.assignedTeam || (language === 'hi' ? 'लंबित' : 'Pending Allocation')}</strong>
                      </span>
                    </div>

                    {inc.latitude && inc.longitude && (
                      <div className="text-[10px] font-mono text-purple-600 bg-purple-50 p-1.5 rounded-lg border border-purple-100 flex justify-between">
                        <span>LAT: {inc.latitude}</span>
                        <span>LONG: {inc.longitude}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                {onViewOnMap && (
                  <div className="mt-6 border-t border-[#eddcc1]/20 pt-4 flex gap-2">
                    <button
                      onClick={() => onViewOnMap(inc.id)}
                      className="flex-1 py-2 rounded-xl bg-[#541d17] hover:bg-[#e67e22] text-white text-[11px] font-sans font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? '📍 स्थान देखें' : '📍 View Location'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {onViewOnMap && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-[11px] text-[#a04000] font-sans mt-8 flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            {language === 'hi'
              ? 'स्थान देखने के लिए किसी भी कार्ड के "स्थान देखें" बटन पर क्लिक करें। इससे लाइव मानचित्र खुल जाएगा और घटना स्थल पर केंद्रित हो जाएगा।'
              : 'Click "View Location" on any report card to instantly center it inside the GIS map module and trigger route analysis navigation.'}
          </span>
        </div>
      )}
    </div>
  );
}
