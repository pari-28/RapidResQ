import React, { useState } from 'react';
import { 
  HeartPulse, 
  Phone, 
  MapPin, 
  Activity, 
  Coffee, 
  Droplet, 
  Thermometer, 
  Sparkles,
  Heart
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface MedicalAssistanceProps {
  language?: 'en' | 'hi';
}

export default function MedicalAssistance({ language = 'en' }: MedicalAssistanceProps) {
  const t = TRANSLATIONS[language];
  const [ambulanceTriggered, setAmbulanceTriggered] = useState(false);

  const medicalBooths = [
    {
      name: language === 'hi' ? "महाकाल कॉरिडोर एपेक्स ट्रॉमा अस्पताल" : "Mahakal Corridor Apex Trauma Hospital",
      distance: language === 'hi' ? "महाकालेश्वर मंदिर मुख्य निकास द्वार से ५ मिनट की पैदल दूरी" : "5 min walk from Mahakaleshwar temple main exit",
      phone: "108",
      features: language === 'hi' 
        ? ["२४/७ आईसीयू ट्रॉमा केयर", "मुफ्त जीवन रक्षक हृदय स्वास्थ्य परीक्षण", "बाल चिकित्सा आपातकालीन विंग"]
        : ["24/7 ICU Trauma Care", "Free life-saving cardiac screening", "Pediatric emergency wing"],
      doctors: language === 'hi' ? "डॉ आलोक नाथ और १६ डॉक्टर सदस्यों के नेतृत्व में" : "Led by Dr. Alok Nath & 16 resident staff"
    },
    {
      name: language === 'hi' ? "राम घाट आयुर्वेदिक एवं निर्जलीकरण राहत केंद्र" : "Ram Ghat Ayurvedic & Dehydration Relief Center",
      distance: language === 'hi' ? "राम घाट पांटून पुल के समीप" : "Adjacent to Ram Ghat Pontoon Bridge",
      phone: "+91 532 2430114",
      features: language === 'hi'
        ? ["प्राकृतिक हर्बल पुनर्जलीकरण पेय काउंटर", "लू लगने पर शीतलन मिट्टी-पैक", "सूजे पैरों के लिए वैदिक मालिश तेल"]
        : ["Natural herbal rehydration tea counters", "Cooling mud-packs for heatstroke", "Vedic massage oils for swollen arches"],
      doctors: language === 'hi' ? "आचार्य बलराम शास्त्री (BAMS) के नेतृत्व में" : "Led by Acharya Balram Shastri (BAMS)"
    },
    {
      name: language === 'hi' ? "हरसिद्धि गेट सामान्य स्वास्थ्य सेवा बूथ" : "Harsiddhi Gate General Healthcare Booth",
      distance: language === 'hi' ? "हरसिद्धि गेट चौराहा परिसर" : "Harsiddhi Gate Chauraha complex",
      phone: "112",
      features: language === 'hi'
        ? ["छाले और घाव मरहम-पट्टी काउंटर", "निःशुल्क खनिज लवण इलेक्ट्रोलाइट पाउडर", "अस्थमा नेबुलाइज़र लाइनें"]
        : ["Blister bandage wrapping counters", "Free mineral salt electrolyte powders", "Asthma nebulizer lines"],
      doctors: language === 'hi' ? "इंडियन रेड क्रॉस स्वयंसेवकों द्वारा समर्थित" : "Supported by Indian Red Cross volunteers"
    }
  ];

  const selfCareRemedies = [
    {
      title: language === 'hi' ? "दिव्य केसर पुनर्जलीकरण" : "Divine Saffron Rehydration",
      icon: Droplet,
      color: "text-amber-500 bg-amber-50 border-amber-100",
      description: language === 'hi'
        ? "पैदल यात्रा के हर २ घंटे में सेंधा नमक, नींबू और जैविक चीनी मिश्रित पानी पिएं। सीधे नदी के पानी पीने से बचें।"
        : "Drink water mixed with rock salt, lemon, and a touch of organic sugar every 2 hours of foot navigation. Avoid drinking directly from unfiltered river channels."
    },
    {
      title: language === 'hi' ? "आयुर्वेदिक चरण सेवा" : "Ayurvedic Arch Care",
      icon: Coffee,
      color: "text-emerald-500 bg-emerald-50 border-emerald-100",
      description: language === 'hi'
        ? "सूखे रेत पर नंगे पैर चलने से होने वाले छालों के लिए, सोने से पहले निःशुल्क क्षेत्र ५ आयुर्वेदिक बूथों पर उपलब्ध सरसों तेल या चंदन पेस्ट लगाएं।"
        : "For deep muscle sores & barefoot skin blisters on dry sands, rub mustard oil or natural sandalwood paste available at any free Sector 5 Ayurvedic desk before sleeping."
    },
    {
      title: language === 'hi' ? "लू से बचाव" : "Sun-Stroke Vigilance",
      icon: Thermometer,
      color: "text-rose-500 bg-rose-50 border-rose-100",
      description: language === 'hi'
        ? "सुबह ११ से दोपहर ३ बजे के बीच सिर को हमेशा गीले सूती भगवा कपड़े या टोपी से ढकें। कमजोरी महसूस होने पर तुरंत छायादार तंबू में विश्राम करें।"
        : "Always cover the head with a dry cotton saffron cloth or light cap between 11 AM and 3 PM. Rest under free pilgrim shade canopies immediately if light-headed."
    }
  ];

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="medical-workspace">
      
      {/* Title block */}
      <div className="mb-8" id="medical-header">
        <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-rose-500" />
          <span>{t.mcTitle}</span>
        </h2>
        <p className="text-sm font-sans text-[#8e746a] mt-1.5">
          {t.mcSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="medical-grid-body">
        
        {/* Left Column: List of Hospital camps (7 Cols) */}
        <div className="lg:col-span-7 space-y-6" id="hospitals-list-sec">
          <h3 className="font-sans font-bold text-[#541d17] text-base mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#e67e22]" />
            <span>{t.mcClinicHeader}</span>
          </h3>

          <div className="space-y-4" id="medical-booths-cards">
            {medicalBooths.map((booth, idx) => (
              <div 
                key={idx} 
                className="glass-panel p-5 rounded-3xl border border-[#eddcc1]/30 shadow-sm relative overflow-hidden group hover:border-rose-300 transition-all opacity-100"
                id={`medical-booth-${idx}`}
              >
                {/* Glowing subtle green ring indicating ACTIVE status */}
                <span className="absolute top-5 right-5 text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                  ● {t.mcActiveStatus}
                </span>

                <h4 className="font-serif text-lg font-bold text-[#541d17] group-hover:text-rose-600 transition-colors">
                  {booth.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-[#8e746a] font-sans mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e67e22]" />
                  <span>{booth.distance}</span>
                </div>

                <div className="text-xs text-[#541d17]/85 mt-3.5 bg-rose-500/5 p-3 rounded-xl border border-rose-100" id={`physician-desk-${idx}`}>
                  <span className="font-bold block text-[10px] uppercase font-mono text-[#a04000] tracking-wide">{t.primarySpecialist}</span>
                  <span className="font-semibold text-xs text-[#541d17]">{booth.doctors}</span>
                </div>

                {/* Features list */}
                <div className="mt-4" id={`booth-feats-${idx}`}>
                  <h5 className="text-[10px] font-mono uppercase font-bold text-[#a04000] tracking-wide mb-1.5">{t.mcFeatureTitle}</h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                    {booth.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-[#62534e] font-sans flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Dialing */}
                <div className="mt-5 pt-3.5 border-t border-[#eddcc1]/20 flex justify-end" id={`booth-call-row-${idx}`}>
                  <a
                    href={`tel:${booth.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#541d17] text-white hover:bg-[#e67e22] text-xs font-mono font-bold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.mcDialDoctor}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: SOS Trigger & Vedic health tips (5 Cols) */}
        <div className="lg:col-span-5 space-y-6" id="healthcare-quick-tools">
          
          {/* Quick Dispatch Card */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-200/50 shadow-md text-center relative overflow-hidden" id="ambulance-emergency-card">
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
            <h3 className="font-sans font-bold text-[#541d17] text-base mb-1">
              {t.mcOneTapAmbulance}
            </h3>
            <p className="text-xs text-[#8e746a] max-w-xs mx-auto mb-5 leading-normal">
              {t.mcAmbulanceDesc}
            </p>

            {!ambulanceTriggered ? (
              <button
                id="btn-trigger-ambulance"
                onClick={() => setAmbulanceTriggered(true)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 text-white font-serif font-bold text-sm shadow-md shadow-rose-650/15 hover:scale-102 cursor-pointer transition-all uppercase tracking-wider"
                type="button"
              >
                {t.mcSummonBtn}
              </button>
            ) : (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center" id="ambulance-active-banner">
                <Activity className="w-10 h-10 text-rose-600 mx-auto animate-bounce mb-2" />
                <span className="text-xs font-bold text-rose-800 uppercase tracking-widest block">{t.mcDispatchRoute}</span>
                <p className="text-[10px] text-rose-600 mt-1">
                  {t.mcAmbulanceActiveMsg}
                </p>
                <button
                  id="btn-cancel-ambulance"
                  onClick={() => setAmbulanceTriggered(false)}
                  className="mt-3.5 px-4 py-1.5 rounded-full bg-[#541d17] text-white text-[10px] font-sans font-bold hover:bg-[#a04000] cursor-pointer transition-colors"
                  type="button"
                >
                  {t.mcCancelAmbulance}
                </button>
              </div>
            )}
          </div>

          {/* Self care ayurvedic remedies */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/30 shadow-sm space-y-4" id="selfcare-tips-box">
            <h3 className="font-sans font-bold text-[#541d17] text-sm flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-[#e67e22] animate-pulse" />
              <span>{t.mcSelfCareTitle}</span>
            </h3>

            <div className="space-y-4" id="remedies-list">
              {selfCareRemedies.map((remedy, rIdx) => {
                const Icon = remedy.icon;
                return (
                  <div key={rIdx} className="flex gap-4 items-start" id={`remedy-${rIdx}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${remedy.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#541d17] uppercase tracking-wide font-sans">
                        {remedy.title}
                      </h4>
                      <p className="text-xs text-[#8e746a] mt-1.5 leading-relaxed font-sans">
                        {remedy.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3.5 mt-5" id="emergency-notice-healthcare">
              <Heart className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-[10px] text-[#541d17] font-semibold font-sans leading-normal">
                {t.mcNoticeText}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
