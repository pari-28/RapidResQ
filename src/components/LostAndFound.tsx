import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  Megaphone,
  CheckCircle2,
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';
import { LostItem } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface LostAndFoundProps {
  language?: 'en' | 'hi';
}

export default function LostAndFound({ language = 'en' }: LostAndFoundProps) {
  const t = TRANSLATIONS[language];
  const [items, setItems] = useState<LostItem[]>([
    {
      id: "1",
      name: language === 'hi' ? "रामलाल उपाध्याय" : "Ramlal Upadhyay",
      age: 72,
      lastSeenLocation: language === 'hi' ? "राम घाट, दत्त अखाड़ा के पास प्लेटफॉर्म संख्या ३" : "Ram Ghat, Platform 3 near Dutt Akhara bridge loop",
      lastSeenTime: language === 'hi' ? "आज, सुबह १०:१५ बजे" : "Today, 10:15 AM",
      description: language === 'hi' ? "पीली धोती और सफेद कुर्ता पहने हुए, पीतल का लोटा लिए हुए। भोजपुरी बोलते हैं।" : "Wearing yellow dhoti and white kurta, carrying a brass water spouted pot (Lota). Speaks Bhojpuri.",
      reporterName: language === 'hi' ? "प्रवीण कुमार उपाध्याय (पुत्र)" : "Praveen Kumar Upadhyay (Son)",
      reporterPhone: "+91 94156 32184",
      status: 'Lost',
      photoSeed: 'ramlal'
    },
    {
      id: "2",
      name: language === 'hi' ? "सरस्वती देवी" : "Saraswati Devi",
      age: 65,
      lastSeenLocation: language === 'hi' ? "हरसिद्धि मंदिर परिसर बाहरी निकास कतार" : "Harsiddhi Temple compound outer exit queue booths",
      lastSeenTime: language === 'hi' ? "कल दोपहर बिछड़ गए" : "Separated yesterday afternoon",
      description: language === 'hi' ? "गुलाबी रंग की सूती साड़ी पहने हुए, लोहे का टिफिन बॉक्स है।" : "Wearing pink cotton saree, holds a red handbag with steel tiffin box. Hard of hearing.",
      reporterName: language === 'hi' ? "हरसिद्धि केबिन डेस्क (Found)" : "Harsiddhi Cabin Desk (Found)",
      reporterPhone: "1920 (Ext 12)",
      status: 'Found',
      photoSeed: 'saraswati'
    },
    {
      id: "3",
      name: language === 'hi' ? "गौरव मिश्रा" : "Gaurav Mishra",
      age: 8,
      lastSeenLocation: language === 'hi' ? "महाकालेश्वर मंदिर निकास द्वार कॉरिडोर" : "Mahakaleshwar Temple exit gate corridors",
      lastSeenTime: language === 'hi' ? "आज, सुबह ०८:३० बजे" : "Today, 08:30 AM",
      description: language === 'hi' ? "नीली शर्ट और गहरे रंग का शॉर्ट्स। हिंदी बोलता है।" : "Wearing blue shirt and gray shorts. Speaks Hindi. Reunited happily via volunteer boat team.",
      reporterName: language === 'hi' ? "महेश मिश्रा (पिता)" : "Mahesh Mishra (Father)",
      reporterPhone: "Reunited",
      status: 'Reunited',
      photoSeed: 'gaurav'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    lastSeenLocation: '',
    lastSeenTime: '',
    description: '',
    reporterName: '',
    reporterPhone: '',
    status: 'Lost' as 'Lost' | 'Found'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.lastSeenLocation) return;

    const newItem: LostItem = {
      id: Date.now().toString(),
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      lastSeenLocation: formData.lastSeenLocation,
      lastSeenTime: formData.lastSeenTime || (language === 'hi' ? "अभी पंजीकृत" : "Just registered"),
      description: formData.description,
      reporterName: formData.reporterName,
      reporterPhone: formData.reporterPhone || "No contact info",
      status: formData.status,
      photoSeed: 'custom' + Date.now().toString().slice(-4)
    };

    setItems(prev => [newItem, ...prev]);
    setShowAddForm(false);
    // Reset form
    setFormData({
      name: '',
      age: '',
      lastSeenLocation: '',
      lastSeenTime: '',
      description: '',
      reporterName: '',
      reporterPhone: '',
      status: 'Lost'
    });
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.lastSeenLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="lostfound-workspace">
      
      {/* Upper header action block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8" id="lostfound-header">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-[#e67e22]" />
            <span>{t.lfTitle}</span>
          </h2>
          <p className="text-sm font-sans text-[#8e746a] mt-1.5">
            {t.lfSubtitle}
          </p>
        </div>

        {/* Dynamic New Register Button */}
        <button
          id="btn-trigger-post"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#e67e22] to-red-500 hover:from-red-500 hover:to-[#e67e22] text-white font-sans text-sm font-bold shadow-md shadow-[#e67e22]/20 hover:scale-103 cursor-pointer active:scale-97 transition-all"
        >
          <UserPlus className="w-4.5 h-4.5" />
          <span>{t.lfRegisterBtn}</span>
        </button>
      </div>

      {/* Global Interactive Search Input */}
      <div className="relative mb-8 max-w-xl" id="lost-search-sec">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9c8577]" />
        <input
          id="search-input-bulletin"
          type="text"
          placeholder={t.lfSearchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-full border border-[#eddcc1]/80 focus:border-[#e67e22] bg-[#ffffff]/70 focus:bg-white focus:outline-none font-sans text-sm text-[#541d17] placeholder-[#a29087]/70 transition-all shadow-sm"
        />
      </div>

      {/* Grid of relative blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="lostfound-cards-grid">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-panel rounded-3xl" id="no-cases-pane">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto animate-pulse" />
            <h4 className="font-serif text-lg font-bold text-[#541d17] mt-3">{t.lfNoCases}</h4>
            <p className="text-xs text-[#8e746a] mt-1 pr-6 pl-6 max-w-sm mx-auto">
              {t.lfNoCasesDesc}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id}
              className="glass-panel p-5 rounded-3xl border border-[#eddcc1]/30 shadow-sm relative flex flex-col justify-between hover:border-[#e67e22]/30 transition-all group"
              id={`case-card-${item.id}`}
            >
              {/* Badge representing current condition */}
              <div className="absolute top-5 right-5" id={`case-badge-${item.id}`}>
                <span className={`text-[9px] font-mono font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                  item.status === 'Lost'
                    ? 'bg-red-50 text-red-650 border-red-200'
                    : item.status === 'Found'
                    ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  ● {item.status === 'Lost' ? t.lfStatusLost : item.status === 'Found' ? t.lfStatusFound : t.lfStatusReunited}
                </span>
              </div>

              {/* Pilgrim Avatar with beautiful customized mandala background */}
              <div className="flex items-center gap-4.5 mb-4" id={`case-avatar-${item.id}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-serif text-lg font-bold shadow-md ${
                  item.status === 'Lost'
                    ? 'bg-gradient-to-tr from-red-600/10 to-red-400/5 text-red-600 border border-red-100'
                    : item.status === 'Found'
                    ? 'bg-gradient-to-tr from-amber-600/10 to-amber-400/5 text-amber-700 border border-amber-150'
                    : 'bg-gradient-to-tr from-emerald-600/10 to-emerald-400/5 text-emerald-800 border border-emerald-100'
                }`}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-[#541d17] group-hover:text-[#e67e22] transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-[10px] font-mono text-[#8e746a] mt-0.5">
                    {item.age ? `${t.lfAgeElderly}: ${item.age} ${t.lfAgeYears}` : t.lfAgeNA}
                  </div>
                </div>
              </div>

              {/* Specs info */}
              <div className="space-y-3 border-t border-[#eddcc1]/25 pt-4" id={`case-specs-${item.id}`}>
                <div className="flex items-start gap-2 text-xs font-sans text-[#62534e]">
                  <MapPin className="w-4 h-4 text-[#e67e22] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#a04000] block tracking-wide">{t.lfLastSeenSpot}</span>
                    <p className="font-semibold text-[#541d17] mt-0.5 leading-snug">{item.lastSeenLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs font-sans text-[#62534e]">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#a04000] block tracking-wide">{t.lfIncidentTime}</span>
                    <p className="font-semibold text-[#541d17] mt-0.5">{item.lastSeenTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs font-sans text-[#62534e]">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-[#a04000] block tracking-wide">{t.lfPhysicalDesc}</span>
                    <p className="text-[#8e746a] mt-0.5 pr-2 leading-relaxed text-xs italic">
                      "{item.description}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Caller Contact Info */}
              <div className="mt-5 pt-3.5 border-t border-dashed border-[#eddcc1]/25 flex items-center justify-between" id={`case-contact-${item.id}`}>
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 block">{t.lfReportHandler}</span>
                  <span className="text-xs font-sans font-bold text-[#541d17]">{item.reporterName}</span>
                </div>

                {item.reporterPhone !== "Reunited" && (
                  <a 
                    href={`tel:${item.reporterPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#541d17] hover:bg-[#e67e22] text-white text-[11px] font-mono font-bold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.lfDialDesk}</span>
                  </a>
                )}
                {item.reporterPhone === "Reunited" && (
                  <span className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.lfSafe}</span>
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Registry Form Modal Sheet Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#541d17]/40 backdrop-blur-md flex items-center justify-center z-50 p-4" id="case-register-modal">
          <div className="bg-gradient-to-b from-[#fffbfc] to-[#fbf7f3] border border-[#eddcc1]/80 max-w-lg w-full rounded-3xl shadow-xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#541d17] to-[#7f2d24] px-6 py-4.5 flex items-center justify-between text-white" id="modal-header">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                <h3 className="font-serif text-lg font-bold">{t.lfModalTitle}</h3>
              </div>
              <button 
                id="btn-close-form"
                onClick={() => setShowAddForm(false)}
                className="text-white/85 hover:text-white hover:bg-white/10 p-1.5 rounded-full cursor-pointer transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto" id="modal-form-core">
              
              <div className="grid grid-cols-2 gap-4" id="form-sec-identity">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalNameInput}</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rohini Devi"
                    className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalAgeInput}</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g. 72"
                    className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4" id="form-sec-geo">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalLandmark}</label>
                  <input
                    type="text"
                    name="lastSeenLocation"
                    required
                    value={formData.lastSeenLocation}
                    onChange={handleInputChange}
                    placeholder="e.g. Sector 4 main bathing steps"
                    className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalApproxTime}</label>
                  <input
                    type="text"
                    name="lastSeenTime"
                    value={formData.lastSeenTime}
                    onChange={handleInputChange}
                    placeholder="e.g. Today 11:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800"
                  />
                </div>
              </div>

              <div id="form-sec-status">
                <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalMode}</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-white"
                >
                  <option value="Lost">{t.lfModalModeLost}</option>
                  <option value="Found">{t.lfModalModeFound}</option>
                </select>
              </div>

              <div id="form-sec-desc">
                <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalPhDetails}</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Wearing yellow silk saree, holding metal umbrella. Speaks Hindi..."
                  className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 leading-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#eddcc1]/30" id="form-sec-reporter">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalReporterName}</label>
                  <input
                    type="text"
                    name="reporterName"
                    required
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    placeholder="e.g. Praveen Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.lfModalReporterPhone}</label>
                  <input
                    type="text"
                    name="reporterPhone"
                    required
                    value={formData.reporterPhone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98321xxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3" id="form-actions">
                <button
                  type="button"
                  id="btn-cancel-modal"
                  onClick={() => setShowAddForm(false)}
                  className="px-4.5 py-2 rounded-full border border-neutral-300 hover:bg-neutral-100 text-xs font-semibold text-neutral-600 cursor-pointer transition-colors"
                >
                  {t.lfModalCancel}
                </button>
                <button
                  type="submit"
                  id="btn-submit-modal"
                  className="px-6 py-2 rounded-full bg-[#541d17] hover:bg-[#e67e22] text-white text-xs font-bold shadow-md hover:scale-102 cursor-pointer transition-all"
                >
                  {t.lfModalSubmit}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
