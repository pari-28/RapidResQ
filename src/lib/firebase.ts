import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  getDocFromServer,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { Incident } from '../types';

// Load values with env override options
const firebaseConfig = {
  apiKey: ((import.meta as any).env?.VITE_FIREBASE_API_KEY as string) || firebaseAppletConfig.apiKey,
  authDomain: ((import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN as string) || firebaseAppletConfig.authDomain,
  projectId: ((import.meta as any).env?.VITE_FIREBASE_PROJECT_ID as string) || firebaseAppletConfig.projectId,
  storageBucket: ((import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET as string) || firebaseAppletConfig.storageBucket,
  messagingSenderId: ((import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID as string) || firebaseAppletConfig.messagingSenderId,
  appId: ((import.meta as any).env?.VITE_FIREBASE_APP_ID as string) || firebaseAppletConfig.appId,
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseAppletConfig.firestoreDatabaseId || firebaseConfig.projectId);
export const storage = getStorage(app);

// Custom email/password sign-in and signOut methods exported directly for ease of use
export { signInWithEmailAndPassword, signOut };

// CRITICAL EXPORT: Operation types for audit
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Payload:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// MANDATORY VALIDATOR: Test connection with fallback diagnostics
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration. The client appears to be offline.");
    }
  }
}
testConnection();

// File / Media upload to Storage with secure error tracking
export async function uploadEvidencePhoto(filename: string, content: string | File): Promise<string> {
  const targetPath = `reports/evidence_${Date.now()}_${filename}`;
  const fileRef = ref(storage, targetPath);
  try {
    if (typeof content === 'string') {
      let cleanBase64 = content;
      if (content.indexOf(',') !== -1) {
        cleanBase64 = content.split(',')[1];
      }
      await uploadString(fileRef, cleanBase64, 'base64');
    } else {
      await uploadBytes(fileRef, content);
    }
    return await getDownloadURL(fileRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `storage:${targetPath}`);
  }
}

// Add interactive Firestore operation layer
export async function createFirestoreReport(report: Partial<Incident> & {
  originalLanguage?: string;
  englishTranslation?: string;
  hindiTranslation?: string;
  priority?: string;
  latitude?: string;
  longitude?: string;
  imageUrl?: string;
}) {
  const docId = report.id || `INC-${Math.floor(1000 + Math.random() * 9000)}`;
  const reportsPath = 'reports';
  
  const docData = {
    id: docId,
    category: report.category || 'Medical Emergency',
    description: report.description || '',
    reporterName: report.reporterName || 'Self',
    reporterPhone: report.reporterPhone || '',
    severity: report.severity || 'High',
    priority: report.priority || report.severity || 'High',
    status: report.status || 'Reported',
    timestamp: report.timestamp || new Date().toLocaleTimeString(),
    createdAt: Timestamp.now(),
    originalLanguage: report.originalLanguage || 'en',
    englishTranslation: report.englishTranslation || report.description || '',
    hindiTranslation: report.hindiTranslation || '',
    assignedTeam: report.assignedTeam || '',
    latitude: report.latitude || '23.1831° N',
    longitude: report.longitude || '75.7676° E',
    imageUrl: report.imageUrl || ''
  };

  try {
    // 1. Create main report
    await setDoc(doc(db, reportsPath, docId), docData);

    // 2. Cascade auxiliary cross-reference tables
    if (docData.category === 'Crowd Congestion' || docData.category === 'Security Threat' || docData.category === 'Lost Person') {
      await setDoc(doc(db, 'police_reports', `POL-${docId}`), {
        id: `POL-${docId}`,
        reportId: docId,
        syncedAt: Timestamp.now()
      });
    } else if (docData.category === 'Medical Emergency' || docData.category === 'Water Rescue') {
      await setDoc(doc(db, 'medical_reports', `MED-${docId}`), {
        id: `MED-${docId}`,
        reportId: docId,
        syncedAt: Timestamp.now()
      });
    } else if (docData.category === 'Fire Hazard' || docData.category === 'Infrastructure Issue') {
      await setDoc(doc(db, 'fire_reports', `FIRE-${docId}`), {
        id: `FIRE-${docId}`,
        reportId: docId,
        syncedAt: Timestamp.now()
      });
    }
    
    return docId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${reportsPath}/${docId}`);
  }
}

// Fetch all reports
export async function getFirestoreReports(): Promise<Incident[]> {
  const reportsPath = 'reports';
  try {
    const q = query(collection(db, reportsPath), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const rawLat = data.latitude || '';
      const rawLng = data.longitude || '';
      const formattedLocation = rawLat && rawLng
        ? (rawLat.includes('°') || /^\d/.test(rawLat) ? `${rawLat}, ${rawLng}` : rawLat)
        : (rawLat || 'Ram Ghat Platform, Ujjain');

      return {
        id: data.id,
        category: data.category,
        description: data.description,
        location: formattedLocation,
        reporterName: data.reporterName,
        reporterPhone: data.reporterPhone,
        severity: data.severity,
        status: data.status,
        timestamp: data.timestamp,
        assignedTeam: data.assignedTeam,
        aiAnalysisNotes: data.englishTranslation ? `Notes: ${data.englishTranslation}` : undefined
      } as Incident;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, reportsPath);
  }
}

// Update report status
export async function updateFirestoreReportStatus(id: string, status: Incident['status'], team?: string) {
  const reportsPath = 'reports';
  try {
    const reportRef = doc(db, reportsPath, id);
    const updateData: Record<string, any> = { status, updatedAt: Timestamp.now() };
    if (team) {
      updateData.assignedTeam = team;
      
      // Seed an assignment doc if requested
      const assignmentId = `ASG-${Date.now()}`;
      await setDoc(doc(db, 'assignments', assignmentId), {
        id: assignmentId,
        reportId: id,
        assignedTeam: team,
        assignedAt: Timestamp.now()
      });
    }
    await updateDoc(reportRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${reportsPath}/${id}`);
  }
}

// Listen to changing reports in realtime
export function listenToReports(callback: (incidents: Incident[]) => void) {
  const reportsPath = 'reports';
  const q = query(collection(db, reportsPath), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      const rawLat = data.latitude || '';
      const rawLng = data.longitude || '';
      const formattedLocation = rawLat && rawLng
        ? (rawLat.includes('°') || /^\d/.test(rawLat) ? `${rawLat}, ${rawLng}` : rawLat)
        : (rawLat || 'Ram Ghat Platform, Ujjain');

      return {
        id: data.id,
        category: data.category,
        description: data.description,
        location: formattedLocation,
        // Preserve actual fields from Firestore schema
        reporterName: data.reporterName,
        reporterPhone: data.reporterPhone,
        severity: data.severity,
        status: data.status,
        timestamp: data.timestamp,
        assignedTeam: data.assignedTeam,
        aiAnalysisNotes: data.englishTranslation ? `Kumbh-AI Translation: "${data.englishTranslation}"` : undefined
      } as any;
    });
    callback(reports);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, reportsPath);
  });
}
