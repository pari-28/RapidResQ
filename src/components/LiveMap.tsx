import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Map, 
  Compass, 
  Layers, 
  Navigation, 
  Clock, 
  Waves,
  Heart,
  HelpCircle,
  Sparkles,
  Shield,
  Activity,
  Flame,
  AlertOctagon,
  ArrowRight,
  Info
} from 'lucide-react';
import { Incident } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface MapLocation {
  id: string;
  name: string;
  x: number; // SVG coordinate %
  y: number; // SVG coordinate %
  category: 'Ghat' | 'Akhara' | 'Helpline' | 'Temple' | 'Site';
  crowdLevel: 'Clean' | 'Moderate' | 'Heavy';
  description: string;
  facilities: string[];
}

interface LiveMapProps {
  incidents: Incident[];
  language?: 'en' | 'hi';
  selectedIncidentMapId?: string | null;
  setSelectedIncidentMapId?: (id: string | null) => void;
}

export default function LiveMap({ 
  incidents = [], 
  language = 'en',
  selectedIncidentMapId: propSelectedIncidentMapId,
  setSelectedIncidentMapId: propSetSelectedIncidentMapId
}: LiveMapProps) {
  const t = TRANSLATIONS[language];
  const [selectedLoc, setSelectedLoc] = useState<string>('ram-ghat');
  
  const [localSelectedIncidentMapId, setLocalSelectedIncidentMapId] = useState<string | null>(null);
  const selectedIncidentMapId = propSelectedIncidentMapId !== undefined ? propSelectedIncidentMapId : localSelectedIncidentMapId;
  const setSelectedIncidentMapId = propSetSelectedIncidentMapId !== undefined ? propSetSelectedIncidentMapId : setLocalSelectedIncidentMapId;

  // Dynamic Incident positions to map in Coordinate space
  const coordinateMap: Record<string, { x: number; y: number }> = {
    'Ram Ghat, Sector 2': { x: 50, y: 55 },
    'Mahakaleshwar Corridor Exit': { x: 18, y: 72 },
    'Harisiddhi Gate Compound': { x: 30, y: 48 },
    'Mangalnath Sector 5': { x: 80, y: 68 },
    'Shipra Pontoon Bridge 3': { x: 58, y: 40 },
    'Dutt Akhara Circle': { x: 65, y: 22 }
  };

  // Predefined Sentinel Response Patrol Locations
  const activePatrols = [
    { id: 'patrol-police', type: 'police', name: '👮 Simhastha Security Platoon 7', x: 26, y: 50, status: 'Patrolling Corridors' },
    { id: 'patrol-medical', type: 'medical', name: '🚑 Red Cross Mobile Trauma 3', x: 42, y: 60, status: 'On Standby near Ghats' },
    { id: 'patrol-fire', type: 'fire', name: '🔥 SDRF Boat Hazard Patrol', x: 68, y: 35, status: 'River Anchored' }
  ];

  // Pick Map Coordinates for the selected active incident (if any)
  const currentSelectedMapIncidentIndex = incidents.find(inc => inc.id === selectedIncidentMapId);
  const matchedIncidentCoords = currentSelectedMapIncidentIndex ? (coordinateMap[currentSelectedMapIncidentIndex.location] || { x: 50, y: 50 }) : null;

  // Find nearest Patrol team to handle the optimal route linking
  const getNearestPatrolForIncident = (category: string) => {
    if (category.toLowerCase().includes('medical') || category.toLowerCase().includes('water')) {
      return activePatrols[1]; // Red Cross
    }
    if (category.toLowerCase().includes('fire') || category.toLowerCase().includes('infrastructure')) {
      return activePatrols[2]; // Fire / Boat and SDRF
    }
    return activePatrols[0]; // Police & Security
  };

  const assignedPatrol = currentSelectedMapIncidentIndex ? getNearestPatrolForIncident(currentSelectedMapIncidentIndex.category) : null;

  const fullDistance = assignedPatrol && matchedIncidentCoords ? Math.sqrt(Math.pow(assignedPatrol.x - matchedIncidentCoords.x, 2) + Math.pow(assignedPatrol.y - matchedIncidentCoords.y, 2)) * 0.035 : 0.8;
  const fullTime = assignedPatrol ? Math.max(3, Math.round(fullDistance * 4.5)) : 3;

  // Navigation Active state
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navigationProgress, setNavigationProgress] = useState<number>(0);
  const [currentResponderPos, setCurrentResponderPos] = useState<{ x: number; y: number } | null>(null);

  // Automatically start navigation when selected from props (e.g. from role dashboards)
  useEffect(() => {
    if (propSelectedIncidentMapId) {
      setIsNavigating(true);
      setNavigationProgress(0);
    }
  }, [propSelectedIncidentMapId]);

  // Live Movement Simulation Effect
  useEffect(() => {
    if (!isNavigating || !matchedIncidentCoords || !assignedPatrol) {
      setNavigationProgress(0);
      setCurrentResponderPos(null);
      return;
    }

    setNavigationProgress(0);
    setCurrentResponderPos({ x: assignedPatrol.x, y: assignedPatrol.y });

    const interval = setInterval(() => {
      setNavigationProgress((prev) => {
        const next = prev + 5; // increment by 5% every 500ms
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isNavigating, selectedIncidentMapId]);

  // Interpolate position based on progress
  useEffect(() => {
    if (assignedPatrol && matchedIncidentCoords && isNavigating) {
      const x = assignedPatrol.x + (matchedIncidentCoords.x - assignedPatrol.x) * (navigationProgress / 100);
      const y = assignedPatrol.y + (matchedIncidentCoords.y - assignedPatrol.y) * (navigationProgress / 100);
      setCurrentResponderPos({ x, y });
    } else {
      setCurrentResponderPos(null);
    }
  }, [navigationProgress, isNavigating, selectedIncidentMapId]);

  const getTurnByTurnDirections = (progress: number) => {
    if (progress === 0) {
      return [
        language === 'hi' ? "१. प्रेषण संकेत प्राप्त। बचाव दल प्रस्थान की तैयारी में।" : "1. Dispatch signal acknowledged. Responder preparing.",
        language === 'hi' ? "२. शिप्रा पूर्वी बाईपास मार्ग पर प्रवेश।" : "2. Accessing Shipra East bypass bypass route.",
        language === 'hi' ? "३. अनुमानित आगमन: " + fullTime + " मिनट।" : "3. Est. Arrival: " + fullTime + " mins."
      ];
    }
    if (progress < 30) {
      return [
        language === 'hi' ? "✓ १. स्टैंडबाय पोस्ट से प्रस्थान।" : "✓ 1. Dispatched from standby post.",
        language === 'hi' ? "▶ २. हरसिद्धि क्रॉस रोड के माध्यम से तेज गति से आगे बढ़ें।" : "▶ 2. Proceed at high speed via Harsiddhi cross road.",
        language === 'hi' ? "३. आगे सेक्टर कॉरिडोर के पास भीड़ की चेतावनी।" : "3. Watch for crowd crossings ahead near sector corridor."
      ];
    }
    if (progress < 60) {
      return [
        language === 'hi' ? "✓ १. हरसिद्धि रिंग रोड चौराहा पार किया।" : "✓ 1. Crossed Harsiddhi Ring Road intersection.",
        language === 'hi' ? "✓ २. सेक्टर ४ में सायरन सक्रिय।" : "✓ 2. Sirens fully active in Sector 4.",
        language === 'hi' ? "▶ ३. अस्थायी पांटून पुल ३ के पार ड्राइविंग, सावधानी: गीली सतह।" : "▶ 3. Driving across temporary Pontoon Bridge 3, caution: wet surface."
      ];
    }
    if (progress < 90) {
      return [
        language === 'hi' ? "✓ १. शिप्रा नदी पांटून पुल पार किया।" : "✓ 1. Crossed Shipra River Pontoon Bridge.",
        language === 'hi' ? "✓ २. घटना क्षेत्र की सीमा में प्रवेश।" : "✓ 2. Entering incident zone perimeter.",
        language === 'hi' ? "▶ ३. सावधानी के साथ पैदल मार्ग पर नेविगेट।" : "▶ 3. Navigating pedestrian corridor with caution."
      ];
    }
    return [
      language === 'hi' ? "✓ १. सटीक जीपीएस एंकर निर्देशांक पर पहुंचे।" : "✓ 1. Arrived on-site at exact GPS anchor coordinates.",
      language === 'hi' ? "✓ २. मरीज की स्थिति को सुरक्षित करना और समन्वय जारी।" : "✓ 2. Securing patient status & coordinating with central desk.",
      language === 'hi' ? "▶ ३. घटना का समाधान हुआ या बचाव अभियान जारी।" : "▶ 3. Incident resolved or rescue operation in-progress."
    ];
  };

  // Hardcoded locations representing main landmarks of Ujjain Simhastha 2028
  const locations: MapLocation[] = [
    {
      id: 'ram-ghat',
      name: 'Ram Ghat Bathing Platforms',
      x: 52,
      y: 54,
      category: 'Ghat',
      crowdLevel: 'Moderate',
      description: 'The ancient and primary holy entry banks of the pristine Shipra River in Ujjain. Central site of the sacred Simhastha bathing rituals and deep evening lamps visual offering (Aarati).',
      facilities: ['SDRF Lifeboats Guard lines', 'Private dress rooms tents', 'Pilgrim help towers closeby']
    },
    {
      id: 'mahakaleshwar',
      name: 'Mahakaleshwar Jyotirlinga Temple',
      x: 18,
      y: 68,
      category: 'Temple',
      crowdLevel: 'Heavy',
      description: 'The world-famous spiritual epicentre of Ujjain, housing the self-manifested (Swayambhu) south-facing Shivling (Mahakal). Renowned for its spectacular Bhasma Aarati.',
      facilities: ['Corridor exit golf-carts', 'VIP online booking queue gate', 'Sacred Prasad counters']
    },
    {
      id: 'harsiddhi',
      name: 'Harsiddhi Mata Mandir',
      x: 32,
      y: 42,
      category: 'Temple',
      crowdLevel: 'Moderate',
      description: 'One of the prestigious 51 sacred Shakti Peethas. Revering Goddess Harsiddhi, with its iconic twin huge sky-touching lamp towers that look mesmerizing when lit up during twilight.',
      facilities: ['Deepastambha lighting cells', 'Security queue rails', 'Wheelchair accessibility']
    },
    {
      id: 'dutt-akhara',
      name: 'Venerable Dutt Akhara Compound',
      x: 62,
      y: 24,
      category: 'Akhara',
      crowdLevel: 'Heavy',
      description: 'Located directly across the Shipra River from Ram Ghat. Celebrated spiritual campus hosting legendary Naga sadhus of the Giri sampradaya during Simhastha.',
      facilities: ['Saint discourse canopy', 'Continuous organic visual kitchen (Langar)', 'Security control box']
    },
    {
      id: 'lost-announcement',
      name: 'Shipra Sector Announcement Tower',
      x: 55,
      y: 35,
      category: 'Helpline',
      crowdLevel: 'Clean',
      description: 'Central control post handling public loud-address sirens, multilingual announcements, and lost relatives reunion desks.',
      facilities: ['Siren broadcaster system', 'Sitting rest pavilions', 'Emergency cell backups']
    },
    {
      id: 'mangalnath',
      name: 'Mangalnath Mandir Heights',
      x: 82,
      y: 72,
      category: 'Temple',
      crowdLevel: 'Moderate',
      description: 'Ancient, scenic shrine dedicated to Mars (Mangal), situated further upstream on historical Shipra banks. Extremely peaceful for astronomical and astrological prayers.',
      facilities: ['Quiet meditation gardens', 'Fresh filtered water points']
    }
  ];

  const activeLocation = locations.find(loc => loc.id === selectedLoc) || locations[0];

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'Ghat': return 'text-sky-600 bg-sky-100 border-sky-300';
      case 'Akhara': return 'text-amber-600 bg-amber-100 border-amber-300';
      case 'Helpline': return 'text-red-500 bg-red-100 border-red-350';
      case 'Temple': return 'text-orange-600 bg-orange-100 border-orange-300';
      default: return 'text-slate-600 bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="flex-1 min-h-screen px-10 py-12 flex flex-col justify-between overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0] font-sans" id="map-workspace">
      
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="map-header-block">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono bg-orange-100 text-[#a04000] border border-orange-200 rounded-full px-2.5 py-0.5 font-bold uppercase">Ujjain Simhastha Live GIS Matrix</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
            <Map className="w-8 h-8 text-[#e67e22]" />
            <span>{language === 'hi' ? 'शिप्रा नदी लाइव नेविगेटर' : 'Interactive Shipra River Navigator'}</span>
          </h2>
          <p className="text-sm font-sans text-[#8e746a] mt-1.5">
            {language === 'hi' 
              ? 'उज्जैन के घाटों, अखाड़ों, चिकित्सा केंद्रों और गश्ती दलों की वास्तविक स्थिति का अन्वेषण करें।' 
              : "Live satellite telemetry tracking pilgrims, severe incidents, active responder trucks/boats, and optimal route guidance."}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 bg-[#ffffff]/60 border border-[#eddcc1]/40 p-3 rounded-xl text-[10px] font-sans max-w-sm shrink-0" id="map-legends">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm" /> <span className="text-[#541d17] font-bold">Ghats</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm" /> <span className="text-[#541d17] font-bold">Shrines</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" /> <span className="text-[#541d17] font-bold">Akharas</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm animate-pulse" /> <span className="text-[#541d17] font-bold">Incidents (Patients)</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="map-core-grid">
        
        {/* Left Interactive SVG Map (Col Span 7) */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-3xl border border-[#eddcc1]/30 shadow-md relative select-none" id="map-cartography-box">
          
          {/* Compass Rose Accent */}
          <div className="absolute top-6 left-6 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-[#541d17] pointer-events-none z-10 opacity-75">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>

          <div className="relative border border-[#eddcc1]/20 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#fbf5ed] to-[#fffbfc] aspect-[4/3] w-full" id="map-viewport">
            
            {/* Inline SVG Map drawing River Shipra */}
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 z-0 select-none">
              {/* Shipra River curved path */}
              <path 
                d="M 30,0 Q 45,30 50,50 Q 55,70 28,80 Q 15,85 0,90 L 0,100 L 100,100 L 100,0 Z" 
                fill="#e0f2fe" 
                opacity="0.8" 
              />
              <path d="M 30,0 Q 45,30 50,50 Q 55,70 28,80 Q 15,85 0,90" stroke="#7dd3fc" strokeWidth="1" fill="none" strokeDasharray="1.5 1" />
              
              {/* Sacred convergence area rings */}
              <circle cx="50" cy="50" r="4" fill="#fef3c7" opacity="0.5" className="animate-pulse" />
              
              {/* Highlight Selected Incident with a pulsing glow circle */}
              {matchedIncidentCoords && (
                <circle 
                  cx={matchedIncidentCoords.x} 
                  cy={matchedIncidentCoords.y} 
                  r="3.5" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="0.8" 
                  className="animate-ping" 
                />
              )}
              
              {/* Draw Optimal route connecting line from nearest dispatch unit to active incident when navigating is active */}
              {isNavigating && matchedIncidentCoords && assignedPatrol && (
                <g className="animate-in fade-in" id="routed-line-group">
                  {/* Outer pulsating dashed line */}
                  <line 
                    x1={assignedPatrol.x} 
                    y1={assignedPatrol.y} 
                    x2={matchedIncidentCoords.x} 
                    y2={matchedIncidentCoords.y} 
                    stroke="#a855f7" 
                    strokeWidth="1.6" 
                    strokeDasharray="2.5 1.5"
                    className="animate-pulse"
                  />
                  {/* Glowing core line */}
                  <line 
                    x1={assignedPatrol.x} 
                    y1={assignedPatrol.y} 
                    x2={matchedIncidentCoords.x} 
                    y2={matchedIncidentCoords.y} 
                    stroke="#c084fc" 
                    strokeWidth="0.8" 
                  />
                  {/* Marker path arrow pointing */}
                  <circle cx={matchedIncidentCoords.x} cy={matchedIncidentCoords.y} r="2" stroke="#7c3aed" strokeWidth="0.5" fill="none" className="animate-ping" />
                </g>
              )}

              {/* Landmark geographical names */}
              <text x="5" y="38" fontSize="2px" fontFamily="sans-serif" fontWeight="bold" fill="#8e746a" opacity="0.65">Harsiddhi Ring Road</text>
              <text x="65" y="80" fontSize="2.2px" fontFamily="sans-serif" fontWeight="bold" fill="#8e746a" opacity="0.65">Mangalnath Outer Camp Sector 5</text>
              <text x="50" y="8" fontSize="2.4px" fontFamily="serif" fontWeight="bold" fill="#62534e" opacity="0.4">SHIPRA SACRED EAST FLOW</text>
            </svg>

            {/* Pulsing Static Landmarks */}
            {locations.map((loc) => {
              const markerBg = getMarkerColor(loc.category);
              const isActive = loc.id === selectedLoc;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLoc(loc.id);
                    // Clear incident highlights when switching landmarks
                    setSelectedIncidentMapId(null);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-300 group cursor-pointer ${
                    isActive ? 'scale-115 z-20' : 'hover:scale-105'
                  }`}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <div className={`p-1 rounded-full border shadow flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-gradient-to-tr from-[#e67e22] to-red-500 border-white text-white scale-110 shadow-md ring-2 ring-[#e67e22]/20' 
                      : markerBg
                  }`}>
                    <MapPin className="w-2.5 h-2.5" />
                  </div>
                  
                  <span className={`mt-0.5 text-[8px] font-sans font-bold px-1.5 py-0.5 rounded shadow-sm leading-none border transition-colors ${
                    isActive 
                      ? 'bg-[#541d17] border-[#541d17] text-white font-serif' 
                      : 'bg-[#faf5ed] border-[#eddcc1] text-[#541d17]'
                  }`}>
                    {loc.name.split(' ').slice(0, 2).join(' ')}
                  </span>
                </button>
              );
            })}

            {/* Plot Active Incidents / Patients on the Map Matrix (Requirement 8) */}
            {incidents.map((inc) => {
              const coordinates = coordinateMap[inc.location];
              if (!coordinates) return null;

              const isHighlighted = selectedIncidentMapId === inc.id;
              const isCritical = inc.severity === 'Critical';

              return (
                <button
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentMapId(inc.id);
                    setSelectedLoc(''); // deselect standard landmarks
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-25 transition-all duration-300 group cursor-pointer"
                  style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}
                >
                  {/* Glowing pulsing red dot representing critical injured or incident (Requirement 8) */}
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center relative shadow ${
                    isCritical ? 'bg-red-650' : 'bg-red-550'
                  } ${isHighlighted ? 'ring-2 ring-purple-600 scale-125' : ''}`}>
                    <span className="w-2 h-2 rounded-full bg-white block" />
                    <span className={`w-6 h-6 rounded-full border border-red-500 absolute animate-ping pointer-events-none opacity-70 ${
                      isCritical ? '' : 'hidden'
                    }`} />
                  </div>
                  <span className="bg-red-700 border border-red-600 text-white font-mono text-[7px] font-bold px-1 py-0.5 rounded shadow-sm mt-0.5">
                    🚨 {inc.category.split(' ')[0] || 'SOS'}
                  </span>
                </button>
              );
            })}

            {/* Plot Active Patrol Teams (Requirement 8)  */}
            {activePatrols.map((pat) => (
              <div
                key={pat.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-15"
                style={{ left: `${pat.x}%`, top: `${pat.y}%` }}
              >
                <div className={`p-1 rounded-full text-white shadow-sm flex items-center justify-center border border-white ${
                  pat.type === 'police' ? 'bg-blue-600' : pat.type === 'medical' ? 'bg-emerald-600' : 'bg-orange-500'
                }`}>
                  {pat.type === 'police' ? <Shield className="w-2.5 h-2.5" /> : pat.type === 'medical' ? <Activity className="w-2.5 h-2.5" /> : <Flame className="w-2.5 h-2.5" />}
                </div>
                <span className="bg-white/95 border border-gray-100 text-neutral-800 text-[6.5px] font-bold px-1 rounded shadow-xs mt-0.5 leading-none">
                  {pat.name.split(' ').slice(-1)[0]}
                </span>
              </div>
            ))}

            {/* Live dynamic responder marker (Requirement 8) */}
            {isNavigating && currentResponderPos && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 transition-all duration-100"
                style={{ left: `${currentResponderPos.x}%`, top: `${currentResponderPos.y}%` }}
              >
                <div className={`p-1.5 rounded-full text-white shadow-md flex items-center justify-center border-2 border-white animate-bounce ${
                  assignedPatrol ? (assignedPatrol.type === 'police' ? 'bg-blue-700 font-extrabold ring-4 ring-blue-500/30' : assignedPatrol.type === 'medical' ? 'bg-emerald-700 font-extrabold ring-4 ring-emerald-500/30' : 'bg-orange-600 font-extrabold ring-4 ring-orange-500/30') : 'bg-purple-600'
                }`}>
                  {assignedPatrol ? (
                    assignedPatrol.type === 'police' ? <Shield className="w-3.5 h-3.5" /> : assignedPatrol.type === 'medical' ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Flame className="w-3.5 h-3.5" />
                  ) : <Navigation className="w-3.5 h-3.5" />}
                </div>
                <span className="bg-purple-900 border border-purple-800 text-white font-mono text-[7px] font-extrabold px-1.5 py-0.5 rounded shadow-sm mt-0.5 leading-none uppercase tracking-wide animate-pulse">
                  ⚡ En Route ({navigationProgress}%)
                </span>
              </div>
            )}

            {/* Shipra River flow text indicator */}
            <div className="absolute top-[38%] left-[30%] flex items-center gap-1 opacity-65 text-sky-750 pointer-events-none select-none">
              <Waves className="w-3.5 h-3.5 animate-bounce" />
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider">River Shipra Flowing</span>
            </div>
          </div>
        </div>

        {/* Right Details & Route Guidance Sidebar (Col Span 5) */}
        <div className="lg:col-span-5 space-y-5" id="map-detail-sidebar">
          
          {/* Active Landmark or selected Incident detail panel */}
          {currentSelectedMapIncidentIndex ? (
            <div className="glass-panel p-6 rounded-3xl border border-red-200 bg-red-50/50 shadow-md relative overflow-hidden animate-in zoom-in duration-200" id="selected-incident-telemetry-box">
              <div className="absolute top-0 right-0 p-2 bg-red-600 text-white text-[9px] font-mono font-black rounded-bl-xl uppercase tracking-wider animate-pulse">
                Active Incident Selected
              </div>

              <div className="flex items-center gap-2 mb-3">
                <AlertOctagon className="w-5 h-5 text-red-600 animate-bounce" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  {currentSelectedMapIncidentIndex.category}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#541d17]">
                "{currentSelectedMapIncidentIndex.description}"
              </h3>

              <div className="mt-4 space-y-2.5 text-xs text-[#8e746a] bg-white p-4.5 rounded-2xl border border-red-100" id="reported-capsule-metadata">
                <p><strong>Reporter Contact:</strong> {currentSelectedMapIncidentIndex.reporterName} ({currentSelectedMapIncidentIndex.reporterPhone})</p>
                <p><strong>Current Status:</strong> <span className="text-red-700 font-bold uppercase">{currentSelectedMapIncidentIndex.status}</span></p>
                <p><strong>Priority Level:</strong> <span className="text-orange-700 font-bold uppercase bg-orange-50 px-2 py-0.5 border border-orange-200 rounded text-[9px]">{currentSelectedMapIncidentIndex.severity}</span></p>
                <p><strong>Assigned Platoon:</strong> <span className="text-neutral-700 font-bold">{currentSelectedMapIncidentIndex.assignedTeam || 'Pending Allocation'}</span></p>
                <p className="flex items-center gap-1"><strong>Sector Loop:</strong> <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" /> {currentSelectedMapIncidentIndex.location}</p>
                
                {/* Coordinates requirement */}
                <div className="mt-3 pt-3 border-t border-neutral-100 text-[10.5px] font-mono text-purple-700 space-y-1">
                  <p>📍 <strong>Latitude:</strong> {currentSelectedMapIncidentIndex.latitude || '23.1831° N'}</p>
                  <p>📍 <strong>Longitude:</strong> {currentSelectedMapIncidentIndex.longitude || '75.7676° E'}</p>
                </div>
              </div>

              {/* Start Navigation UI Workflow */}
              {assignedPatrol && (
                <div className="mt-4 space-y-3">
                  {!isNavigating ? (
                    <button
                      type="button"
                      onClick={() => setIsNavigating(true)}
                      className="w-full py-3.5 bg-purple-750 hover:bg-purple-800 text-white font-sans text-xs font-bold rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm shadow-purple-200"
                    >
                      <span>🧭 Start Navigation</span>
                    </button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-3.5 animate-in slide-in-from-top duration-200" id="navigation-active-meta">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-950">
                        <span className="flex items-center gap-1">🟢 Navigation Plotted Live</span>
                        <button 
                          onClick={() => setIsNavigating(false)} 
                          className="text-[10px] text-red-600 hover:underline uppercase font-bold"
                        >
                          Stop ✕
                        </button>
                      </div>
                      
                      {/* Distance and ETA metrics */}
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-white p-2.5 rounded-xl border border-purple-150">
                          <span className="text-[10px] text-neutral-400 block uppercase font-mono font-bold">{language === 'hi' ? 'अनुमानित दूरी' : 'Estimated Distance'}</span>
                          <span className="text-xs font-bold text-neutral-800 animate-pulse">
                            {navigationProgress >= 100 ? '0.0' : (fullDistance * ((100 - navigationProgress) / 100)).toFixed(1)} km
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-xl border border-purple-150">
                          <span className="text-[10px] text-neutral-400 block uppercase font-mono font-bold">{language === 'hi' ? 'अनुमानित समय' : 'Estimated Travel Time'}</span>
                          <span className="text-xs font-bold text-neutral-800 animate-pulse">
                            {navigationProgress >= 100 ? '0' : Math.max(1, Math.round(fullTime * ((100 - navigationProgress) / 100)))} mins
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Turn by Turn directions panel */}
                      <div className="space-y-1 text-[11px] pt-2 border-t border-purple-200/50" id="navigation-steps-flow">
                        <span className="block text-[9px] font-mono text-purple-600 font-bold uppercase mb-1">
                          {language === 'hi' ? 'दिशा-निर्देश अनुक्रम' : 'Turn-by-Turn Directions List'}
                        </span>
                        {getTurnByTurnDirections(navigationProgress).map((step, idx) => (
                          <div 
                            key={idx} 
                            className={`p-2 rounded-lg text-left transition-all border ${
                              step.startsWith('✓') 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-100 line-through opacity-75' 
                                : step.startsWith('▶') || step.startsWith('१') || step.startsWith('1')
                                ? 'bg-purple-100 text-purple-900 border-purple-200 font-semibold shadow-inner' 
                                : 'bg-[#fffaf3] text-neutral-700 border-[#eddcc1]/50'
                            }`}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setSelectedIncidentMapId(null);
                  setIsNavigating(false);
                }}
                className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 font-sans text-[11px] font-bold text-neutral-600 rounded-xl transition-all cursor-pointer text-center"
              >
                ← Back to Shrines &amp; Landmarks
              </button>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm relative overflow-hidden" id="details-capsule">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${getMarkerColor(activeLocation.category)}`}>
                <Navigation className="w-6 h-6 animate-pulse" />
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider bg-orange-100 text-[#a04000] px-2.5 py-1 rounded-full font-bold">
                {activeLocation.category} Sector landmark
              </span>

              <h3 className="font-serif text-2xl font-extrabold text-[#541d17] mt-3 leading-tight">
                {activeLocation.name}
              </h3>

              <p className="text-xs text-[#8e746a] font-sans mt-3 leading-relaxed">
                {activeLocation.description}
              </p>

              {/* Quick specifications */}
              <div className="mt-5 pt-5 border-t border-[#eddcc1]/30 space-y-4" id="specs-inside">
                
                {/* Density check */}
                <div className="flex items-center justify-between" id="crowd-density-tracker">
                  <div className="flex items-center gap-2 text-xs font-sans text-[#62534e]">
                    <Clock className="w-4 h-4 text-[#e67e22]" />
                    <span>Current Pilgrim Density:</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    activeLocation.crowdLevel === 'Heavy' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : activeLocation.crowdLevel === 'Moderate'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    ● {activeLocation.crowdLevel}
                  </span>
                </div>

                {/* On-Site Facilities */}
                <div>
                  <h4 className="text-[11px] uppercase font-sans font-bold tracking-wider text-[#a04000] flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-[#e67e22]" />
                    <span>On-Site Facilities Available</span>
                  </h4>
                  <ul className="space-y-1.5" id="facility-bullets">
                    {activeLocation.facilities.map((fac, idx) => (
                      <li key={idx} className="text-xs text-[#541d17] font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e67e22]" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Streamed Incidents Directory inside the map */}
                <div className="pt-3 border-t border-neutral-100">
                  <span className="text-[10px] font-mono text-purple-600 font-bold block uppercase tracking-wider mb-2">🚨 Live Incidents Linked to Spatial Coordinates</span>
                  
                  {incidents.length === 0 ? (
                    <p className="text-[11px] font-sans text-neutral-400 italic">No incidents to stream. Simulated reports will appear here.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto" id="spatial-incident-scroller">
                      {incidents.map((inc) => (
                        <button
                          key={inc.id}
                          onClick={() => setSelectedIncidentMapId(inc.id)}
                          className="w-full text-left p-2.5 rounded-xl border border-red-100 bg-red-50/20 hover:bg-red-50/60 transition-colors flex items-center justify-between text-xs cursor-pointer gap-2"
                        >
                          <div className="truncate flex-1 min-w-0">
                            <span className="font-bold text-red-700 block truncate">{inc.category}</span>
                            <span className="text-[10px] text-neutral-500 block truncate font-sans">"{inc.description}"</span>
                          </div>
                          <span className="shrink-0 text-[9px] font-sans font-bold text-red-600 flex items-center gap-0.5 uppercase bg-white border border-red-100 px-1.5 py-0.5 rounded-full">
                            Select ⚡
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Quick Navigator Compass help card */}
          <div className="glass-panel p-5 rounded-2xl border border-[#eddcc1]/20 bg-white/40 flex items-center gap-4 animate-pulse" id="directions-launcher">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner shrink-0">
              <Navigation className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h5 className="text-xs font-sans font-bold text-[#541d17]">
                {language === 'hi' ? 'दिशानिर्देश एवं गश्ती दल नेविगेशन' : 'Satellite Telecommunication Network'}
              </h5>
              <p className="text-[11px] text-[#8e746a] font-sans mt-0.5">
                {language === 'hi' 
                  ? 'लाइव मार्ग प्रदर्शन प्रणाली सक्रिय।' 
                  : 'Displaying routing connection arrays for active Simhastha safety units.'}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
