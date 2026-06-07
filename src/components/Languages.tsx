import React from 'react';
import { 
  Globe, 
  Languages as LangIcon, 
  Volume2, 
  Check, 
  Heart,
  MessageSquareCode
} from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

interface LanguageOption {
  code: 'en' | 'hi';
  name: string;
  nativeName: string;
  greeting: string;
  translation: string;
  helpPhrase: string;
  mapPhrase: string;
  pronunciationGuide: string;
}

interface LanguagesProps {
  language?: 'en' | 'hi';
  setLanguage?: (lang: 'en' | 'hi') => void;
}

export default function Languages({ language = 'en', setLanguage }: LanguagesProps) {
  const t = TRANSLATIONS[language];

  const languageOptions: LanguageOption[] = [
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      greeting: "॥ हर हर महादेव ॥ स्वागत है श्रद्धालु! उज्जयिनी महाकुंभ २०२८ में आपका मंगलमय कल्याण हो।",
      translation: "Greetings pilgrim. May your holy voyage and sacred prayers bring auspiciousness and enlightenment to Ujjain.",
      helpPhrase: "कृपया मेरी सहायता करें (Please assist me)",
      mapPhrase: "शिप्रा नदी राम घाट का रास्ता किधर है? (Where is the way to Shipra River Ram Ghat?)",
      pronunciationGuide: "Krip-ya me-ri sa-hai-ta ka-rein • Ship-ra na-di ram ghat ka ras-ta ki-dhar hai"
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      greeting: "|| Har Har Mahadev || Welcome Devotee to Ujjain Mahakumbh 2028. Have a blessed journey.",
      translation: "A modern smart visual companion ensuring high coordinate safety and spiritual grace for national and global tourists.",
      helpPhrase: "Please guide me to the nearest sector helpline tower.",
      mapPhrase: "Where is the boat launch station for taking a holy dip at Ram Ghat?",
      pronunciationGuide: "Official digital assistant companion preset is fully activated and running."
    }
  ];

  const activeOption = languageOptions.find(l => l.code === language) || languageOptions[0];

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0]" id="languages-workspace">
      
      {/* Title */}
      <div className="mb-8" id="lang-title-sec">
        <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
          <LangIcon className="w-8 h-8 text-[#e67e22]" />
          <span>{t.lgTitle}</span>
        </h2>
        <p className="text-sm font-sans text-[#8e746a] mt-1.5">
          {t.lgSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="languages-grid-body">
        
        {/* Left: 2 tiles (7 cols) */}
        <div className="lg:col-span-7 space-y-4" id="lang-tiles-grid">
          {languageOptions.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <div
                key={lang.code}
                id={`lang-tile-${lang.code}`}
                onClick={() => setLanguage && setLanguage(lang.code)}
                className={`glass-panel p-6 rounded-3xl border cursor-pointer select-none relative overflow-hidden transition-all duration-300 ${
                  isSelected 
                    ? 'border-[#e67e22] bg-[#ffffff] shadow-md ring-4 ring-[#e67e22]/10' 
                    : 'border-[#eddcc1]/30 hover:border-[#e67e22]/30 hover:bg-[#ffffff]/30'
                }`}
              >
                {/* Checking indicators */}
                {isSelected && (
                  <div className="absolute top-6 right-6 w-5 h-5 rounded-full bg-[#e67e22] text-white flex items-center justify-center shadow-sm">
                     <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                <span className="text-[10px] font-mono uppercase bg-amber-50 text-[#a04000] border border-amber-100 px-2.5 py-0.5 rounded-md font-bold">
                  {lang.name}
                </span>

                <h3 className="font-hindi text-3xl font-bold text-[#541d17] mt-3.5">
                  {lang.nativeName}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Right: Active details translator (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6" id="lang-translator-sidebar">
          
          {/* Main translation card */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm relative overflow-hidden" id="lang-details-box">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#e67e22] to-red-500" />
            
            <div className="flex items-center gap-2 mb-4" id="lang-header-inside">
              <Globe className="w-5 h-5 text-[#e67e22]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#a04000]">{t.lgHelpGuideHeader}</span>
            </div>

            {/* Spiritual Greeting banner */}
            <div className="bg-[#fcf1eb] border border-[#e67e22]/15 p-4.5 rounded-2xl" id="devotional-greeting-block">
              <h4 className="font-hindi text-xl font-bold text-[#541d17] leading-relaxed">
                {activeOption.greeting}
              </h4>
              <p className="text-xs text-[#8e746a] font-sans mt-3 border-t border-dashed border-[#eddcc1]/40 pt-3 leading-relaxed">
                <span className="font-bold underline text-[#a04000]">{t.lgEngTranslateTitle}</span> {activeOption.translation}
              </p>
            </div>

            {/* Crucial translation helpers dictionary */}
            <div className="mt-6 pt-5 border-t border-[#eddcc1]/25 space-y-4" id="translation-dictionary">
              <h4 className="text-[11px] font-mono uppercase font-bold text-[#a04000] flex items-center gap-1.5 tracking-wider">
                <MessageSquareCode className="w-3.5 h-3.5" />
                <span>{t.lgDialectKeyHeader}</span>
              </h4>

              {/* Phrase 1 */}
              <div className="space-y-1.5" id="phrase-1-area">
                <span className="text-[9px] font-sans text-[#8e746a] uppercase font-bold tracking-wide">{t.lgDistressCommand}</span>
                <p className="text-sm font-semibold text-[#541d17] font-hindi">{activeOption.helpPhrase}</p>
              </div>

              {/* Phrase 2 */}
              <div className="space-y-1.5" id="phrase-2-area">
                <span className="text-[9px] font-sans text-[#8e746a] uppercase font-bold tracking-wide">{t.lgLandmarkCommand}</span>
                <p className="text-sm font-semibold text-[#541d17] font-hindi">{activeOption.mapPhrase}</p>
              </div>

              {/* Pronunciation block */}
              {activeOption.code !== "en" && (
                <div className="p-3.5 bg-yellow-50/50 border border-yellow-100 rounded-xl flex items-start gap-2.5" id="pronunciation-hint">
                  <Volume2 className="w-4.5 h-4.5 text-yellow-600 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="text-[9px] font-mono uppercase font-bold text-yellow-800 block">{t.lgPhoneticHeader}</span>
                    <p className="text-xs text-[#541d17]/85 font-sans mt-0.5 font-semibold italic">
                      "{activeOption.pronunciationGuide}"
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Saffron pledge */}
          <div className="glass-panel p-5 rounded-2xl border border-[#eddcc1]/20 bg-white/45 flex items-center gap-3.5" id="seva-pledge">
            <Heart className="w-5 h-5 text-red-600 animate-pulse shrink-0" />
            <p className="text-[10px] text-[#541d17] font-semibold leading-relaxed">
              {t.lgStationNoticeText}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
