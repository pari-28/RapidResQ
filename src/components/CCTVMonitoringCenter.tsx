import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  AlertTriangle, 
  Loader2, 
  BellRing,
  ArrowRight,
  MapPin,
  Sparkles,
  RefreshCw,
  Activity
} from 'lucide-react';
import { Incident } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface CameraFeed {
  id: string;
  name: string;
  locationName: string;
  dbLocation: string; // matches coordinateMap keys exactly
  status: 'Active' | 'Maintenance' | 'Low Visibility';
  fps: number;
  videoUrl: string;
  anomalyType: string;
  anomalyBox: { left: string; top: string; width: string; height: string };
  anomalyLabel: string;
  anomalyConfidence: number;
  anomalyZone: string;
}

interface CCTVMonitoringCenterProps {
  incidents: Incident[];
  onAIPostReport: (newInc: {
    category: Incident['category'];
    location: string;
    description: string;
    reporterName: string;
    reporterPhone: string;
    severity: Incident['severity'];
    originalLanguage?: string;
  }) => Promise<void>;
  language?: 'en' | 'hi';
  onLocateOnMap?: (incidentId: string) => void;
}

export default function CCTVMonitoringCenter({
  incidents = [],
  onAIPostReport,
  language = 'en',
  onLocateOnMap
}: CCTVMonitoringCenterProps) {
  const t = TRANSLATIONS[language];
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [activeCamId, setActiveCamId] = useState<string>('cam-1');
  const [currentTimeStamp, setCurrentTimeStamp] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStamp(now.toLocaleTimeString() + ' | 23-APR-2028');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cameraFeeds: CameraFeed[] = [
    { 
      id: 'cam-1', 
      name: 'Ram Ghat Sector Alpha', 
      locationName: 'Ram Ghat, Sector 2', 
      dbLocation: 'Ram Ghat, Sector 2', 
      status: 'Active', 
      fps: 30,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-crowded-city-street-40402-large.mp4',
      anomalyType: 'Crowd Congestion',
      anomalyBox: { left: '15%', top: '22%', width: '45%', height: '48%' },
      anomalyLabel: language === 'hi' ? '🚨 अत्यधिक भीड़ (Crowd Congestion)' : '🚨 Crowd Congestion Detected',
      anomalyConfidence: 94,
      anomalyZone: 'Ghat Area Platform 4 & Bottleneck Inflow'
    },
    { 
      id: 'cam-2', 
      name: 'Mahakal Temple Corridor', 
      locationName: 'Mahakaleshwar Jyotirlinga Temple', 
      dbLocation: 'Mahakaleshwar Corridor Exit', 
      status: 'Active', 
      fps: 30,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-walking-in-a-crowded-street-at-night-40411-large.mp4',
      anomalyType: 'Medical Emergency',
      anomalyBox: { left: '38%', top: '40%', width: '32%', height: '32%' },
      anomalyLabel: language === 'hi' ? '🟡 गिरा हुआ व्यक्ति (Person Fallen)' : '🟡 Person Fallen Anomaly',
      anomalyConfidence: 91,
      anomalyZone: 'Mahakal Temple Transit corridor block B'
    },
    { 
      id: 'cam-3', 
      name: 'Harisiddhi Outer Compound', 
      locationName: 'Harsiddhi Mata Mandir Outer', 
      dbLocation: 'Harisiddhi Gate Compound', 
      status: 'Active', 
      fps: 28,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-busy-street-with-crowds-and-traffic-lights-at-night-40401-large.mp4',
      anomalyType: 'Security Threat',
      anomalyBox: { left: '30%', top: '20%', width: '38%', height: '45%' },
      anomalyLabel: language === 'hi' ? '🟠 प्रतिबंधित क्षेत्र घुसपैठ (Restricted Entry)' : '🟠 Restricted Area Intrusion',
      anomalyConfidence: 88,
      anomalyZone: 'Inner Sanctum Saint Compound Fence Gate'
    },
    { 
      id: 'cam-4', 
      name: 'Shipra Pontoon Bridge 3 Flow', 
      locationName: 'Shipra Pontoon Bridge 3', 
      dbLocation: 'Shipra Pontoon Bridge 3', 
      status: 'Active', 
      fps: 24,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-people-crossing-a-street-with-crowd-background-40406-large.mp4',
      anomalyType: 'Fire Hazard',
      anomalyBox: { left: '50%', top: '35%', width: '35%', height: '38%' },
      anomalyLabel: language === 'hi' ? '🔴 धुआं/आग संदिग्ध (Fire/Smoke Detected)' : '🔴 Smoke/Flame Suspected',
      anomalyConfidence: 96,
      anomalyZone: 'Pontoon Anchor Bridge 3 Underlay'
    },
    { 
      id: 'cam-5', 
      name: 'Dutt Akhara Pilgrim Intake', 
      locationName: 'Venerable Dutt Akhara Compound', 
      dbLocation: 'Dutt Akhara Circle', 
      status: 'Active', 
      fps: 30,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-movement-of-people-on-a-busy-city-street-40400-large.mp4',
      anomalyType: 'Stampede Risk',
      anomalyBox: { left: '20%', top: '15%', width: '48%', height: '60%' },
      anomalyLabel: language === 'hi' ? '🟠 भगदड़ का खतरा (Stampede Risk)' : '🟠 Stampede Risk Identified',
      anomalyConfidence: 89,
      anomalyZone: 'Akharas Entrance Circle Junction'
    },
    { 
      id: 'cam-6', 
      name: 'Mangalnath Heights Sector East', 
      locationName: 'Mangalnath Mandir', 
      dbLocation: 'Mangalnath Sector 5', 
      status: 'Active', 
      fps: 25,
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-overhead-view-of-people-crossing-a-crosswalk-40409-large.mp4',
      anomalyType: 'Security Threat',
      anomalyBox: { left: '25%', top: '42%', width: '42%', height: '35%' },
      anomalyLabel: language === 'hi' ? '🟠 अनधिकृत पहुंच (Unauthorized Intrusion)' : '🟠 Perimeter Breach Warning',
      anomalyConfidence: 85,
      anomalyZone: 'East Overlook Ridge Restricted Area'
    },
  ];

  const selectedCam = cameraFeeds.find(c => c.id === activeCamId) || cameraFeeds[0];

  // System status metrics
  const activeAlertsCount = incidents.filter(i => i.reporterName === 'AI CCTV Watchdog' && i.status !== 'Resolved').length;

  const triggerAIScan = async () => {
    if (isScanning) return;
    setIsScanning(true);

    const steps = [
      language === 'hi' ? 'मल्टी-स्पेक्ट्रल कैमरा नेटवर्क को कैलिब्रेट किया जा रहा है...' : 'Calibrating multi-spectral camera nets...',
      language === 'hi' ? 'शिप्रा रिवरफ्रंट सेक्टर की थर्मल स्कैनिंग जारी...' : 'Performing thermal scans of Shipra Riverfronts...',
      language === 'hi' ? 'एआई विसंगति कन्वेन्शनल नेटवर्क सक्रिय किया जा रहा है...' : 'Activating convolutional anomaly detection...',
      language === 'hi' ? 'भीड़-घनत्व वैक्टर विश्लेषण पूरा हो रहा है...' : 'Running real-time crowd-density vector matching...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setScanStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    const threatScenarios = [
      {
        category: 'Crowd Congestion' as const,
        severity: 'High' as const,
        location: 'Ram Ghat, Sector 2',
        description: 'AI Threat Watchdog: Stampede risk flagged due to irregular bottleneck surge near bathing gate 4. [Confidence: 94%] [Recommended Team: Police Platoon 7]',
        camId: 'cam-1'
      },
      {
        category: 'Medical Emergency' as const,
        severity: 'Medium' as const,
        location: 'Mahakaleshwar Corridor Exit',
        description: 'AI Threat Watchdog: Elderly pilgrim collapsed in corridor transit lane. Medical backup required. [Confidence: 91%] [Recommended Team: Medical Rescue Alpha]',
        camId: 'cam-2'
      },
      {
        category: 'Fire Hazard' as const,
        severity: 'Critical' as const,
        location: 'Shipra Pontoon Bridge 3',
        description: 'AI Threat Watchdog: Smoke plume detected underneath bridge anchor. SDRF dispatch recommended. [Confidence: 96%] [Recommended Team: SDRF Rescue Boat 3]',
        camId: 'cam-4'
      },
      {
        category: 'Security Threat' as const,
        severity: 'High' as const,
        location: 'Dutt Akhara Circle',
        description: 'AI Threat Watchdog: Stampede risk flagged due to irregular bottleneck surge near akharas entrance. [Confidence: 89%] [Recommended Team: Police Platoon 3]',
        camId: 'cam-5'
      },
      {
        category: 'Security Threat' as const,
        severity: 'Medium' as const,
        location: 'Harisiddhi Gate Compound',
        description: 'AI Threat Watchdog: Unattended luggage left resting on restricted exit perimeter. [Confidence: 88%] [Recommended Team: Police Security]',
        camId: 'cam-3'
      }
    ];

    // Select scenario of the currently active camera if possible, otherwise pick a random one
    let scenario = threatScenarios.find(s => s.camId === activeCamId);
    if (!scenario) {
      scenario = threatScenarios[Math.floor(Math.random() * threatScenarios.length)];
    }

    try {
      await onAIPostReport({
        category: scenario.category,
        location: scenario.location,
        description: scenario.description,
        reporterName: 'AI CCTV Watchdog',
        reporterPhone: '000-CCTV-AIVE',
        severity: scenario.severity,
        originalLanguage: 'en'
      });
      
      setActiveCamId(scenario.camId);
    } catch (error) {
      console.error("AI CCTV automation reports deployment failed:", error);
    }

    setIsScanning(false);
    setScanStep('');
  };

  const aiAlertsList = incidents.filter(inc => inc.reporterName === 'AI CCTV Watchdog');

  // Parses alert fields for high-fidelity compliance
  const parseAlertMeta = (alert: Incident) => {
    let confidence = 94;
    let recommendedTeam = 'Police Platoon';
    
    if (alert.category === 'Crowd Congestion') {
      confidence = 94;
      recommendedTeam = 'Police Sector Command';
    } else if (alert.category === 'Medical Emergency') {
      confidence = 91;
      recommendedTeam = 'Red Cross Medical Team';
    } else if (alert.category === 'Fire Hazard') {
      confidence = 96;
      recommendedTeam = 'SDRF Guard & Boat Patrol';
    } else if (alert.category === 'Security Threat') {
      confidence = 88;
      recommendedTeam = 'District Police Platoon 7';
    } else if (alert.category === 'Water Rescue') {
      confidence = 93;
      recommendedTeam = 'SDRF Water Squad';
    }

    const confMatch = alert.description.match(/\[Confidence:\s*(\d+)%\]/i);
    if (confMatch) {
      confidence = parseInt(confMatch[1], 10);
    }

    const teamMatch = alert.description.match(/\[Recommended Team:\s*([^\]]+)\]/i);
    if (teamMatch) {
      recommendedTeam = teamMatch[1].trim();
    }

    let cleanDesc = alert.description;
    cleanDesc = cleanDesc.replace(/\[Confidence:.*?\]/gi, '').replace(/\[Recommended Team:.*?\]/gi, '').trim();

    return { confidence, recommendedTeam, cleanDesc };
  };

  const currentCamHasAlert = incidents.some(
    i => i.reporterName === 'AI CCTV Watchdog' && i.location === selectedCam.dbLocation && i.status !== 'Resolved'
  );

  return (
    <div className="flex-1 min-h-screen px-6 py-8 flex flex-col justify-start overflow-y-auto bg-gradient-to-tr from-[#fffbf8] via-[#fff5eb] to-[#fcf1e8]" id="cctv-workspace">
      
      {/* Header section with real-time badges */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#eddcc1]/40" id="cctv-header-block">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[9px] font-mono bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-ping" />
              <span>Real-Time AI Surveillance</span>
            </span>
            <span className="text-[9px] font-mono bg-purple-100 text-purple-700 border border-purple-200 rounded-full px-2 py-0.5 font-bold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-650" />
              <span>Computer Vision Active</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#541d17] flex items-center gap-2">
            <Video className="w-7 h-7 text-[#e67e22] animate-pulse" />
            <span>{language === 'hi' ? 'उज्जैन सीसीटीवी एआई विसंगति केंद्र' : 'Ujjain CCTV AI Anomaly Center'}</span>
          </h2>
          <p className="text-xs md:text-sm font-sans text-[#8e746a] mt-0.5">
            {language === 'hi' 
              ? 'एआई मॉडल के माध्यम से सजीव घटनाओं, भगदड़ जोखिम और भीड़ नियंत्रण का स्वचालित मापन और त्वरित पुलिस/चिकित्सा प्रेषण।' 
              : "Monitor automated pre-incident telemetry and crowd analytics before pilgrims file manual reports."}
          </p>
        </div>

        {/* Global AI Action Button */}
        <button
          type="button"
          onClick={triggerAIScan}
          disabled={isScanning}
          id="trigger-ai-scan-btn"
          className={`px-5 py-3 rounded-xl font-sans text-xs font-extrabold tracking-wide text-white transition-all shadow-md flex items-center gap-2 cursor-pointer border ${
            isScanning 
              ? 'bg-neutral-400 border-neutral-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-red-650 to-red-550 border-red-650 hover:scale-102 shadow-red-500/10'
          }`}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>{language === 'hi' ? 'एआई जांच जारी है...' : 'AI Scan Processing...'}</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              <span>{language === 'hi' ? 'लांच एआई विसंगति स्कैन' : 'Trigger Automated AI Threat Scan'}</span>
            </>
          )}
        </button>
      </div>

      {/* AI scan state overlay ticker */}
      {isScanning && (
        <div className="mb-4 p-3 rounded-xl border border-purple-200 bg-purple-50 text-purple-950 font-mono text-xs flex items-center gap-2.5 animate-pulse" id="scan-ticker">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
          <span className="font-semibold">{language === 'hi' ? 'स्थिति:' : 'Status:'}</span>
          <span className="font-bold">{scanStep}</span>
        </div>
      )}

      {/* Dual Screen Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="cctv-core-layout">
        
        {/* Left Side: CCTV Grid (Col Span 8) */}
        <div className="xl:col-span-8 space-y-6" id="cctv-feeds-compartment">
          
          {/* Focused Large Live Feed Player */}
          <div className="glass-panel p-3 rounded-3xl border border-[#eddcc1]/40 bg-zinc-950/95 relative text-white" id="focused-tv-player">
            
            {/* Player details floating banners */}
            <div className="absolute top-5 left-5 z-20 font-mono text-[9px] bg-black/80 px-2.5 py-1.5 rounded border border-white/15 flex flex-col gap-0.5 shadow-md">
              <span className="text-red-500 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                <span>REC LIVE [FEED: {selectedCam.id.toUpperCase()}]</span>
              </span>
              <span className="text-neutral-200 font-bold">{selectedCam.name}</span>
              <span className="text-neutral-400 text-[8px]">{selectedCam.locationName}</span>
            </div>

            <div className="absolute top-5 right-5 z-20 font-mono text-[8px] bg-black/80 text-neutral-300 px-2.5 py-1.5 rounded border border-white/15 flex flex-col items-end shadow-md">
              <span>{currentTimeStamp}</span>
              <span className={currentCamHasAlert ? "text-red-500 font-bold" : "text-emerald-400 font-bold"}>
                {currentCamHasAlert ? "AI WATCHDOG: ALERT TRIGGERED" : "AI WATCHDOG: COGNITIVE SAFE SCAN"}
              </span>
              <span>FPS: {selectedCam.fps} | CAM: {selectedCam.id.toUpperCase()}</span>
            </div>

            {/* Live Video player container with absolute layers */}
            <div className="w-full aspect-[16/9] rounded-2xl relative overflow-hidden bg-neutral-900 flex items-center justify-center select-none" id="live-simulation-viewport">
              
              {/* Scan Line Overlays */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />
              
              {/* HTML5 Loop stream from Mixkit */}
              <video
                key={selectedCam.id}
                src={selectedCam.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover absolute inset-0 z-0 opacity-80"
              />

              {/* General Crowds / Pilgrims tracking boxes inside model view */}
              <div className="absolute left-[35%] top-[25%] w-[12%] h-[18%] border border-emerald-400 bg-emerald-500/5 rounded pointer-events-none z-15 flex flex-col justify-start p-0.5 shadow-sm">
                <span className="text-emerald-400 font-mono text-[6px] bg-black/70 px-1 rounded-sm leading-none font-bold w-max">PILGRIM 98%</span>
              </div>
              <div className="absolute left-[65%] top-[18%] w-[10%] h-[24%] border border-emerald-400 bg-emerald-500/5 rounded pointer-events-none z-15 flex flex-col justify-start p-0.5 shadow-sm">
                <span className="text-emerald-400 font-mono text-[6px] bg-black/70 px-1 rounded-sm leading-none font-bold w-max">PILGRIM 92%</span>
              </div>
              <div className="absolute left-[45%] top-[55%] w-[9%] h-[14%] border border-emerald-400 bg-emerald-500/5 rounded pointer-events-none z-15 flex flex-col justify-start p-0.5 shadow-sm">
                <span className="text-emerald-400 font-mono text-[6px] bg-black/70 px-1 rounded-sm leading-none font-bold w-max">PILGRIM 95%</span>
              </div>
              <div className="absolute left-[12%] top-[45%] w-[11%] h-[15%] border border-[#38bdf8] bg-sky-500/5 rounded pointer-events-none z-15 flex flex-col justify-start p-0.5 shadow-sm">
                <span className="text-sky-300 font-mono text-[6px] bg-black/70 px-1 rounded-sm leading-none font-bold w-max">VOLUNTEER 94%</span>
              </div>

              {/* Dynamic Warning box if active alert matches current camera */}
              {currentCamHasAlert ? (
                <div 
                  style={{
                    left: selectedCam.anomalyBox.left,
                    top: selectedCam.anomalyBox.top,
                    width: selectedCam.anomalyBox.width,
                    height: selectedCam.anomalyBox.height,
                  }}
                  className="absolute border-2 border-red-500 bg-red-950/20 rounded-xl z-20 flex flex-col justify-between p-2 animate-pulse shadow-2xl shadow-red-500/40" 
                  id="alert-feed-box-overlay"
                >
                  <div className="flex items-center justify-between text-[7px] font-bold text-red-500 bg-black/85 px-1.5 py-1 rounded border border-red-500/30">
                    <span className="flex items-center gap-1 uppercase tracking-wider">
                      <AlertTriangle className="w-2.5 h-2.5 text-red-500 animate-bounce" />
                      <span>{selectedCam.anomalyType} ACTIVE</span>
                    </span>
                    <span className="bg-red-650 text-white px-1 rounded">CONF: {selectedCam.anomalyConfidence}%</span>
                  </div>

                  <div className="bg-black/85 p-1.5 rounded-lg border border-red-500/20">
                    <p className="text-[6px] font-mono uppercase text-red-400 font-bold tracking-widest leading-none mb-0.5">Automated Risk Track</p>
                    <p className="text-[8.5px] font-bold leading-normal text-white">
                      {selectedCam.anomalyLabel}
                    </p>
                    <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-[7px] text-gray-300 gap-2">
                      <span>ZONE: <strong>{selectedCam.anomalyZone}</strong></span>
                      <span>TEAM: <strong>{language === 'hi' ? 'सुरक्षा बल' : 'Sector Guard'}</strong></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/75 text-center flex items-center gap-1.5 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                    🟢 Multi-spectral Anomaly Analyzer Scan - Safe
                  </span>
                </div>
              )}

              {/* Crosshair target design for tech feel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/10 pointer-events-none rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full opacity-60" />
              </div>

            </div>
          </div>

          {/* 6 Grid Camera selection */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3" id="cameras-selection-grid">
            {cameraFeeds.map((feed) => {
              const hasAlert = incidents.some(i => i.reporterName === 'AI CCTV Watchdog' && i.location === feed.dbLocation && i.status !== 'Resolved');
              const isSelected = feed.id === activeCamId;

              return (
                <button
                  key={feed.id}
                  onClick={() => setActiveCamId(feed.id)}
                  className={`p-3 rounded-2xl text-left transition-all relative border overflow-hidden cursor-pointer flex flex-col justify-between aspect-[4/3] ${
                    hasAlert 
                      ? 'bg-red-50/80 border-red-300 hover:bg-red-50 shadow-sm shadow-red-200 animate-pulse' 
                      : isSelected 
                      ? 'bg-white border-[#541d17] ring-2 ring-[#e67e22]/20 shadow-md' 
                      : 'bg-white border-[#eddcc1]/30 hover:border-[#eddcc1]/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 w-full">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#a04000]">
                      CAM-{feed.id.split('-')[1]}
                    </span>
                    <span className={`inline-flex items-center gap-0.5 text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      hasAlert 
                        ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                    }`}>
                      ● {hasAlert ? 'Alarm' : 'Live'}
                    </span>
                  </div>

                  <div className="mt-3 flex-1">
                    <h4 className="text-xs font-sans font-extrabold text-[#541d17] line-clamp-1">
                      {feed.name}
                    </h4>
                    <p className="text-[10px] text-[#8e746a] truncate flex items-center gap-0.5 mt-0.5 leading-none">
                      <MapPin className="w-2.5 h-2.5 text-[#e67e22]" /> {feed.locationName}
                    </p>
                  </div>

                  {/* HTML5 video preview placeholder crop */}
                  <div className="w-full h-8 rounded-lg bg-neutral-950 mt-2 relative overflow-hidden flex items-center justify-center opacity-90 border border-neutral-800">
                    <video
                      src={feed.videoUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover absolute inset-0 z-0 opacity-40 brightness-75"
                    />
                    <div className="absolute inset-0 bg-neutral-950/20 z-10" />
                    <span className="text-[7.5px] font-mono text-neutral-300 z-11">FPS: {feed.fps}</span>
                    {hasAlert && <span className="absolute inset-0 bg-red-650/15 border border-red-500 animate-ping pointer-events-none z-12" />}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Side: AI Alert Feed Dashboard Panel (Col Span 4) */}
        <div className="xl:col-span-4 space-y-5" id="cctv-dashboard-sidebar">
          
          {/* Global analytics telemetry metrics */}
          <div className="glass-panel p-4 rounded-2xl border border-[#eddcc1]/35 bg-white/60 space-y-3" id="surveillance-telecomm-stats">
            <h3 className="font-serif text-base font-bold text-[#541d17] flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-red-650" />
              <span>Surveillance Analytics</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5 font-sans text-center">
              <div className="bg-[#fffaf3] p-2.5 rounded-xl border border-[#eddcc1]/30">
                <span className="text-[9px] text-[#8e746a] block uppercase font-mono font-semibold">Active Feeds</span>
                <span className="text-lg font-bold text-[#541d17] flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>6 Streams</span>
                </span>
              </div>
              <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-200">
                <span className="text-[9px] text-red-700 block uppercase font-mono font-semibold">Active AI ALERTS</span>
                <span className="text-lg font-bold text-red-800 animate-pulse">{activeAlertsCount} Reports</span>
              </div>
            </div>

            <p className="text-[10.5px] text-[#8e746a] leading-normal font-sans">
              Every incident generated by AI is indexed inside Firestore. Updates trigger real-time alerts across CommandCenter dispatch consoles.
            </p>
          </div>

          {/* AI Triggered Alert Cards List */}
          <div className="glass-panel p-4 rounded-3xl border border-[#eddcc1]/35 bg-white flex flex-col justify-start" id="alerts-matrix-scroller-box">
            
            <span className="text-[10.5px] font-mono text-red-750 font-extrabold tracking-wider uppercase block mb-3 border-b border-neutral-100 pb-1.5 flex items-center justify-between">
              <span>📢 Neural Threat Feed ({aiAlertsList.length})</span>
              <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">LIVE</span>
            </span>

            {aiAlertsList.length === 0 ? (
              <div className="py-12 px-4 rounded-2xl border border-dashed border-[#eddcc1]/50 text-center bg-gray-50/50 flex flex-col items-center">
                <AlertTriangle className="w-8 h-8 text-[#9c8577]/65 mb-2" />
                <span className="text-xs text-[#541d17] font-semibold">No active warnings</span>
                <p className="text-[10.5px] font-sans text-neutral-400 mt-2 leading-normal">
                  No automated alerts have been generated. Click the threat scan button above to activate real-time system vision detection.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1" id="alerts-card-list">
                {aiAlertsList.map((alert) => {
                  const isResolved = alert.status === 'Resolved';
                  const isCritical = alert.severity === 'Critical' || alert.severity === 'High';
                  const { confidence, recommendedTeam, cleanDesc } = parseAlertMeta(alert);

                  return (
                    <div 
                      key={alert.id} 
                      className={`p-4 rounded-xl border-t-2 border-l-4 transition-all relative overflow-hidden flex flex-col justify-between ${
                        isResolved 
                          ? 'bg-emerald-50/40 border-t-emerald-200 border-l-emerald-600 border border-neutral-100' 
                          : isCritical
                          ? 'bg-red-50/60 border-t-red-200 border-l-red-650 border border-red-100 shadow-sm shadow-red-100/50 animate-in fade-in slide-in-from-top-1'
                          : 'bg-orange-50/50 border-t-orange-200 border-l-orange-500 border border-orange-100'
                      }`}
                    >
                      {/* Top label / Title badge requested */}
                      <div className="flex items-center justify-between gap-1.5 text-[9px] font-mono border-b border-dashed border-red-200/20 pb-1 mb-2">
                        <span className="font-black text-red-650 tracking-wider flex items-center gap-1 animate-pulse">
                          <span>🚨 ALERT</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-normal text-muted-foreground">ID: {alert.id}</span>
                          <span className={`px-1.5 rounded text-[8px] font-bold uppercase ${
                            isResolved 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : alert.severity === 'Critical'
                              ? 'bg-red-200 text-red-800'
                              : 'bg-orange-200 text-orange-850'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                      </div>

                      {/* Body contents with exact fields requested */}
                      <div className="space-y-1 font-sans text-left">
                        {/* Type Row */}
                        <div className="flex items-start text-xs">
                          <span className="text-[#a04000] font-bold w-24 shrink-0">Type:</span>
                          <span className="text-[#541d17] font-extrabold">{alert.category}</span>
                        </div>

                        {/* Location Row */}
                        <div className="flex items-start text-xs">
                          <span className="text-[#a04000] font-bold w-24 shrink-0">Location:</span>
                          <span className="text-stone-700 font-medium">{alert.location}</span>
                        </div>

                        {/* Priority Row */}
                        <div className="flex items-start text-xs">
                          <span className="text-[#a04000] font-bold w-24 shrink-0">Priority:</span>
                          <span className="text-stone-700 font-semibold">{alert.severity}</span>
                        </div>

                        {/* Confidence Row */}
                        <div className="flex items-start text-xs">
                          <span className="text-[#a04000] font-bold w-24 shrink-0">Confidence:</span>
                          <span className="text-red-700 font-extrabold font-mono">{confidence}%</span>
                        </div>

                        {/* Recommended Team Row */}
                        <div className="flex items-start text-xs">
                          <span className="text-[#a04000] font-bold w-24 shrink-0">Recommended Team:</span>
                          <span className="text-amber-800 font-bold">{recommendedTeam}</span>
                        </div>

                        {/* Status Row */}
                        <div className="flex items-start text-xs">
                          <span className="text-[#a04000] font-bold w-24 shrink-0">Status:</span>
                          <span className={`font-extrabold rounded-md px-1.5 py-0.5 text-[10px] leading-none ${
                            isResolved 
                              ? 'bg-emerald-100 text-emerald-800 text-xs' 
                              : 'bg-amber-100 text-amber-805 animate-pulse'
                          }`}>
                            {isResolved ? 'Resolved' : 'Pending Response'}
                          </span>
                        </div>

                        {/* Detailed Description */}
                        <div className="mt-2 text-[11px] text-stone-500 italic bg-white/60 p-2 rounded-lg border border-dashed border-[#eddcc1]/30">
                          {cleanDesc}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3.5 pt-2 border-t border-neutral-100/50 flex items-center justify-between gap-2.5 text-xs font-semibold">
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {isResolved ? '🟢 Resolved' : '🔴 Action Required'}
                        </span>

                        {!isResolved && onLocateOnMap && (
                          <button
                            type="button"
                            onClick={() => onLocateOnMap(alert.id)}
                            className="px-3 py-1.5 bg-[#541d17] hover:bg-[#a04000] text-white rounded-lg text-[10px] font-extrabold tracking-wide transition-all cursor-pointer flex items-center gap-1 border border-[#541d17] shrink-0 hover:scale-103"
                          >
                            <span>📍 Locate</span>
                            <ArrowRight className="w-2.5 h-2.5 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
