import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Allow larger payloads for base64 sound recording uploads
app.use(express.json({ limit: '50mb' }));

// Lazy initializer for Google GenAI client to preserve security and avoid startup failures if key is blank
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Gemini features will default to beautiful simulated behavior.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// 1. AI Voice-Based Incident Reporting Endpoint
app.post('/api/gemini/voice', async (req, res) => {
  const { audio, mimeType } = req.body;
  if (!audio) {
    return res.status(400).json({ error: 'Missing audio data' });
  }

  // Check if actual API key exists or fallback to realistic mockup if dummy key is present
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found, simulating multilingual AI voice transcription...");
    // Return a realistic simulation to ensure perfect UX even in sandboxes
    setTimeout(() => {
      return res.json({
        transcription: "हेल्प, शिप्रा पंटून ब्रिज ३ के पास आग लग गई है, सूखी लकड़ियों में आग है, मेरा नाम राम प्रसाद है और मेरा फोन नंबर ९८३७४६१२८९ है, जल्दी पानी और फायर ब्रिगेड भेजिए!",
        detected_language: "Hindi (हिन्दी)",
        name: "Ram Prasad",
        phone: "+91 9837461289",
        description: "Dry logs on Shipra Pontoon Bridge 3 have caught fire. Smoke is rising rapidly, creating panic among pilgrims.",
        category: "Fire Hazard",
        severity: "Critical",
        important_details: "Shipra Pontoon Bridge 3, dry wood bags",
        english_translation: "Emergency: Fire outbreak on Shipra Pontoon Bridge 3 involving dry logs. Urgent fire suppression response needed.",
        hindi_translation: "आपातकाल: शिप्रा पांटून ब्रिज ३ पर रखी सूखी लकड़ियों के ढेर में आग लग गई है। तुरंत दमकल सहायता भेजें।"
      });
    }, 1500);
    return;
  }

  try {
    const ai = getGenAI();
    
    // Direct audio data buffer processing
    // Extract raw base64 string from data URL
    const rawBase64 = audio.includes('base64,') ? audio.split('base64,')[1] : audio;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          inlineData: {
            data: rawBase64,
            mimeType: mimeType || 'audio/webm'
          }
        },
        "Analyze this audio statement from a pilgrim at the Ujjain Mahakumbh 2028. First, transcribe their speech exactly in the language/dialect they spoke (such as Hindi, Tamil, Telugu, Marathi, Bengali, English, etc). Then, detect the language, extract their name and phone number (if spoken), and detail the incident description. Generate beautiful, structured translations of the report in both English and Hindi. Also, classify this emergency under one of the standard categories and select an appropriate safety severity limit. If something is missing, predict natural defaults."
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcription: { type: Type.STRING, description: "Transcription of the original spoken recording in its native language script." },
            detected_language: { type: Type.STRING, description: "Name of the detected Indian regional language or English." },
            name: { type: Type.STRING, description: "Pilgrim name extracted from speech, or default to Guest Pilgrim if not specified." },
            phone: { type: Type.STRING, description: "Extract the exact 10-digit mobile number if spoken, or empty string." },
            description: { type: Type.STRING, description: "Detailed description of the emergency event." },
            category: { 
              type: Type.STRING, 
              description: "Must be exactly one of: 'Medical Emergency', 'Crowd Congestion', 'Lost Person', 'Security Threat', 'Fire Hazard', 'Water Rescue', 'Infrastructure Issue'." 
            },
            severity: { 
              type: Type.STRING, 
              description: "Must be exactly one of: 'Medium', 'High', 'Critical' depending on immediate life-risk." 
            },
            important_details: { type: Type.STRING, description: "Critical clues like clothes color, ghat platform number, physical landmark." },
            english_translation: { type: Type.STRING, description: "Fluent English translation of the emergency report." },
            hindi_translation: { type: Type.STRING, description: "Fluent Hindi translation of the emergency report." }
          },
          required: [
            "transcription", "detected_language", "name", "phone", "description", 
            "category", "severity", "important_details", "english_translation", "hindi_translation"
          ]
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini voice processing failed:", error);
    return res.status(500).json({ error: error.message || 'Error processing AI voice transcription.' });
  }
});

// 2. AI Incident Prioritization Analyzer Endpoint
app.post('/api/gemini/prioritize', async (req, res) => {
  const { incidents } = req.body;
  if (!incidents || !Array.isArray(incidents)) {
    return res.status(400).json({ error: 'Missing incidents collection' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No GEMINI_API_KEY found, returning mock incident priorities...");
    // Simulate smart prioritization dynamically
    const mockQueue = incidents.map((inc: any) => {
      let priority = 'Medium';
      let reason = 'Under standard crowd observation.';
      let team = 'Volunteer Team';

      if (inc.category === 'Medical Emergency' || inc.category === 'Water Rescue') {
        priority = inc.severity === 'Critical' ? 'Critical' : 'High';
        reason = `Immediate threat of life or water-drowning at ${inc.location}. Requires rapid clinical response.`;
        team = 'Medical Team';
      } else if (inc.category === 'Fire Hazard') {
        priority = 'Critical';
        reason = `Severe risk of spark spreading on temporary structures in ${inc.location}. Immediate dispatcher mandated.`;
        team = 'Fire Team';
      } else if (inc.category === 'Security Threat' || inc.category === 'Crowd Congestion') {
        priority = inc.severity === 'Critical' ? 'Critical' : 'High';
        reason = `Crowd density or active threat alert at ${inc.location}. Perimeters require isolation.`;
        team = 'Police';
      }

      return {
        id: inc.id,
        priority,
        reason,
        recommendedTeam: team
      };
    });

    return res.json({ queue: mockQueue });
  }

  try {
    const ai = getGenAI();
    const incidentDataSummary = incidents.map((inc: any) => ({
      id: inc.id,
      category: inc.category,
      description: inc.description,
      location: inc.location,
      severity: inc.severity,
      reporterName: inc.reporterName
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `You are the master AI commander at the Ujjain Mahakumbh 2028 Command Center. Please analyze these active reported incidents and produce a priority queue. Sort them, with the highest life-saving urgency triage first. Assign each a priority level (Critical, High, Medium, Low), give a rigorous safety explanation why this priority was assigned based on crowd safety, bridge infrastructure, bathing dangers, and appoint the correct dispatch agency (Police, Medical Team, Fire Team, Volunteer Team). 
      
      Active Incidents:
      ${JSON.stringify(incidentDataSummary, null, 2)}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            queue: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "The unique incident ID." },
                  priority: { type: Type.STRING, description: "One of: 'Critical', 'High', 'Medium', 'Low'." },
                  reason: { type: Type.STRING, description: "Safety priority rationale based on Simhastha threat telemetry." },
                  recommendedTeam: { type: Type.STRING, description: "Must be exactly one of: 'Police', 'Medical Team', 'Fire Team', 'Volunteer Team'." }
                },
                required: ["id", "priority", "reason", "recommendedTeam"]
              }
            }
          },
          required: ["queue"]
        }
      }
    });

    const resultText = response.text?.trim() || '{"queue":[]}';
    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini prioritization failed:", error);
    return res.status(500).json({ error: error.message || 'Error executing AI incident prioritization.' });
  }
});

// Configure Vite middleware or static assets depending on environment
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FULLSTACK ROUTER] Active and listening at http://localhost:${PORT}`);
  });
}

startServer();
