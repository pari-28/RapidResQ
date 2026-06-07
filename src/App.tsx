import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActiveTab, Incident } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MahakumbhHero from './components/MahakumbhHero';
import EmergencyHelp from './components/EmergencyHelp';
import CommandCenter from './components/CommandCenter';
import LiveMap from './components/LiveMap';
import LostAndFound from './components/LostAndFound';
import MedicalAssistance from './components/MedicalAssistance';
import SafetyAlerts from './components/SafetyAlerts';
import Languages from './components/Languages';
import Settings from './components/Settings';
import FloatingChatbot from './components/FloatingChatbot';
import ReportsManagement from './components/ReportsManagement';
import CCTVMonitoringCenter from './components/CCTVMonitoringCenter';
import { 
  createFirestoreReport, 
  updateFirestoreReportStatus, 
  listenToReports, 
  uploadEvidencePhoto,
  auth
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Home);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Load live Firestore incidents database in realtime
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedIncidentIdForMap, setSelectedIncidentIdForMap] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = listenToReports((realtimeIncidents) => {
      setIncidents(realtimeIncidents);
    });
    return () => unsubscribe();
  }, []);

  // Handler to add a new pilgrim incident and save to Firebase
  const handleAddIncident = async (newInc: {
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
  }) => {
    let imageUrl = '';
    
    // First upload the evidence photo to Firebase Storage if present
    if (newInc.imageContent && newInc.imageName) {
      try {
        imageUrl = await uploadEvidencePhoto(newInc.imageName, newInc.imageContent);
      } catch (error) {
        console.error("Failed to upload evidence photo:", error);
      }
    }

    const docId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const englishText = newInc.englishTranslation || newInc.description;

    try {
      await createFirestoreReport({
        id: docId,
        category: newInc.category,
        description: newInc.description,
        reporterName: newInc.reporterName,
        reporterPhone: newInc.reporterPhone,
        severity: newInc.severity,
        status: 'Reported',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' today',
        originalLanguage: newInc.originalLanguage || 'en',
        englishTranslation: englishText,
        hindiTranslation: newInc.hindiTranslation || '',
        latitude: newInc.latitude || '23.1831° N',
        longitude: newInc.longitude || '75.7676° E',
        imageUrl: imageUrl,
        assignedTeam: ''
      });
    } catch (error) {
      console.error("Firestore report insertion failed:", error);
    }
  };

  // Handler to support CommandCenter status flow transitions in Firestore
  const handleUpdateIncidentStatus = async (id: string, status: Incident['status'], team?: string) => {
    try {
      await updateFirestoreReportStatus(id, status, team);
    } catch (error) {
      console.error("Firestore status development correction failed:", error);
    }
  };

  // Handler for resource deployments
  const handleDeployResource = (category: string, unitName: string) => {
    console.log(`Resource deployment requested: ${unitName} for ${category}`);
  };

  // Render the appropriate active panel based on selected activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case ActiveTab.Home:
        return (
          <MahakumbhHero 
            onNavigate={(tab) => setActiveTab(tab)} 
            language={language} 
            incidents={incidents}
            onViewOnMap={(id) => {
              setSelectedIncidentIdForMap(id);
              setActiveTab(ActiveTab.LiveMap);
            }}
          />
        );
      case ActiveTab.EmergencyHelp:
        return <EmergencyHelp onAddIncident={handleAddIncident} incidents={incidents} language={language} />;
      case ActiveTab.CommandCenter:
        return (
          <CommandCenter 
            incidents={incidents} 
            onUpdateIncidentStatus={handleUpdateIncidentStatus} 
            onDeployResource={handleDeployResource} 
            language={language}
            onViewOnMap={(id) => {
              setSelectedIncidentIdForMap(id);
              setActiveTab(ActiveTab.LiveMap);
            }}
          />
        );
      case ActiveTab.ReportsManagement:
        return (
          <ReportsManagement 
            incidents={incidents} 
            onUpdateIncidentStatus={handleUpdateIncidentStatus} 
            language={language}
            onViewOnMap={(id) => {
              setSelectedIncidentIdForMap(id);
              setActiveTab(ActiveTab.LiveMap);
            }}
          />
        );
      case ActiveTab.CCTV:
        return (
          <CCTVMonitoringCenter 
            incidents={incidents} 
            onAIPostReport={handleAddIncident} 
            language={language}
            onLocateOnMap={(id) => {
              setSelectedIncidentIdForMap(id);
              setActiveTab(ActiveTab.LiveMap);
            }}
          />
        );
      case ActiveTab.LiveMap:
        return (
          <LiveMap 
            incidents={incidents} 
            language={language} 
            selectedIncidentMapId={selectedIncidentIdForMap}
            setSelectedIncidentMapId={setSelectedIncidentIdForMap}
          />
        );
      case ActiveTab.LostAndFound:
        return <LostAndFound language={language} />;
      case ActiveTab.MedicalAssistance:
        return <MedicalAssistance language={language} />;
      case ActiveTab.SafetyAlerts:
        return <SafetyAlerts language={language} />;
      case ActiveTab.Languages:
        return <Languages language={language} setLanguage={setLanguage} />;
      case ActiveTab.Settings:
        return <Settings language={language} />;
      default:
        return (
          <MahakumbhHero 
            onNavigate={(tab) => setActiveTab(tab)} 
            language={language} 
            incidents={incidents}
            onViewOnMap={(id) => {
              setSelectedIncidentIdForMap(id);
              setActiveTab(ActiveTab.LiveMap);
            }}
          />
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf7f2] font-sans antialiased flex" id="app-parent-shell">
      
      {/* Fixed Left Rail Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />

      {/* Main Right Side Content Container */}
      <div className="flex-1 ml-80 min-h-screen flex flex-col justify-between" id="app-main-panel">
        
        {/* Top Header Selector and Global Bell Alert */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} language={language} setLanguage={setLanguage} />

        {/* Dynamic Inner Workspace rendering with fluid fade transitions */}
        <main className="flex-1 flex flex-col relative" id="active-content-workspace">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
              id={`tab-wrapper-${activeTab}`}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Humid, elegant global digital support footnote */}
        <footer className="w-full bg-[#faf7f2] border-t border-[#eddcc1]/25 py-4 px-10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-[#9a8578] select-none" id="global-system-footer">
          <p>© Simhastha Ujjain Authority 2028 • Unified Assistance &amp; Sentinel Platform</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0" id="official-authority-badges">
            <span className="hover:text-[#e67e22] transition-colors cursor-pointer">Security Code Encryption</span>
            <span>•</span>
            <span className="hover:text-[#e67e22] transition-colors cursor-pointer">Sovereign Data Storage Policy</span>
            <span>•</span>
            <span className="text-[#a04000] font-bold">Jai Shri Mahakal</span>
          </div>
        </footer>

      </div>
      
      {/* Dynamic Multi-lingual AI Assistant */}
      <FloatingChatbot language={language} onNavigate={(tab) => setActiveTab(tab as any)} />
    </div>
  );
}
