import React from 'react';
import { 
  ShieldAlert, 
  Waves, 
  Calendar, 
  Clock, 
  Bell, 
  Info,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface SafetyAlertsProps {
  language?: 'en' | 'hi';
}

export default function SafetyAlerts({ language = 'en' }: SafetyAlertsProps) {
  const t = TRANSLATIONS[language];

  const auspiciousDates = [
    {
      title: language === 'hi' ? "सोमवती अमावस्या (प्रथम शाही स्नान)" : "Somvati Amavasya (Opening Shahi Snan)",
      date: language === 'hi' ? "१० अप्रैल, २०२८" : "April 10, 2028",
      significance: language === 'hi'
        ? "संतों का पहला आधिकारिक शाही स्नान। सूर्य के मेष राशि में प्रवेश करने के साथ ही श्रद्धालु भोर की पहली किरण पर स्नान करते हैं।"
        : "First official royal bath of holy Saints. Devotees bathe at break of dawn as sun enters Aries.",
      type: language === 'hi' ? "शाही स्नान दिवस" : "Royal Bathing Day"
    },
    {
      title: language === 'hi' ? "चैत्र पूर्णिमा (प्रथम पूर्ण चंद्र)" : "Chaitra Purnima (First Full Moon)",
      date: language === 'hi' ? "१७ अप्रैल, २०२८" : "April 17, 2028",
      significance: language === 'hi'
        ? "पवित्र व्रत की शुरुआत जहां श्रद्धालु शिप्रा नदी के रेतीले घाटों पर १ महीने का तपस्वी जीवन शुरू करते हैं।"
        : "Beginning of holy vows where devotees begin 1-month ascetic living beside sand banks of Shipra River.",
      type: language === 'hi' ? "प्रमुख स्नान तिथि" : "Major Bathing Day"
    },
    {
      title: language === 'hi' ? "वैशाख अमावस्या (शाही स्नान शिखर)" : "Baisakh Amavasya (The Royal Zenith Bath)",
      date: language === 'hi' ? "२४ अप्रैल, २०२८" : "April 24, 2028",
      significance: language === 'hi'
        ? "सिंहस्थ का सबसे मुख्य दिन। अनुमानित लाखों श्रद्धालु मौन ध्यान और स्नान के लिए पुलों को पार करते हैं।"
        : "The absolute crown day of Simhastha. Estimated millions cross the bridges for silent dhyana pools.",
      type: language === 'hi' ? "अत्यधिक व्यस्त महत्वपूर्ण दिन" : "Auspicious Peak Day"
    },
    {
      title: language === 'hi' ? "हनुमान जयंती (शाही स्नान)" : "Hanuman Jayanti (Royal Bathing)",
      date: language === 'hi' ? "२ मई, २०२८" : "May 2, 2028",
      significance: language === 'hi'
        ? "उज्जैन की पावन मिट्टी का सम्मान करते हुए संतों और नागाओं द्वारा किया जाने वाला पवित्र संगीतमय स्नान।"
        : "Saffron robes and musical prayers honoring the sacred Ujjain soil.",
      type: language === 'hi' ? "शाही स्नान दिवस" : "Royal Bathing Day"
    }
  ];

  const ghats = [
    { 
      id: "1", 
      name: language === 'hi' ? "राम घाट केंद्रीय जल मंच" : "Ram Ghat Central Bathing Platforms", 
      crowdLevel: language === 'hi' ? "सामान्य" : "Moderate", 
      bathingSuitability: language === 'hi' ? "सुरक्षित" : "Safe", 
      waitingTimeMinutes: 10 
    },
    { 
      id: "2", 
      name: language === 'hi' ? "दत्त अखाड़ा तट रेतीले घाट" : "Dutt Akhara Shore Sand banks", 
      crowdLevel: language === 'hi' ? "अल्प" : "Low", 
      bathingSuitability: language === 'hi' ? "सुरक्षित" : "Safe", 
      waitingTimeMinutes: 0 
    },
    { 
      id: "3", 
      name: language === 'hi' ? "सुनहरी घाट सीढ़ीदार स्थल" : "Sunhari Ghat Steps Complex", 
      crowdLevel: language === 'hi' ? "अत्यधिक" : "Heavy", 
      bathingSuitability: language === 'hi' ? "सावधानी" : "Caution", 
      waitingTimeMinutes: 25 
    },
    { 
      id: "4", 
      name: language === 'hi' ? "मंगलनाथ घाट तट परिसर" : "Mangalnath Ghat Gardens Waterfront", 
      crowdLevel: language === 'hi' ? "अल्प" : "Low", 
      bathingSuitability: language === 'hi' ? "सुरक्षित" : "Safe", 
      waitingTimeMinutes: 0 
    }
  ];

  const alerts = [
    {
      id: "a1",
      title: language === 'hi' ? "पाँटून पुल संख्या २ वन-वे चालू" : "Pontoon Bridge No. 2 One-Way Flow Active",
      category: "crowd",
      severity: "medium",
      message: language === 'hi'
        ? "शाम की वापसी भीड़ नियंत्रण के लिए, पाँटून पुल संख्या २ केवल सेक्टर २ पार्किंग की ओर निकास के लिए संचालित है।"
        : "To regulate evening crowd return streams, Pontoon Bridge No. 2 is operating only exits out toward Sector 2 sector parking plots.",
      time: language === 'hi' ? "१० मिनट पहले" : "10 mins ago"
    },
    {
      id: "a2",
      title: language === 'hi' ? "पवित्र शिप्रा नदी जल धारा वेग" : "Holy Shipra Water Current Velocity",
      category: "bathing",
      severity: "low",
      message: language === 'hi'
        ? "राम घाट पर पानी का प्रवाह १.२ मीटर/सेकंड की स्थिर गति पर सुरक्षित है। सुरक्षा रस्सियां जकड़ी हुई हैं। सुगम स्नान करें।"
        : "Ram Ghat boat soundings show a perfect stable current speed of 1.2 m/s. Secure rope lines are fully anchored. Enjoy your prayers.",
      time: language === 'hi' ? "१ घंटे पहले" : "1 hour ago"
    }
  ];

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="safety-alerts-workspace">
      
      {/* Page intro */}
      <div className="mb-8" id="safety-title-block">
        <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-[#e67e22]" />
          <span>{t.sfTitle}</span>
        </h2>
        <p className="text-sm font-sans text-[#8e746a] mt-1.5">
          {t.sfSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="safety-grid">
        
        {/* Left Column: Auspicious Bathing Calendar (7 Cols) */}
        <div className="lg:col-span-7 space-y-6" id="bathing-dates-sec">
          <h3 className="font-sans font-bold text-[#541d17] text-base flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#e67e22]" />
            <span>{t.sfSnanHeading}</span>
          </h3>

          <div className="space-y-4" id="calendar-timeline">
            {auspiciousDates.map((date, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-3xl border border-[#eddcc1]/30 shadow-sm flex flex-col md:flex-row gap-4 items-start relative overflow-hidden group hover:border-[#e67e22]/20 transition-colors"
                id={`snan-date-${idx}`}
              >
                {/* Left golden token column */}
                <div className="md:w-1/4 shrink-0 bg-[#e67e22]/5 p-3 rounded-2xl border border-[#e67e22]/10 text-center" id={`day-badge-${idx}`}>
                  <span className="text-[10px] font-mono text-[#a04000] font-bold block uppercase tracking-wider">{date.type}</span>
                  <span className="text-xs font-sans font-bold text-[#541d17] mt-1.5 block">{date.date}</span>
                </div>

                {/* Right content details */}
                <div className="flex-1" id={`day-details-${idx}`}>
                  <h4 className="font-serif text-lg font-bold text-[#541d17] group-hover:text-[#e67e22] transition-colors flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#e67e22]" />
                    <span>{date.title}</span>
                  </h4>
                  <p className="text-xs text-[#8e746a] font-sans mt-2 leading-relaxed">
                    {date.significance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Ghat Crowd monitoring & Alerts feed (5 Cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6" id="ghat-monitoring-panel">
          
          {/* Active alerts panel */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/30 shadow-sm space-y-4" id="alerts-card">
            <h3 className="font-sans font-bold text-[#541d17] text-sm flex items-center gap-1.5">
              <Bell className="w-4.5 h-4.5 text-[#e67e22] animate-pulse" />
              <span>{t.sfBroadcastsTitle}</span>
            </h3>

            <div className="space-y-3.5" id="alerts-loop">
              {alerts.map((al) => (
                <div 
                  key={al.id} 
                  className={`p-4 rounded-2xl border flex gap-3.5 items-start ${
                    al.severity === 'high' 
                      ? 'bg-red-50 border-red-100 text-red-950' 
                      : al.severity === 'medium'
                      ? 'bg-yellow-50/50 border-yellow-100/60 text-yellow-950'
                      : 'bg-blue-50/40 border-blue-100/40 text-blue-950'
                  }`}
                  id={`alert-feed-${al.id}`}
                >
                  <Info className={`w-5 h-5 shrink-0 mt-0.5 ${al.severity === 'high' ? 'text-red-600' : al.severity === 'medium' ? 'text-yellow-600' : 'text-blue-500'}`} />
                  <div>
                    <div className="flex items-center justify-between" id={`alert-header-${al.id}`}>
                      <h4 className="font-sans font-bold text-xs">{al.title}</h4>
                      <span className="text-[9px] font-mono opacity-60 text-[#8e746a]">{al.time}</span>
                    </div>
                    <p className="text-xs opacity-85 mt-1.5 leading-relaxed font-sans">{al.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crowd statuses at major Shipra ghats */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm" id="ghat-flow-card">
            <h3 className="font-sans font-bold text-[#541d17] text-sm flex items-center gap-2 mb-4">
              <Waves className="w-4.5 h-4.5 text-blue-600 animate-bounce" />
              <span>{t.sfGhatFlowTitle}</span>
            </h3>

            <div className="divide-y divide-[#eddcc1]/25 space-y-3.5" id="ghats-list">
              {ghats.map((gh) => (
                <div key={gh.id} className="flex items-center justify-between pt-3 first:pt-0" id={`ghat-status-${gh.id}`}>
                  <div className="max-w-[180px]">
                    <h4 className="font-sans font-bold text-xs text-[#541d17]">{gh.name}</h4>
                    <div className="flex items-center gap-3 mt-1" id={`ghat-info-under-${gh.id}`}>
                      <span className="text-[10px] text-[#8e746a] font-sans flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#e67e22]" /> 
                        <span>{t.sfWaitTime}: {gh.waitingTimeMinutes}m</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" id={`ghat-statuses-badges-${gh.id}`}>
                    {/* Crowd index pill */}
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      gh.crowdLevel === 'Heavy' || gh.crowdLevel === 'अत्यधिक'
                        ? 'bg-rose-50 text-rose-700 border-rose-200' 
                        : gh.crowdLevel === 'Moderate' || gh.crowdLevel === 'सामान्य'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-250'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                    }`}>
                      {gh.crowdLevel}
                    </span>

                    {/* Bath suitability */}
                    <span className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      gh.bathingSuitability === 'Safe' || gh.bathingSuitability === 'सुरक्षित'
                        ? 'bg-emerald-100 text-emerald-800'
                        : gh.bathingSuitability === 'Caution' || gh.bathingSuitability === 'सावधानी'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {gh.bathingSuitability}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl flex gap-3 items-start mt-6" id="safety-green-notice">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-emerald-950 font-semibold font-sans leading-relaxed">
                {t.sfNoticeText}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
