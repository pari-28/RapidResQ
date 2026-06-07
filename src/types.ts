export enum ActiveTab {
  Home = 'home',
  EmergencyHelp = 'emergency',
  LiveMap = 'map',
  LostAndFound = 'lost-found',
  MedicalAssistance = 'medical',
  SafetyAlerts = 'safety',
  Languages = 'languages',
  Settings = 'settings',
  CommandCenter = 'command',
  ReportsManagement = 'reports',
  CCTV = 'cctv'
}

export interface Incident {
  id: string;
  category: 'Medical Emergency' | 'Crowd Congestion' | 'Lost Person' | 'Security Threat' | 'Fire Hazard' | 'Water Rescue' | 'Infrastructure Issue';
  location: string;
  description: string;
  reporterName: string;
  reporterPhone: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  status: 'Reported' | 'AI Analyzing' | 'Routed' | 'Responders Dispatched' | 'Resolved';
  assignedTeam?: string;
  aiAnalysisNotes?: string;
  latitude?: string;
  longitude?: string;
  imageUrl?: string;
}

export interface LostItem {
  id: string;
  name: string;
  age?: number;
  lastSeenLocation: string;
  lastSeenTime: string;
  description: string;
  reporterName: string;
  reporterPhone: string;
  status: 'Lost' | 'Found' | 'Reunited';
  photoSeed: string;
}

export interface SafetyAlert {
  id: string;
  title: string;
  category: 'crowd' | 'weather' | 'bathing' | 'general';
  severity: 'low' | 'medium' | 'high';
  message: string;
  time: string;
}

export interface GhatStatus {
  id: string;
  name: string;
  crowdLevel: 'Low' | 'Moderate' | 'Heavy' | 'Full';
  bathingSuitability: 'Safe' | 'Caution' | 'Closed';
  waitingTimeMinutes: number;
}
