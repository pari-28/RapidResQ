import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Globe, 
  Flame, 
  Sparkles,
  Building,
  AlertTriangle,
  Clock,
  User,
  ShieldAlert
} from 'lucide-react';
import { ActiveTab, Incident } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface MahakumbhHeroProps {
  onNavigate: (tab: ActiveTab) => void;
  language?: 'en' | 'hi';
  incidents: Incident[];
  onViewOnMap?: (incidentId: string) => void;
}

interface Diya {
  id: number;
  x: number; // percentage width
  y: number; // percentage height
  scale: number;
  speed: number;
  opacity: number;
}

export default function MahakumbhHero({ onNavigate, language = 'en', incidents = [], onViewOnMap }: MahakumbhHeroProps) {
  const t = TRANSLATIONS[language];
  // Floating diyas (lamps) system state
  const [diyas, setDiyas] = useState<Diya[]>([
    { id: 1, x: 20, y: 76, scale: 1.1, speed: 0.15, opacity: 0.95 },
    { id: 2, x: 45, y: 79, scale: 0.9, speed: 0.12, opacity: 0.8 },
    { id: 3, x: 68, y: 74, scale: 1.0, speed: 0.18, opacity: 0.9 },
    { id: 4, x: 85, y: 81, scale: 0.8, speed: 0.1, opacity: 0.75 },
    { id: 5, x: 32, y: 82, scale: 1.2, speed: 0.16, opacity: 0.9 }
  ]);

  // Handle diya interactions (clicking on the river lets pilgrims launch individual diyas)
  const [launchedCount, setLaunchedCount] = useState<number>(0);
  const handleLaunchDiya = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Only spawn inside the water area (lower portion, roughly y > 70)
    if (y > 65) {
      const newDiya: Diya = {
        id: Date.now(),
        x,
        y,
        scale: 0.7 + Math.random() * 0.6,
        speed: 0.08 + Math.random() * 0.14,
        opacity: 1.0
      };
      setDiyas(prev => [...prev, newDiya]);
      setLaunchedCount(prev => prev + 1);
    }
  };

  // Move diyas leftwards to simulate the flow of the Shipra River
  useEffect(() => {
    const interval = setInterval(() => {
      setDiyas(prevDiyas => {
        return prevDiyas
          .map(diya => ({
            ...diya,
            x: diya.x - diya.speed, // move leftwards
            y: diya.y + (Math.sin(diya.x / 4) * 0.04), // slight wave drift
            opacity: diya.x < 5 ? diya.opacity - 0.04 : diya.opacity
          }))
          // Keep diyas that are still in bounds and visible
          .filter(diya => diya.x > 1 && diya.opacity > 0);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Spawn casual background diyas every 6 seconds to keep the river alive
  useEffect(() => {
    const autoSpawn = setInterval(() => {
      if (diyas.length < 15) {
        const randomY = 70 + Math.random() * 15;
        const newDiya: Diya = {
          id: Date.now() + Math.random(),
          x: 100, // starts off-screen right
          y: randomY,
          scale: 0.8 + Math.random() * 0.5,
          speed: 0.1 + Math.random() * 0.12,
          opacity: 0.9
        };
        setDiyas(prev => [...prev, newDiya]);
      }
    }, 6000);

    return () => clearInterval(autoSpawn);
  }, [diyas]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start min-h-screen px-10 py-8 relative overflow-y-auto bg-gradient-to-tr from-[#ffeade] via-[#fff5eb] to-[#fce4da]" id="hero-workspace">
      
      {/* Decorative Golden Border Accents */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#edd7be]/35 rounded-3xl pointer-events-none z-10" />

      {/* Hero Visual Section wrapping background visual layers and headers to prevent collision with lower content */}
      <div className="relative w-full max-w-5xl h-[430px] sm:h-[470px] lg:h-[510px] flex flex-col items-center justify-start pb-8 mb-2 shrink-0" id="hero-interactive-zone">

        {/* Main Beautiful Painting Backing Canvas */}
        <div 
          className="absolute inset-0 z-0 select-none cursor-pointer" 
          onClick={handleLaunchDiya}
          title="Click on the holy Shipra River to float a prayer Diya"
          id="spiritual-painting-canvas"
        >
        {/* Soft Glowing Sunbeam Sunrise */}
        <div className="absolute left-1/3 top-1/4 w-[36%] h-[36%] rounded-full bg-gradient-to-r from-[#ffd3a5] to-[#fca5a5] filter blur-3xl opacity-60 animate-sun-pulse" />
        
        {/* Subliminal Lord Shiva in deep meditation backdrop (Mahakumbh / Mahakal spiritual theme) */}
        <div className="absolute right-[-2%] top-6 w-[40%] h-[75%] opacity-[0.15] transition-opacity duration-700 hover:opacity-[0.22]" id="shiva-silhouette">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#541d17]">
            {/* Meditating Lord Shiva body outline */}
            <path d="M100 15 C108 15, 110 25, 110 32 C110 40, 105 45, 100 45 C95 45, 90 40, 90 32 C90 25, 92 15, 100 15 Z" fill="currentColor" />
            
            {/* Shiva Crescent Moon (grows behind head) */}
            <path d="M112 18 Q125 18, 122 36 Q115 28, 112 18" fill="#f5b041" opacity="0.8" />
            
            {/* Jata (ascetic hair strands) and buns */}
            <path d="M100 15 C105 10, 112 8, 108 4 C100 0, 95 3, 93 10 Z" fill="currentColor" />
            <path d="M100 12 Q100 5, 96 3 C92 2, 94 8, 97 12" fill="currentColor" stroke="currentColor" strokeWidth="1" />
            <path d="M96 22 L82 18 C78 18, 80 26, 85 24 Z" fill="currentColor" />
            <path d="M104 22 L118 18 C122 18, 120 26, 115 24 Z" fill="currentColor" />

            {/* Holy Shipra Water sprouting upward */}
            <path d="M98 3 Q85 -5, 78 5 Q82 8, 93 4" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.8" />
            <path d="M102 3 Q115 -5, 122 5 Q118 8, 107 4" stroke="#60a5fa" strokeWidth="1" fill="none" opacity="0.8" />

            {/* Crossed Meditative legs and lotus pose */}
            <path d="M100 45 C115 48, 130 52, 140 60 C150 68, 155 85, 155 100 C155 125, 140 145, 120 155 C100 162, 70 162, 50 150 C30 138, 20 120, 20 100 C20 85, 25 68, 35 60 C45 52, 60 48, 100 45 Z" fill="currentColor" opacity="0.75" />
            <path d="M30 115 C40 105, 52 110, 70 125 Q100 155, 130 125 C148 110, 160 105, 170 115 L175 145 C155 160, 130 168, 100 168 C70 168, 45 160, 25 145 Z" fill="currentColor" />
            
            {/* Rudraksha Necklace wrap */}
            <ellipse cx="100" cy="55" rx="14" ry="4" stroke="#f39c12" strokeWidth="1.5" strokeDasharray="3,3" />
            <ellipse cx="100" cy="62" rx="20" ry="6" stroke="#f39c12" strokeWidth="1.5" strokeDasharray="4,4" />
          </svg>
        </div>

        {/* Dynamic Cascading Waterfall lines effect */}
        <div className="absolute right-[1.5%] top-[14%] w-[10%] h-[55%] opacity-30" id="cascade-waterfall">
          <svg viewBox="0 0 40 120" className="w-full h-full animate-water-flow">
            {/* Cascade guide flows */}
            <path d="M5 0 L5 120 M35 0 L35 120" stroke="#fce4da" strokeWidth="1" opacity="0.2" />
            
            {/* Water Flow lines */}
            <path d="M12 0 L14 120 M20 0 L18 120 M28 0 L26 120 M16 0 L15 120 M24 0 L25 120" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="20 10" />
            <path d="M15 10 L15 110 M22 5 L22 105 M26 20 L26 120" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="15 35" />
            <path d="M10 0 C15 30, 25 60, 20 120" stroke="#93c5fd" strokeWidth="0.8" opacity="0.5" />
            
            {/* Waterfall plunge mist clouds */}
            <ellipse cx="20" cy="115" rx="15" ry="8" fill="#ffffff" className="animate-mist-fade" />
            <ellipse cx="23" cy="118" rx="12" ry="5" fill="#bfdbfe" className="animate-mist-fade" style={{ animationDelay: '1.5s' }} />
          </svg>
        </div>

        {/* Classic Heritage Temple silhouette on Left */}
        <div className="absolute left-[-1%] bottom-[28%] w-[24%] h-[40%] opacity-[0.22] animate-temple-fade" id="left-temple-landscape">
          <svg viewBox="0 0 120 120" className="w-full h-full text-[#541d17]" fill="currentColor">
            {/* Group of multi-layered Indian domes */}
            <path d="M10 110 L10 75 Q25 45 40 75 L40 110 Z" />
            <path d="M25 75 Q25 40 27 25 Q30 40 30 75 Z" />
            <path d="M27.5 25 V15" stroke="currentColor" strokeWidth="1.5" />
            {/* Pennant Flag */}
            <path d="M28 15 L36 18 L28 21" fill="#e67e22" />

            {/* Larger Temple Spire Shikhara (Mahakaleshwar visual inspiration) */}
            <path d="M48 110 L48 65 Q70 20 85 65 L85 110 Z" />
            <path d="M66.5 42 Q66.5 15 68.5 5 Q71.5 15 71.5 42 Z" />
            <path d="M69 5 V0" stroke="currentColor" strokeWidth="2" />
            <path d="M69 0 L79 4 L69 7" fill="#e67e22" />

            {/* Smaller background spires */}
            <path d="M95 110 L95 78 Q103 55 110 78 L110 110 Z" opacity="0.7" />
          </svg>
        </div>

        {/* Sacred Altar with Mahashivling - Front Foreground Right Side (Fully preserved spiritual element) */}
        <div className="absolute right-[5%] bottom-[22%] w-44 h-48 z-20 group" id="foreground-mahashivling">
          <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-xl">
            {/* Pedestal / Yoni base */}
            <path d="M10 95 C10 85, 110 85, 110 95 C110 108, 10 108, 10 95 Z" fill="#2d3748" />
            <path d="M15 95 C15 88, 105 88, 105 95 C105 104, 15 104, 15 95 Z" fill="#1a202c" />
            <path d="M22 101 C25 115, 95 115, 98 101 Z" fill="#2d3748" />

            {/* Ceremonial Snout (Spout) on the left */}
            <path d="M20 92 L5 90 C1 92, 1 97, 8 98 L20 100 Z" fill="#1a202c" />

            {/* Abhishekam continuous pure flowing water stream descending onto Shivling crown */}
            <path d="M57 0 L57 32 Q58 40 58 46 L62 46 Q62 40 63 32 L63 0 Z" fill="#93c5fd" opacity="0.6" className="animate-pulse" />
            <path d="M59 0 C59 10, 61 20, 59 30 Q60 38 60 46" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="10 8" strokeLinecap="round" fill="none" opacity="0.9" className="animate-water-flow" />
            <path d="M57 0 C57 15, 63 25, 61 46" stroke="#bfdbfe" strokeWidth="1" strokeDasharray="15 15" strokeLinecap="round" fill="none" opacity="0.8" />
            
            {/* Soft water ripples expanding from Shivling crown */}
            <ellipse cx="60" cy="46" rx="14" ry="4" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.7" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            <ellipse cx="60" cy="46" rx="8" ry="2.5" fill="none" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
            
            {/* Sparkling sunlight reflections on Abhishekam water */}
            <circle cx="56" cy="15" r="1.5" fill="#ffffff" className="animate-pulse" />
            <circle cx="64" cy="28" r="1.2" fill="#ffd3a5" className="animate-pulse" style={{ animationDuration: '3s' }} />
            <circle cx="58" cy="38" r="1.8" fill="#ffffff" className="animate-pulse" style={{ animationDuration: '2s' }} />

            {/* Inner Mahashivling stone block */}
            <path d="M40 92 C40 40, 80 40, 80 92 Z" fill="#1a202c" />
            {/* Delicate high-gloss marble shine */}
            <path d="M45 75 Q52 50, 68 50" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Holy Tripundra (Three horizontal sandalwood marks) & Orange Bindi Bindu */}
            <path d="M48 62 C50 62, 70 62, 72 62" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <path d="M48 66 C50 66, 70 66, 72 66" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50 70 C52 70, 68 70, 70 70" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
            {/* Golden-red energetic saffron tilak dot */}
            <circle cx="60" cy="66" r="3.5" fill="#e67e22" />
            <circle cx="60" cy="66" r="1.5" fill="#ffffff" />

            {/* Sacred Orange Marigold Flower Garland loops */}
            <path d="M35 92 Q60 110 85 92" stroke="#ed8936" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="3 4" opacity="0.9" />
            <path d="M30 96 Q60 118 90 96" stroke="#ecc94b" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 3.5" opacity="0.9" />

            {/* Companion Trident (Trishul) stand erect besides Shivling */}
            <path d="M96 90 L96 15" stroke="#ecc94b" strokeWidth="2" />
            {/* Trishul head */}
            <path d="M88 28 C86 28, 86 24, 96 24 C106 24, 106 28, 104 28" fill="none" stroke="#ecc94b" strokeWidth="2" strokeLinecap="round" />
            <path d="M96 11 L96 24" stroke="#ecc94b" strokeWidth="2.5" />
            <path d="M92 18 H100" stroke="#ecc94b" strokeWidth="1.8" />
            {/* Saffron banner flying on Trishul */}
            <path d="M96 36 L108 41 L96 46" fill="#e67e22" />
            <circle cx="96" cy="36" r="1.5" fill="#742a2a" />
          </svg>
        </div>

        {/* CLEAN FLOWING WATER, SOFT RIPPLES & SOLAR REFLECTIONS (NO ROCKS / NO STONES inside water flow) */}
        <div className="absolute left-0 bottom-0 w-full h-[26%] bg-gradient-to-t from-[#edd7be]/40 to-transparent flex items-end relative overflow-hidden" id="holy-shipra">
          <svg viewBox="0 0 1000 100" className="w-full absolute bottom-0 left-0 h-full opacity-70 pointer-events-none" preserveAspectRatio="none">
            {/* Beautiful calm multi-layered moving water streams */}
            <path d="M 0,55 C 150,48 350,70 500,55 C 650,40 850,62 1000,55 L 1000,100 L 0,100 Z" fill="#e1f5fe" opacity="0.6" className="animate-water-flow" />
            <path d="M 0,68 C 200,76 400,54 600,68 C 800,80 900,60 1000,68 L 1000,100 L 0,100 Z" fill="#b3e5fc" opacity="0.4" className="animate-water-flow" style={{ animationDelay: '2.5s' }} />
            <path d="M 0,82 C 250,88 500,76 750,82 L 1000,82 L 1000,100 L 0,100 Z" fill="#e1f5fe" opacity="0.3" />

            {/* Glowing, sparkling sunbeam reflections (Light reflections) */}
            <ellipse cx="180" cy="65" rx="55" ry="1.5" fill="#ffffff" className="animate-pulse" style={{ animationDuration: '3s' }} />
            <ellipse cx="480" cy="78" rx="85" ry="2.5" fill="#ffe0b2" className="animate-pulse" style={{ animationDuration: '4.5s' }} />
            <ellipse cx="760" cy="70" rx="70" ry="1.2" fill="#ffffff" className="animate-pulse" style={{ animationDuration: '3.5s' }} />
            <ellipse cx="310" cy="58" rx="40" ry="1" fill="#ffffff" className="animate-pulse" style={{ animationDuration: '5s' }} />
            <ellipse cx="890" cy="88" rx="50" ry="1.8" fill="#ffe0b2" className="animate-pulse" style={{ animationDuration: '4s' }} />

            {/* Dynamic continuous gentle waves (Soft ripples) */}
            <path d="M 120,62 Q 220,66 320,62" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.75" />
            <path d="M 400,74 Q 500,78 600,74" stroke="#ffffff" strokeWidth="0.7" fill="none" opacity="0.6" />
            <path d="M 720,64 Q 820,68 920,64" stroke="#edd7be" strokeWidth="0.6" fill="none" opacity="0.5" />
          </svg>

          {/* Floating lamps (Diyas) simulated mathematically */}
          {diyas.map((diya) => (
            <div 
              key={diya.id}
              className="absolute pointer-events-none transition-all duration-300 select-none animate-float-diya"
              style={{
                left: `${diya.x}%`,
                top: `${diya.y}%`,
                transform: `scale(${diya.scale})`,
                opacity: diya.opacity
              }}
              id={`diya-lamp-${diya.id}`}
            >
              {/* Diya Clay Base */}
              <div className="relative w-8 h-4 bg-gradient-to-t from-[#a0522d] to-[#cd853f] rounded-b-full shadow-lg flex items-center justify-center">
                {/* Hot Glistening Fire Flame */}
                <div className="absolute top-[-9px] left-[11px] w-2.5 h-4 bg-gradient-to-t from-[#e67e22] via-[#f1c40f] to-[#ffffff] rounded-full animate-diya-flame" />
                <div className="absolute top-[-5px] left-[9px] w-3.5 h-3.5 bg-orange-400 rounded-full filter blur-[4px] opacity-75 animate-pulse" />
                
                {/* Floating Oil Light Glow */}
                <div className="absolute w-12 h-12 rounded-full bg-orange-300 filter blur-md opacity-35 top-[-20px] left-[-10px]" />
              </div>
            </div>
          ))}

          {/* Floating Instructions prompt */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1.5 bg-[#541d17]/5 border border-[#edd7be]/30 px-4 py-1.5 rounded-full select-none" id="help-hint-diya">
            <Flame className="w-3.5 h-3.5 text-[#e67e22] animate-pulse" />
            <span className="text-[10px] font-sans text-[#a04000] font-medium tracking-wide leading-none">
              Click anywhere on the Shipra River to float a prayer Diya
            </span>
          </div>
        </div>
      </div>

      {/* Main Spiritual Typography Header Banners */}
      <div className="text-center z-10 w-full mt-1 sm:mt-2 max-w-2xl select-none" id="main-banner-typography">
        <div className="flex items-center justify-center gap-2 mb-0.5" id="ritual-salutation">
          <span className="w-6 h-[1.5px] bg-gradient-to-r from-transparent to-[#e67e22]" />
          <span className="text-xs font-mono tracking-[0.2em] text-[#a04000] font-bold uppercase">
            {t.heroSalutation}
          </span>
          <span className="w-6 h-[1.5px] bg-gradient-to-l from-transparent to-[#e67e22]" />
        </div>

        {/* Cinematic Majestic Title "Mahakumbh 2028 (Simhastha)" */}
        <div className="relative inline-block py-0.5 px-4 mb-1" id="mahakumbh-title-container">
          {/* Saffron wings */}
          <div className="absolute left-[-42px] top-1/2 -translate-y-1/2 flex items-center opacity-70">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#e67e22]" fill="currentColor">
              <path d="M12 21 C8 17, 3 14, 3 9 C3 4, 12 2, 12 2 C12 2, 21 4, 21 9 C21 14, 16 17, 12 21 Z" opacity="0.1" />
              <path d="M12 22 L3 13 Q6 10 12 11 Q18 10 21 13 Z" />
            </svg>
          </div>
          <div className="absolute right-[-42px] top-1/2 -translate-y-1/2 flex items-center opacity-70 scale-x-[-1]">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#e67e22]" fill="currentColor">
              <path d="M12 21 C8 17, 3 14, 3 9 C3 4, 12 2, 12 2 C12 2, 21 4, 21 9 C21 14, 16 17, 12 21 Z" opacity="0.1" />
              <path d="M12 22 L3 13 Q6 10 12 11 Q18 10 21 13 Z" />
            </svg>
          </div>

          <h1 className="font-serif text-3.5xl md:text-4.5xl lg:text-5xl font-extrabold text-[#541d17] tracking-wider drop-shadow-sm flex flex-col md:flex-row items-center gap-x-3 justify-center">
            <span>{t.heroTitlePrefix}</span>
            <span className="text-[#e67e22] text-4xl md:text-5.5xl font-black font-serif italic drop-shadow-sm">{t.heroTitleYear}</span>
          </h1>
        </div>

        {/* Small Trident divider */}
        <div className="flex items-center justify-center gap-3 mb-2" id="banner-divider">
          <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#eddcc1]" />
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#e67e22]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M9 6c0 4 6 4 6 0M5 10c0 4 14 4 14 0" />
          </svg>
          <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#eddcc1]" />
        </div>

        {/* Catchphrase message */}
        <p className="font-sans text-xs md:text-sm text-[#62534e] max-w-lg mx-auto leading-relaxed tracking-wide font-medium">
          {t.heroSubtitle}
        </p>
      </div>

      {/* Floating Sparkles decorative illustration */}
      {launchedCount > 0 && (
        <div className="absolute top-24 left-1/4 flex items-center gap-1 bg-[#ffffff]/90 text-[#e67e22] text-xs font-serif font-semibold border border-[#ed8936]/30 px-3.5 py-1.5 rounded-full shadow-lg z-25 pointer-events-none animate-bounce" id="diyas-count-badge">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>{language === 'hi' ? 'प्रवाहित प्रार्थनाएँ' : 'Floating Prayers'} ({launchedCount})</span>
        </div>
      )}

      </div>

      {/* Quick Access Glassmorphic Cards Grid (5-column layout) */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 z-20 mt-2 select-none" id="hero-quick-panels">
        
        {/* Emergency Card */}
        <div 
          onClick={() => onNavigate(ActiveTab.EmergencyHelp)}
          className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
          id="card-trigger-emergency"
        >
          {/* Subtle soft color background wash */}
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-red-100/50 filter blur-xl" />
          
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <Phone className="w-5 h-5 text-red-600 animate-pulse" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
              {t.emergencyHelp}
            </h4>
            <p className="text-[11px] text-[#8e746a] mt-1 leading-normal font-sans">
              {t.emergencyHelpDesc}
            </p>
          </div>
        </div>

        {/* Command Center Card */}
        <div 
          onClick={() => onNavigate(ActiveTab.CommandCenter)}
          className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden bg-gradient-to-br from-orange-50/20 to-white"
          id="card-trigger-command-ctr"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-orange-200/40 filter blur-xl" />
          
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center">
            <Building className="w-5 h-5 text-[#a04000] animate-bounce" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h5 className="text-[9px] font-mono font-bold text-red-600 uppercase tracking-widest animate-pulse">Core Desk</h5>
            <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
              {t.commandHub}
            </h4>
            <p className="text-[11px] text-[#8e746a] mt-1 leading-normal font-sans">
              {t.commandHubDesc}
            </p>
          </div>
        </div>

        {/* Lost & Found Card */}
        <div 
          onClick={() => onNavigate(ActiveTab.LostAndFound)}
          className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
          id="card-trigger-lostfound"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-purple-100/50 filter blur-xl" />
          
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <Search className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
              {t.lostFound}
            </h4>
            <p className="text-[11px] text-[#8e746a] mt-1 leading-normal font-sans">
              {t.lostFoundDesc}
            </p>
          </div>
        </div>

        {/* Safety Alerts Card */}
        <div 
          onClick={() => onNavigate(ActiveTab.SafetyAlerts)}
          className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
          id="card-trigger-safety"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-blue-100/50 filter blur-xl" />
          
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
              {t.safetyAlerts}
            </h4>
            <p className="text-[11px] text-[#8e746a] mt-1 leading-normal font-sans">
              {t.safetyAlertsDesc}
            </p>
          </div>
        </div>

        {/* Languages Card */}
        <div 
          onClick={() => onNavigate(ActiveTab.Languages)}
          className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between h-40 cursor-pointer relative overflow-hidden"
          id="card-trigger-languages"
        >
          <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-green-100/50 filter blur-xl" />
          
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-[#541d17] text-sm tracking-wide">
              {t.languages}
            </h4>
            <p className="text-[11px] text-[#8e746a] mt-1 leading-normal font-sans">
              {t.languagesDesc}
            </p>
          </div>
        </div>

      </div>

      {/* Real-time Recent Emergency Reports Panel */}
      <div className="w-full max-w-5xl mt-12 bg-white/70 backdrop-blur-md rounded-3xl border border-[#eddcc1]/50 p-6 z-20 shadow-sm" id="recent-reports-hero-section">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#eddcc1]/30 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <h3 className="font-serif text-lg font-bold text-[#541d17] flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>{language === 'hi' ? 'सक्रिय आपातकालीन रिपोर्ट (लाइव)' : 'Live Emergency Reports Status'}</span>
            </h3>
          </div>
          <button 
            onClick={() => onNavigate(ActiveTab.CommandCenter)}
            className="text-[11px] font-mono font-bold text-[#a04000] hover:underline"
          >
            {language === 'hi' ? 'नियंत्रण कक्ष खोलें →' : 'ACCESS COMMAND CENTER →'}
          </button>
        </div>

        {incidents.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 italic text-xs">
            {language === 'hi' ? 'कोई सक्रिय रिपोर्ट उपलब्ध नहीं।' : 'All quiet. No active pilgrim incident reports filed.'}
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {[...incidents]
              .sort((a, b) => b.id.localeCompare(a.id))
              .slice(0, 5)
              .map((inc) => (
                <div 
                  key={inc.id}
                  className="p-4 rounded-xl bg-white/90 border border-[#eddcc1]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs transition-colors hover:bg-white"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-black text-[#a04000]">#{inc.id}</span>
                      <span className="font-bold text-[#541d17]">{inc.category}</span>
                      <span className={`px-2 py-0.2 rounded-full font-mono font-bold text-[9px] uppercase ${
                        inc.severity === 'Critical' ? 'bg-red-100 text-red-700 font-extrabold animate-pulse' : 'bg-[#eddcc1]/30 text-[#a04000]'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-[10px] text-neutral-400">({inc.timestamp})</span>
                    </div>

                    <p className="text-neutral-700 italic truncate font-medium">"{inc.description}"</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#8e746a] font-sans pt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-red-500" /> <strong>{inc.location}</strong></span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-500" /> {inc.reporterName}</span>
                      <span><strong>Status:</strong> <span className="font-bold text-[#a04000]">{inc.status}</span></span>
                    </div>
                  </div>

                  {onViewOnMap && (
                    <button
                      onClick={() => onViewOnMap(inc.id)}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 border border-orange-200 text-[#a04000] text-[10px] font-sans font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>📍 {language === 'hi' ? 'स्थान देखें' : 'View Location'}</span>
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
}
