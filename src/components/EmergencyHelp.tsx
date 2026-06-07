import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  HelpCircle, 
  Clock, 
  AlertTriangle,
  Locate,
  CheckCircle2,
  Send,
  Sparkles,
  AlertOctagon,
  Wrench,
  LifeBuoy,
  Camera,
  Mic,
  Volume2,
  Trash2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Incident } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface EmergencyHelpProps {
  onAddIncident: (incident: {
    category: Incident['category'];
    location: string;
    description: string;
    reporterName: string;
    reporterPhone: string;
    severity: Incident['severity'];
    originalLanguage?: string;
    englishTranslation?: string;
    hindiTranslation?: string;
    latitude?: string;
    longitude?: string;
    imageContent?: string;
    imageName?: string;
  }) => void;
  incidents: Incident[];
  language?: 'en' | 'hi';
}

const REGIONAL_SPEECH_EXAMPLES = [
  {
    langName: "Tamil (தமிழ்)",
    speech: "ராம் காட் பகுதியில் எனது குழந்தை கூட்டத்திற்குள் தொலைந்துவிட்டான், மஞ்சள் நிற சட்டை அணிந்துள்ளான், தயవుசெய்து தேடித் தரவும்.",
    english: "My child is lost in the heavy crowds near Ram Ghat Platform 2. He is wearing a yellow shirt, please help find him immediately.",
    hindi: "राम घाट क्षेत्र में मेरा बच्चा भारी भीड़ में खो गया है। उसने पीले रंग की कमीज पहनी है, कृपया उसे ढूंढने में शीघ्र मदद करें।",
    category: "Lost Person" as Incident['category'],
    severity: "High" as Incident['severity'],
    crew: "Ujjain Vol. Patrol Platoon 6",
    action: "Broadcast on Akhara speakers, scan regional drone logs, inspect Ram Ghat coordinates.",
    time: "3-5 mins",
    priority: "High"
  },
  {
    langName: "Marathi (मराठी)",
    speech: "शिप्रा घाटाजवळ एका वयोवृद्ध श्रद्धालुओंना चक्कर येऊन खाली पडले आहेत. त्यांना प्रचंड धाप लागते आहे, त्वरित रुग्णवाहिका पाठवा.",
    english: "An elderly pilgrim has fainted near the Shipra River bank. They are experiencing severe breathing difficulties, dispatch ambulance right away.",
    hindi: "शिप्रा नदी घाट के पास एक बुजुर्ग श्रद्धालु चक्कर खाकर गिर गए हैं। उन्हें सांस लेने में गंभीर तकलीफ है, कृपया तुरंत एम्बुलेंस भेजें।",
    category: "Medical Emergency" as Incident['category'],
    severity: "Critical" as Incident['severity'],
    crew: "Red Cross Mobile Trauma Platoon 3",
    action: "Route critical life support ambulance PL-3 with oxygen cylinders, notify Apex Corridor Unit.",
    time: "2 mins",
    priority: "Critical"
  },
  {
    langName: "Bengali (বাংলা)",
    speech: "পন্টুন ব্রিজ নং ৩ এর কোনায় সুজি কাঠ ও পুরানো চটের বস্তায় আগুন লেগে ধূয়া বেরোচ্ছে, খুব দ্রুত ব্যবস্থা নিন।",
    english: "Smoke and minor fire breaking out from dry wood bags on Shipra Pontoon Bridge 3, send immediate suppression unit.",
    hindi: "शिप्रा पांटून ब्रिज ३ के कोने पर रखी सूखी लकड़ियों के ढेर में आग लग गई है, कृपया तुरंत दमकल भेजें।",
    category: "Fire Hazard" as Incident['category'],
    severity: "Critical" as Incident['severity'],
    crew: "SDRF Water-Rescue Fire Platoon 9",
    action: "Deploy nearby fire boat, alert local hydration team, coordinate crowd detour from platform.",
    time: "2-3 mins",
    priority: "Critical"
  },
  {
    langName: "Telugu (తెలుగు)",
    speech: "నది వద్ద ఇనుప బారికేడ్ దాటి ప్రజలు స్నానం చేస్తున్నారు. ప్రవాహం మరియు లోతు ఎక్కువగా ఉంది, దయచేసి రక్షించండి.",
    english: "Pilgrims are bathing past the safe iron chain chain-link barricades. The Shipra water current is dangerously high, sirens required.",
    hindi: "श्रद्धालु नदी में बने लोहे के बेरिकेड को लांघकर गहरे पानी में स्नान कर रहे हैं। शिप्रा का बहाव बहुत तेज है, तुरंत गश्ती टीम भेजें।",
    category: "Water Rescue" as Incident['category'],
    severity: "High" as Incident['severity'],
    crew: "SDRF Shipra River Swimmers",
    action: "Sound boat siren alarm, deploy motorized water rescue crews to push bathers back behind metallic chain.",
    time: "1-4 mins",
    priority: "High"
  }
];

export default function EmergencyHelp({ onAddIncident, incidents, language = 'en' }: EmergencyHelpProps) {
  const t = TRANSLATIONS[language];
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [sosSent, setSosSent] = useState(false);

  // Form states
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [location, setLocation] = useState('Ram Ghat, Sector 2');
  const [category, setCategory] = useState<Incident['category']>('Medical Emergency');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Incident['severity']>('High');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Audio simulation states
  const [isListening, setIsListening] = useState(false);
  const [voiceLog, setVoiceLog] = useState<typeof REGIONAL_SPEECH_EXAMPLES[0] | null>(null);

  // Real voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recorderTime, setRecorderTime] = useState(0);
  const [mediaRecorderRef, setMediaRecorderRef] = useState<MediaRecorder | null>(null);
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Evidence capture / attachment states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string>('');
  const [isCapturing, setIsCapturing] = useState(false);

  // GPS geolocation states
  const [lat, setLat] = useState("23.1831° N");
  const [lng, setLng] = useState("75.7676° E");
  const [gpsStatus, setGpsStatus] = useState<string>('Static Coordinates Active');
  const [isLocating, setIsLocating] = useState(false);

  // AI predicted priority stats
  const [aiPriorities, setAiPriorities] = useState({
    priority: 'High',
    crew: 'Sector 2 Medical Camp',
    action: 'Triage patient, check vital parameters, administer rehydration salts.',
    time: '4 mins'
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (sosActive && countdown === 0) {
      setSosActive(false);
      setSosSent(true);

      onAddIncident({
        category: 'Water Rescue',
        location: 'Ram Ghat Platforms, Shipra River',
        description: 'ONE-TAP SOS BROADCASTER ACTIVATED - Immediate physical coordinate distress signal pinged.',
        reporterName: 'Self (Pilgrim Broadcaster)',
        reporterPhone: '+91 94251 00234',
        severity: 'Critical',
        originalLanguage: language,
        englishTranslation: 'ONE-TAP SOS BROADCASTER ACTIVATED - Immediate physical coordinate distress signal pinged.',
        hindiTranslation: 'वन-टैप एसओएस ब्रॉडकास्टर एक्टिवेटेड - तत्काल शारीरिक समन्वय संकट संकेत पिंग किया गया।',
        latitude: lat,
        longitude: lng
      });
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown]);

  // Dynamically update predicted AI Prioritization metrics as user changes category, description or severity
  useEffect(() => {
    let crew = 'Sector 2 General Police';
    let action = 'Observe crowds, coordinate walkie-talkier alerts, monitor checkpoint gates.';
    let time = '5 mins';
    let priority = 'Medium';

    if (category === 'Medical Emergency') {
      crew = 'Red Cross Corps Unit PL-1';
      action = 'Administer medical treatment, deploy mobile stretcher, alert Corridor Apex Ward.';
      time = '3 mins';
      priority = severity === 'Critical' ? 'Critical' : 'High';
    } else if (category === 'Water Rescue') {
      crew = 'SDRF River Swimmers Platoon 4';
      action = 'Launch rescue boat, prepare floatation tubes, secure safety chain lines.';
      time = '2 mins';
      priority = 'Critical';
    } else if (category === 'Fire Hazard') {
      crew = 'Ujjain Central Fire Engine Platoon 9';
      action = 'Deploy dry chemical extinguishers, route mini water tender through bridge bypass.';
      time = '3 mins';
      priority = 'Critical';
    } else if (category === 'Lost Person') {
      crew = 'Simhastha Call Center & Dutt Akhara Volunteers';
      action = 'Broadcast descriptions on integrated public speakers, log description into central registry.';
      time = '6 mins';
      priority = 'Medium';
    } else if (category === 'Security Threat') {
      crew = 'Kumbh Rapid Action Force Battalion 2';
      action = 'Isolate sector gate, deploy secure perimeter guard, alert central command desk.';
      time = '3 mins';
      priority = 'Critical';
    } else if (category === 'Crowd Congestion') {
      crew = 'Police Barricade Platoon 7';
      action = 'Apply directional detours at exits, monitor CCTV density meters, hold entry lanes.';
      time = '4 mins';
      priority = 'High';
    }

    setAiPriorities({
      priority: severity === 'Critical' ? 'Critical' : (severity === 'High' ? 'High' : 'Medium'),
      crew,
      action,
      time
    });
  }, [category, severity, description]);

  const handleTriggerSOS = () => {
    setSosActive(true);
    setCountdown(5);
    setSosSent(false);
  };

  const handleCancelSOS = () => {
    setSosActive(false);
  };

  const handleLiveGPSLocate = () => {
    setIsLocating(true);
    setGpsStatus('Synchronizing satellite telemetry...');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(`${position.coords.latitude.toFixed(6)}° N`);
          setLng(`${position.coords.longitude.toFixed(6)}° E`);
          setIsLocating(false);
          setGpsStatus('✓ Live GPS Lock Secured');
          // Update location input
          setLocation('Ram Ghat Platform, Ujjain (GPS Verified)');
        },
        (error) => {
          // Graceful fallback coordinate simulations
          setTimeout(() => {
            setLat("23.183042° N");
            setLng("75.767576° E");
            setIsLocating(false);
            setGpsStatus('✓ Mock Sentinel GPS Lock (Sandbox)');
            setLocation('Ram Ghat Platform 3, Ujjain');
          }, 800);
        }
      );
    } else {
      setGpsStatus('GPS hardware missing. Manual input active.');
      setIsLocating(false);
    }
  };

  // Real-time voice recording effect for timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecorderTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecorderTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = async () => {
    setVoiceError(null);
    setVoiceLog(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use standard MediaRecorder, let standard select container dynamically based on browser capability
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        setVoiceProcessing(true);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            const res = await fetch('/api/gemini/voice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audio: base64Audio, mimeType: 'audio/webm' })
            });
            if (!res.ok) throw new Error('Failed to process recorded voice. Server returned status: ' + res.status);
            const data = await res.json();

            // Auto fill fields
            if (data.category) setCategory(data.category);
            if (data.description) setDescription(data.description);
            if (data.name && data.name !== 'Guest Pilgrim') setReporterName(data.name);
            if (data.phone) setReporterPhone(data.phone);
            if (data.severity) setSeverity(data.severity);

            setVoiceLog({
              langName: data.detected_language || 'Detected language',
              speech: data.transcription || 'Spoken statement captured',
              english: data.english_translation || data.description || '',
              hindi: data.hindi_translation || '',
              category: data.category || 'Medical Emergency',
              severity: data.severity || 'High',
              crew: data.important_details || 'Sector Security Platoon',
              action: data.english_translation || data.description || '',
              time: '3 mins',
              priority: data.severity || 'High'
            });
          } catch (err: any) {
            console.error('Speech analysis error:', err);
            setVoiceError(err.message || 'Error occurred during AI speech transcription and analysis.');
          } finally {
            setVoiceProcessing(false);
          }
        };

        // Turn off stream tracks to disable recording indicator tab
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorderRef(recorder);
      setIsRecording(true);
    } catch (err: any) {
      console.error('Mic access denied:', err);
      setVoiceError('Standard microphone permission denied or microphone hardware missing.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef && isRecording) {
      mediaRecorderRef.stop();
    }
  };

  // Simulating the high technology AI voice transcription
  const handleSimulateVoiceInput = (example: typeof REGIONAL_SPEECH_EXAMPLES[0]) => {
    setIsListening(true);
    setVoiceLog(null);
    
    setTimeout(() => {
      setIsListening(false);
      setVoiceLog(example);
      
      // Auto-fill form values instantly!
      setCategory(example.category);
      setDescription(language === 'hi' ? example.hindi : example.english);
      setSeverity(example.severity);
      if (!reporterName) setReporterName("Pilgrim (Voice Broadcaster)");
      if (!reporterPhone) setReporterPhone("+91 94000 88234");
    }, 1800);
  };

  // Capture static image from pre-sets or camera simulation
  const handleSimulateCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      // Generate standard incident mock photos
      const mockPics = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", 
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150"
      ];
      setAttachedImage(mockPics[Math.floor(Math.random() * mockPics.length)]);
      setAttachedImageName("Simhastha_Evidence_RAW2028.jpg");
    }, 800);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !reporterName.trim() || !reporterPhone.trim()) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      onAddIncident({
        category,
        location,
        description: description,
        reporterName,
        reporterPhone,
        severity,
        originalLanguage: language,
        englishTranslation: voiceLog ? voiceLog.english : description,
        hindiTranslation: voiceLog ? voiceLog.hindi : (language === 'hi' ? description : ''),
        latitude: lat,
        longitude: lng,
        imageContent: attachedImage || undefined,
        imageName: attachedImageName || undefined
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setDescription('');
      setAttachedImage(null);
      setVoiceLog(null);
      
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1200);
  };

  const helplines = [
    { name: "Simhastha Police Emergency Station", num: "112", subtitle: "24/7 Pilgrim safety desk" },
    { name: "Mahakaleshwar Corridor Health Unit", num: "108", subtitle: "Emergency medical triage Desk" },
    { name: "Shipra Water Rescue SDRF Cell", num: "+91 734 251 1234", subtitle: "Trained boat patrols & divers" },
    { name: "Central Fire Response & Hazards Group", num: "101", subtitle: "Safety control unit" }
  ];

  return (
    <div className="flex-1 min-h-screen px-10 py-12 overflow-y-auto bg-gradient-to-tr from-[#fffaf7] to-[#f9ebe0] font-sans" id="emergency-workspace">
      
      {/* Decorative Title */}
      <div className="mb-8" id="emergency-title-sec">
        <div className="flex items-center gap-2 mb-2" id="header-context-title">
          <span className="text-[10px] font-mono uppercase bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full font-bold">
            {t.interactiveDesk}
          </span>
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
          <span className="text-xs font-sans text-red-600 font-semibold">{t.gpsSentinel}</span>
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#541d17] flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-600 animate-pulse" />
          <span>{t.emergencyHeading}</span>
        </h2>
        <p className="text-sm font-sans text-[#8e746a] mt-2">
          {t.emergencyIntro}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="emergency-panels-grid">
        
        {/* Left Column: SOS Trigger & Location Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6" id="critical-dispatch-panel">
          
          {/* Glassmorphic SOS Trigger Card */}
          <div className="glass-panel p-6 rounded-3xl border border-red-200/50 shadow-md flex flex-col items-center text-center relative overflow-hidden" id="sos-container">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
            
            <h3 className="font-sans font-bold text-[#541d17] text-lg mb-2">
              {t.sosBroadcaster}
            </h3>
            
            <p className="text-xs text-[#8e746a] max-w-xs mb-6 font-sans">
              {t.sosDesc}
            </p>

            {!sosActive && !sosSent && (
              <button 
                id="sos-button-start"
                onClick={handleTriggerSOS}
                className="w-36 h-36 rounded-full bg-gradient-to-tr from-red-600 to-red-500 text-white flex flex-col items-center justify-center font-serif text-2xl font-bold shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer group border-4 border-red-100"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white animate-pulse" />
                </div>
                <span>SOS</span>
              </button>
            )}

            {sosActive && (
              <div className="flex flex-col items-center py-4" id="sos-countdown-ring">
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-red-500 animate-spin flex items-center justify-center relative">
                  <span className="font-serif text-5xl font-extrabold text-red-600 absolute animate-pulse">
                    {countdown}
                  </span>
                </div>
                <p className="text-sm font-semibold text-red-700 mt-4 animate-bounce">
                  {t.broadcastingSec.replace('{time}', countdown.toString())}
                </p>
                <button
                  id="sos-button-cancel"
                  onClick={handleCancelSOS}
                  className="mt-4 px-6 py-2 rounded-full bg-[#541d17] text-white text-xs font-semibold tracking-wider hover:bg-[#a04000] cursor-pointer transition-colors uppercase"
                >
                  {t.cancelBroadcast}
                </button>
              </div>
            )}

            {sosSent && (
              <div className="flex flex-col items-center py-4" id="sos-complete-badge">
                <div className="w-32 h-32 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 animate-bounce" />
                </div>
                <p className="text-sm font-bold text-emerald-800 mt-4">
                  {t.signalSent}
                </p>
                <p className="text-[10px] text-emerald-600 mt-1 max-w-xs font-mono text-center">
                  {t.assignPlatoon}
                </p>
                <button
                  id="sos-button-reset"
                  onClick={() => setSosSent(false)}
                  className="mt-5 px-5 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 cursor-pointer transition-colors"
                >
                  {t.sendNewUpdate}
                </button>
              </div>
            )}
          </div>

          {/* Secure Live Location coordinates telemetry card (Requirement 5) */}
          <div className="glass-panel p-6 rounded-2xl border border-[#eddcc1]/40 shadow-sm space-y-4" id="live-location-card">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-[#541d17] text-sm flex items-center gap-2">
                <Locate className="w-4 h-4 text-[#e67e22] animate-pulse" />
                <span>{t.gpsPosition}</span>
              </h3>
              <button
                type="button"
                onClick={handleLiveGPSLocate}
                disabled={isLocating}
                className="px-3 py-1 text-[10px] font-bold text-white bg-[#541d17] hover:bg-[#e67e22] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                id="btn-live-gps-trigger"
              >
                {isLocating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                <span>{language === 'hi' ? 'लाइव जीपीएस स्थिति दर्ज करें' : 'Locate Me Live'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4" id="location-values">
              <div className="p-2.5 bg-white rounded-xl border border-orange-100 flex flex-col">
                <span className="text-[9px] font-mono text-[#a04000] block uppercase tracking-wide mb-0.5">{t.latitude}</span>
                <input 
                  type="text" 
                  value={lat} 
                  onChange={(e) => setLat(e.target.value)} 
                  className="w-full bg-transparent border-none text-xs font-sans font-bold text-[#541d17] focus:outline-none p-0 focus:ring-0" 
                  placeholder="23.1831° N"
                />
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-orange-100 flex flex-col">
                <span className="text-[9px] font-mono text-[#a04000] block uppercase tracking-wide mb-0.5">{t.longitude}</span>
                <input 
                  type="text" 
                  value={lng} 
                  onChange={(e) => setLng(e.target.value)} 
                  className="w-full bg-transparent border-none text-xs font-sans font-bold text-[#541d17] focus:outline-none p-0 focus:ring-0" 
                  placeholder="75.7676° E"
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3.5 bg-yellow-50/60 rounded-xl border border-yellow-100/50" id="sector-info">
              <MapPin className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-yellow-800 font-bold block uppercase tracking-wider">{t.sectorDesk}</span>
                <span className="text-xs font-sans text-neutral-800 font-semibold">{location}</span>
                <span className="text-[9px] block text-orange-700 font-bold font-mono mt-0.5">{gpsStatus}</span>
              </div>
            </div>
          </div>

          {/* Connected Pilgrim Live Status Tracker */}
          <div className="glass-panel p-5 rounded-2xl border border-[#eddcc1]/30 bg-white/20 space-y-3" id="pilgrim-tracker-box">
            <h3 className="font-sans font-bold text-[#541d17] text-xs uppercase tracking-wide flex items-center justify-between">
              <span>{t.myDispatches}</span>
              <span className="w-2 h-2 rounded-full bg-[#e67e22] animate-ping" />
            </h3>
            <div className="space-y-2.5 max-h-48 overflow-y-auto" id="my-reports-mini-list">
              {incidents.filter(inc => inc.reporterName.includes('Self') || inc.reporterPhone === reporterPhone || inc.reporterName === reporterName).length === 0 ? (
                <p className="text-[11px] text-neutral-500 font-sans italic py-2 text-center">
                  {t.noActiveReports}
                </p>
              ) : (
                incidents
                  .filter(inc => inc.reporterName.includes('Self') || inc.reporterPhone === reporterPhone || inc.reporterName === reporterName)
                  .map(inc => (
                    <div key={inc.id} className="p-3 bg-white/70 rounded-xl border border-[#eddcc1]/20 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#541d17] text-[11px] truncate max-w-[60%]">{inc.category}</span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                          inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-[#e67e22] animate-pulse'
                        }`}>
                          {inc.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 truncate mt-0.5">"{inc.description}"</p>
                      {inc.assignedTeam && (
                        <p className="text-[9px] text-[#a04000] font-mono font-bold uppercase mt-1">
                          ↳ Unit Deployed: {inc.assignedTeam}
                        </p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Multilingual Voice Triage & Interactive Report Form */}
        <div className="lg:col-span-7 space-y-6" id="official-resources-panel">
          
          {/* Multilingual Voice reporting helper (Requirement 3) */}
          <div className="glass-panel p-6 rounded-3xl border border-orange-200/40 bg-gradient-to-tr from-amber-50/30 to-white relative" id="multilingual-voice-desk">
            <h3 className="font-serif text-sm font-bold text-[#541d17] uppercase tracking-wider flex items-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-[#e67e22] animate-pulse" />
              <span>🎙 {language === 'hi' ? 'बहुभाषी एआई आवाज रिपोर्टिंग' : 'AI Voice-Based Incident Reporting'}</span>
            </h3>
            <p className="text-xs text-[#8e746a] font-sans leading-relaxed mb-4">
              {language === 'hi' 
                ? "श्रद्धालु अपनी सुविधानुसार किसी भी भाषा/बोली में बोल सकते हैं। कुंभ-एआई रिकॉर्ड होकर भाषा विश्लेषण स्वतः विवरण प्रस्तुत करेगा:" 
                : "Pilgrims can speak statements in their native dialect. Select any regional preset or tap 'Record Statement' to capture audio live via Gemini!"}
            </p>

            {/* Presets Grid */}
            <div className="mb-4">
              <span className="text-[9px] font-mono font-bold text-neutral-400 block uppercase mb-1.5">{language === 'hi' ? 'आवाज सिम्युलेटर प्रीसेट' : 'Regional Dialect Presets (Simulator)'}</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="speech-triggers">
                {REGIONAL_SPEECH_EXAMPLES.map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSimulateVoiceInput(ex)}
                    className="bg-white hover:bg-orange-50 border border-[#eddcc1]/40 hover:border-[#e67e22]/50 rounded-xl p-2.5 text-center text-[10px] font-semibold text-[#541d17] transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                  >
                    🎧 {ex.langName}
                  </button>
                ))}
              </div>
            </div>

            {/* Real Microphone Recording Area */}
            <div className="p-4 bg-orange-50/30 border border-dashed border-[#e67e22]/20 rounded-2xl flex flex-col items-center justify-center space-y-3 mb-4">
              <span className="text-[10px] font-mono font-bold text-[#a04000] uppercase tracking-wider">🎙 {language === 'hi' ? 'लाइव रिकॉर्डिंग स्टेशन' : 'Live Statement Recording'}</span>
              
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    disabled={voiceProcessing}
                    onClick={handleStartRecording}
                    className="px-5 py-2.5 rounded-full bg-[#541d17] hover:bg-[#e67e22] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer select-none disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4 text-orange-400 animate-pulse" />
                    <span>{language === 'hi' ? 'बोलना शुरू करें' : 'Record Native Statement'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md animate-pulse cursor-pointer select-none"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-scale inline-block mr-0.5" />
                    <span>{language === 'hi' ? `रिकॉर्डिंग रोकें (${recorderTime}s)` : `Stop & Process (${recorderTime}s)`}</span>
                  </button>
                )}
              </div>

              {/* Recording visual feed status */}
              {isRecording && (
                <div className="flex gap-1 items-center justify-center py-2 animate-pulse">
                  <span className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 h-6 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 h-4 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              )}

              {voiceProcessing && (
                <div className="flex flex-col items-center justify-center space-y-1.5 text-neutral-600 animate-pulse">
                  <RefreshCw className="w-5 h-5 text-[#e67e22] animate-spin" />
                  <span className="text-[10px] font-mono font-bold uppercase text-[#a04000]">{language === 'hi' ? 'एआई आवाज का विश्लेषण कर रहा है...' : 'Gemini AI parsing dialects & extracting variables...'}</span>
                </div>
              )}

              {voiceError && (
                <div className="p-2 py-1.5 bg-red-50 border border-red-100 rounded-lg text-[10px] text-red-600 font-medium text-center">
                  ⚠️ {voiceError}
                </div>
              )}
            </div>

            {isListening && (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/50 flex flex-col items-center justify-center space-y-2 animate-pulse" id="voice-listening-effect">
                <div className="flex gap-1 items-center justify-center">
                  <span className="w-1.5 h-6 bg-[#e67e22] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-10 bg-[#541d17] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-7 bg-[#e67e22] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1.5 h-4 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-xs text-[#a04000] font-mono font-bold uppercase tracking-wider animate-pulse">Kumbh-AI listening & detecting dialect...</span>
              </div>
            )}

            {voiceLog && !isListening && (
              <div className="p-4 rounded-2xl bg-white border border-[#eddcc1]/40 space-y-4 shadow-sm animate-in fade-in zoom-in duration-300" id="voice-simulation-result">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-[#e67e22] bg-orange-50 px-2 py-0.5 rounded-full">
                    Detected Dialect: {voiceLog.langName}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Speech Transcribed & Auto-filled ✓</span>
                </div>

                <div className="space-y-2.5 text-[11px] leading-relaxed">
                  <div>
                    <span className="font-bold text-neutral-500 block uppercase font-mono text-[9px] tracking-wider">Original Pilgrim Speech:</span>
                    <p className="text-neutral-800 bg-[#541d17]/5 p-2 rounded-xl italic font-semibold font-sans">"{voiceLog.speech}"</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/30">
                      <span className="font-bold text-[#2b6cb0] block uppercase font-mono text-[9px]" id="span-eng-title">English Translation:</span>
                      <p className="text-[#2b6cb0] font-medium leading-normal">"{voiceLog.english}"</p>
                    </div>
                    <div className="p-2.5 bg-orange-50/40 rounded-xl border border-orange-100/40">
                      <span className="font-bold text-orange-850 block uppercase font-mono text-[9px]">हिन्दी अनुवाद (Hindi Translation):</span>
                      <p className="text-[#a04000] font-bold leading-normal font-hindi">"{voiceLog.hindi}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Incident Prioritization Analytics (Requirement 6) */}
          <div className="glass-panel p-5 rounded-3xl border border-purple-200/40 bg-[#faf5ff] relative overflow-hidden" id="ai-prioritization-desk">
            <div className="absolute top-0 right-0 p-2 bg-purple-100 text-purple-700 text-[10px] font-mono font-bold rounded-bl-xl flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
              <span>KUMBH-AI Real-Time Triage</span>
            </div>
            
            <h3 className="font-serif text-sm font-bold text-[#541d17] uppercase tracking-wider flex items-center gap-2 mb-3">
              <AlertOctagon className="w-4 h-4 text-purple-600 animate-bounce" />
              <span>🤖 AI Incident Prioritization Analytics</span>
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-3" id="ai-metrics-grid">
              <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-sm flex flex-col justify-between">
                <span className="text-[9px] font-mono text-purple-600 uppercase font-black block">Safety Priority</span>
                <span className={`text-sm font-sans font-extrabold flex items-center gap-1.5 mt-1 ${
                  aiPriorities.priority === 'Critical' ? 'text-red-650' : aiPriorities.priority === 'High' ? 'text-orange-600' : 'text-yellow-600'
                }`}>
                  {aiPriorities.priority === 'Critical' ? '🔴 Critical' : (aiPriorities.priority === 'High' ? '🟠 High' : '🟡 Medium')}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-sm flex flex-col justify-between col-span-2">
                <span className="text-[9px] font-mono text-purple-600 uppercase font-black block">Recommended Crew</span>
                <span className="text-xs font-sans font-bold text-[#541d17] mt-1 truncate">{aiPriorities.crew}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-sm space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>RESCUE PROTOCOL ACTION Plan:</span>
                <span className="text-purple-600 font-bold">Est. Dispatch: {aiPriorities.time}</span>
              </div>
              <p className="text-[#541d17] leading-relaxed font-semibold">{aiPriorities.action}</p>
            </div>
          </div>

          {/* Incident Report Form */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/40 shadow-sm" id="submit-report-card">
            <h3 className="font-serif text-lg font-bold text-[#541d17] flex items-center gap-2 border-b border-[#eddcc1]/20 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-[#e67e22] animate-pulse" />
              <span>{t.smartBroadcaster}</span>
            </h3>

            <p className="text-xs text-[#8e746a] font-sans leading-relaxed mb-4">
              {t.broadcasterIntro}
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-4" id="incident-submission-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-metadata-grid">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.yourName}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Mishra"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.yourPhone}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +91 94251 01223"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="form-category-grid">
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.reportedCategory}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Incident['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white cursor-pointer select-none"
                  >
                    <option value="Medical Emergency">🚑 Medical Emergency</option>
                    <option value="Crowd Congestion">👮 Crowd Congestion</option>
                    <option value="Lost Person">🔍 Lost Person</option>
                    <option value="Security Threat">🛡 Security Threat</option>
                    <option value="Fire Hazard">🔥 Fire Hazard</option>
                    <option value="Water Rescue">⛵ Water Rescue</option>
                    <option value="Infrastructure Issue">⚙ Infrastructure Issue</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.currentLocation}</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold mb-1">{t.reportDetails}</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.detailsPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#eddcc1]/60 focus:outline-none focus:border-[#e67e22] text-xs font-sans text-neutral-800 bg-[#ffffff]/60 focus:bg-white leading-relaxed resize-none font-medium"
                />
              </div>

              {/* Image Upload/Capture module (Requirement 4) */}
              <div className="p-4 bg-white/50 border border-dotted border-[#eddcc1] rounded-2xl space-y-3" id="evidence-attachment-module">
                <span className="text-[10px] font-mono tracking-wider text-neutral-500 uppercase block font-bold">📸 {language === 'hi' ? 'घटना साक्ष्य लगाव (स्मार्ट कैमरा)' : 'Incident Evidence Attachment'}</span>
                
                <div className="flex flex-wrap gap-2" id="evidence-actions">
                  <label className="px-4.5 py-2 rounded-xl bg-orange-100 hover:bg-orange-200 text-[#e67e22] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm select-none">
                    <Camera className="w-4 h-4" />
                    <span>{language === 'hi' ? 'गैलरी से अपलोड करें' : 'Upload Image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleSimulateCapture}
                    disabled={isCapturing}
                    className="px-4.5 py-2 rounded-xl bg-[#541d17] hover:bg-[#a04000] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 select-none"
                    id="btn-simulate-capture"
                  >
                    <Camera className="w-4 h-4 animate-pulse" />
                    <span>{isCapturing ? 'Lens Focus Active...' : (language === 'hi' ? 'कैमरा से फोटो खींचें' : 'Capture Live Photo')}</span>
                  </button>
                </div>

                {attachedImage && (
                  <div className="flex items-center gap-3 bg-neutral-50 p-2 rounded-xl border border-neutral-150 relative animate-in fade-in duration-200" id="attached-preview-pill">
                    <img src={attachedImage} alt="Attachment Preview" className="w-12 h-12 rounded-lg object-cover border border-neutral-200" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold font-sans text-[#541d17] block truncate">{attachedImageName}</span>
                      <span className="text-[10px] font-mono text-emerald-600 block">✓ Attached to dispatch report</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                      id="btn-remove-evidence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2" id="form-submission-actions">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">{t.assignedSeverity}</span>
                  <div className="flex gap-1" id="severity-selection-pill">
                    {(['Medium', 'High', 'Critical'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                          severity === sev 
                            ? sev === 'Critical' ? 'bg-red-500 border-red-600 text-white animate-pulse' : sev === 'High' ? 'bg-orange-500 border-orange-600 text-white' : 'bg-yellow-500 border-yellow-600 text-white'
                            : 'bg-white border-gray-200 text-gray-700'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#541d17] hover:bg-[#e67e22] disabled:bg-neutral-300 text-white font-sans text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md select-none shrink-0"
                  id="btn-submit-incident"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-dashed border-white animate-spin" />
                      <span>{t.btnRoutingActive}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.btnRouteLive}</span>
                    </>
                  )}
                </button>
              </div>

              {submitSuccess && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100/60 flex items-center gap-2 animate-bounce mt-3" id="success-submit-msg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold">
                    {t.reportSuccess}
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Helplines Directory */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/30 shadow-sm" id="helplines-card">
            <h3 className="font-sans font-bold text-[#541d17] text-base mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#e67e22]" />
              <span>{t.telecomCell}</span>
            </h3>
            
            <div className="divide-y divide-[#eddcc1]/30 space-y-3" id="helplines-directory">
              {helplines.map((hp, idx) => (
                <div key={idx} className="flex items-center justify-between pt-3 first:pt-0" id={`helpline-${idx}`}>
                  <div>
                    <h4 className="font-sans font-semibold text-sm text-[#541d17]">{hp.name}</h4>
                    <p className="text-[11px] text-[#8e746a] mt-0.5">{hp.subtitle}</p>
                  </div>
                  <a 
                    href={`tel:${hp.num.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#e67e22]/10 hover:bg-[#e67e22] text-[#e67e22] hover:text-white font-mono text-xs font-bold transition-all duration-300"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{hp.num}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Crowds safety guidelines */}
          <div className="glass-panel p-6 rounded-3xl border border-[#eddcc1]/30 shadow-sm" id="safety-guidelines-box">
            <h3 className="font-sans font-bold text-[#541d17] text-base mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              <span>{t.safetyGuardProtocols}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="safety-protocols-grid">
              <div className="p-4 bg-white/40 rounded-xl border border-[#eddcc1]/20" id="guard-protocol-1">
                <h4 className="font-sans font-bold text-[#541d17] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#e67e22]" />
                  <span>{t.bathingTimelineTitle}</span>
                </h4>
                <p className="text-xs text-[#8e746a] mt-1.5 leading-relaxed font-sans">
                  {t.bathingTimelineDesc}
                </p>
              </div>

              <div className="p-4 bg-white/40 rounded-xl border border-[#eddcc1]/25" id="guard-protocol-2">
                <h4 className="font-sans font-bold text-[#541d17] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.separationTitle}</span>
                </h4>
                <p className="text-xs text-[#8e746a] mt-1.5 leading-relaxed font-sans">
                  {t.separationDesc}
                </p>
              </div>

              <div className="p-4 bg-white/40 rounded-xl border border-[#eddcc1]/20" id="guard-protocol-3">
                <h4 className="font-sans font-bold text-[#541d17] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>{t.personalKitTitle}</span>
                </h4>
                <p className="text-xs text-[#8e746a] mt-1.5 leading-relaxed font-sans">
                  {t.personalKitDesc}
                </p>
              </div>

              <div className="p-4 bg-white/40 rounded-xl border border-[#eddcc1]/20" id="guard-protocol-4">
                <h4 className="font-sans font-bold text-[#541d17] text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.offlineGpsTitle}</span>
                </h4>
                <p className="text-xs text-[#8e746a] mt-1.5 leading-relaxed font-sans">
                  {t.offlineGpsDesc}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
