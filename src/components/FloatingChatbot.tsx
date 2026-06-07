import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, MapPin, Activity } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  lang: 'en' | 'hi';
}

export default function FloatingChatbot({ language = 'en', onNavigate }: { language: 'en' | 'hi'; onNavigate: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: language === 'hi' 
        ? "॥ हर हर महादेव ॥ मैं आपका उज्जैन सिंहस्थ २०२८ डिजिटल सहायक हूँ। मैं आपकी सुरक्षा और सहायता के लिए यहाँ हूँ। आपको क्या मदद चाहिए?"
        : "|| Har Har Mahadev || I am your Ujjain Simhastha 2028 Digital Assistant. I am here to help you navigate, report emergencies, find camps, and stay secure. How can I assist you today?",
      lang: language
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const autoQuestions = [
    {
      qEn: "How do I report an emergency?",
      qHi: "आपातकाल की रिपोर्ट कैसे करें?",
      aEn: "To report an emergency immediately, navigate to the 'Emergency Help' tab. You can use the 'One-Tap SOS' button to sound a 5-second countdown alert, or use our 'Multilingual Voice Reporting' to speak in any language. The AI will instantly triage and route your request to the police, medical, or fire response teams.",
      aHi: "आपातकाल की रिपोर्ट करने के लिए, 'Emergency Help' (आपातकालीन सहायता) टैब पर जाएं। आप 'One-Tap SOS' बटन का उपयोग कर सकते हैं या 'Multilingual Voice Reporting' (बहुभाषी आवाज रिपोर्टिंग) से बोलकर रिपोर्ट दर्ज कर सकते हैं। एआई आपके खतरे का विश्लेषण कर सीधे सुरक्षा दलों को भेजेगा।"
    },
    {
      qEn: "How do I share my location?",
      qHi: "अपना लाइव स्थान कैसे साझा करें?",
      aEn: "On the 'Emergency Help' page, click on 'Share My Live Location'. The platform uses secure browser GPS telemetry to capture your live latitude and longitude and automatically updates the reporting forms with nearest landmark (such as Ram Ghat Platform or Temple exits).",
      aHi: "आपातकालीन सहायता पेज पर 'Share My Live Location' (अपना लाइव स्थान साझा करें) बटन दबाएं। यह सुरक्षित रूप से आपके अक्षांश और देशांतर का पता लगाएगा और स्वतः रिपोर्ट फॉर्म में आपका निकटतम स्थल जोड़ देगा।"
    },
    {
      qEn: "Where is the nearest medical camp?",
      qHi: "निकटतम चिकित्सा शिविर कहां है?",
      aEn: "You can find near-real-time medical camp coordinates inside the 'Medical Care' page. The central camps include: \n1. Mahakal Corridor Apex Trauma Unit (Adjacent to exit corridors)\n2. Ram Ghat Ayurvedic & Dehydration Booth (Near the main pontoon bridge)\n3. Harsiddhi Gate General Aid camp.",
      aHi: "चिकित्सा शिविरों की स्थिति 'Medical Care' (चिकित्सा सेवा) पेज पर देखी जा सकती है। प्रमुख शिविर निम्नलिखित हैं: \n१. महाकाल कॉरिडोर अपेक्स ट्रॉमा यूनिट (निकास द्वार के पास)\n२. राम घाट आयुर्वेदिक एवं निर्जलीकरण राहत बूथ (मुख्य पांटून पुल के पास)\n३. हरसिद्धि गेट सामान्य सहायता शिविर।"
    },
    {
      qEn: "How do I track my report?",
      qHi: "अपनी रिपोर्ट कैसे ट्रैक करें?",
      aEn: "Once submitted, you can track response team dispatches on the 'Emergency Help' page under 'My Incident Dispatches' or via the 'Command Hub' role dashboards. You will see when responders are dispatched and when the case is successfully resolved.",
      aHi: "एक बार रिपोर्ट सबमिट हो जाने पर, आप 'Emergency Help' पेज पर नीचे 'मेरी आपातकालीन रिपोर्टें' (My Incident Dispatches) अनुभाग में वास्तविक समय में ट्रैकिंग स्थिति देख सकते हैं।"
    },
    {
      qEn: "What do emergency types mean?",
      qHi: "विभिन्न आपातकालीन प्रकारों का क्या अर्थ है?",
      aEn: "We assist across standard categories:\n- 🚑 Medical: Injuries, heatstroke or sudden sickness.\n- 👮 Crowd: Heavy density blocking gates.\n- ⛵ Water Rescue: Shipra River barricade crossings.\n- 🔥 Fire: Thermal hazards.\n- 🔍 Lost Person: Lost kids or senior citizens.",
      aHi: "हम निम्नलिखित श्रेणियों में सहायता प्रदान करते हैं:\n- 🚑 चिकित्सा: चोट या अचानक तबियत खराब होना।\n- 👮 भीड़ नियंत्रण: भारी भीड़ जाम।\n- ⛵ जल बचाव: पांटून पुल पर नदी सहायता।\n- 🔥 अग्नि खतरा: आग बुझाने का संकट।\n- 🔍 खोया व्यक्ति: बिछड़े परिवार से मिलाना।"
    }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text, lang: language };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Formulate automated friendly response matching keywords or match with questions
    setTimeout(() => {
      let responseText = "";
      const lower = text.toLowerCase();

      // Check quick triggers
      if (lower.includes("report") || lower.includes("emergency") || lower.includes("रिपोर्ट") || lower.includes("आपात")) {
        responseText = language === 'hi' 
          ? "आप तुरंत 'Emergency Help' (आपातकालीन सहायता) टैब पर जाकर आपातकाल दर्ज कर सकते हैं। आप एसओएस बटन दबाकर तात्कालिक संकट अलार्म भी बजा सकते हैं।"
          : "You can easily report emergencies by opening the 'Emergency Help' tab. Use the orange SOS button for instant water or medical crisis pings.";
      } else if (lower.includes("location") || lower.includes("gps") || lower.includes("स्थान") || lower.includes("नक्शा")) {
        responseText = language === 'hi'
          ? "अपनी लाइव जीपीएस स्थिति साझा करने के लिए आपातकालीन पेज पर 'Share My Live Location' बटन पर क्लिक करें। यह स्वतः ही आपके रिपोर्ट में राम घाट जैसे महत्वपूर्ण स्थल जोड़ देगा।"
          : "Simply click the 'Share My Live Location' button on the Emergency reporting form. It fetches secure latitude and longitude and resolves it to local landmarks.";
      } else if (lower.includes("medical") || lower.includes("camp") || lower.includes("चिकित्सा") || lower.includes("अस्पताल")) {
        responseText = language === 'hi'
          ? "राम घाट पांटून पुल के पास आयुर्वेदिक और महाकाल कॉरिडोर के निकास द्वार पर अपेक्स ट्रॉमा सेंटर कार्यरत हैं। अधिक विवरण 'Medical Care' टैब पर उपलब्ध हैं।"
          : "The nearest medical camps are available at Ram Ghat Pontoon Bridge and Mahakaleshwar Exit Gate. Open the 'Medical Care' tab for real-time bed inventories.";
      } else {
        responseText = language === 'hi'
          ? "सिंहस्थ उज्जैन २०२८ सुरक्षा द्वार में आपका स्वागत है। आप हमारी त्वरित पूछताछ बटनों पर क्लिक करके संपूर्ण दिशा-निर्देश प्राप्त कर सकते हैं। हर हर महादेव!"
          : "Welcome to Simhastha Ujjain 2028 Support. Please use the quick selection helper buttons below to seek precise directions instantly. Har Har Mahadev!";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: responseText, lang: language }]);
    }, 850);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none font-sans" id="floating-chatbot-root">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#541d17] to-[#e67e22] text-white flex items-center justify-center shadow-lg shadow-amber-950/20 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-white relative group"
          id="btn-chatbot-toggle"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-white" />
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-transform bg-[#541d17] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow border border-[#eddcc1]/20">
            {language === 'hi' ? "सिंहस्थ सहायक एआई" : "Kumbh Support AI"}
          </span>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="w-85 h-112 rounded-3xl bg-white border border-[#eddcc1]/80 shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300" id="chatbot-container">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#541d17] via-[#7f2d24] to-[#e67e22] p-4 text-white flex items-center justify-between" id="chatbot-header">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="font-serif text-xs font-bold tracking-wide">
                  {language === 'hi' ? "सिंहस्थ २०२८ एआई सहायक" : "Simhastha 2028 AI Assistant"}
                </h4>
                <p className="text-[9px] text-[#eddcc1] font-mono uppercase tracking-wider">Online • Dual Language Supported</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer"
              id="btn-chatbot-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversational Feed */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-[#fffbfc] to-[#faf6f3] space-y-3" id="chatbot-feed">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                id={`chat-msg-${idx}`}
              >
                <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-[#541d17] text-white rounded-tr-none' 
                    : 'bg-white text-[#541d17] border border-[#eddcc1]/30 rounded-tl-none'
                }`}>
                  {msg.text.split('\n').map((line, lidx) => (
                    <p key={lidx} className={lidx > 0 ? "mt-1 pt-1 border-t border-dotted border-neutral-100" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Helper Questions Selection Panel */}
          <div className="px-3 py-2 bg-[#fcf9f5] border-t border-b border-[#eddcc1]/20 overflow-x-auto flex gap-1.5 scrollbar-none" id="chatbot-quick-questions">
            {autoQuestions.map((quest, idx) => {
              const label = language === 'hi' ? quest.qHi : quest.qEn;
              const ans = language === 'hi' ? quest.aHi : quest.aEn;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setMessages(prev => [
                      ...prev,
                      { sender: 'user', text: label, lang: language },
                      { sender: 'bot', text: ans, lang: language }
                    ]);
                  }}
                  className="bg-white hover:bg-orange-50/50 border border-[#eddcc1]/40 hover:border-[#e67e22]/40 rounded-full px-3 py-1 text-[10px] text-[#541d17] font-semibold transition-colors duration-300 whitespace-nowrap cursor-pointer shadow-sm shrink-0"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-[#eddcc1]/30 flex items-center gap-2" id="chatbot-footer-input">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputVal);
              }}
              placeholder={language === 'hi' ? "प्रश्न टाइप करें..." : "Ask a question..."}
              className="flex-1 border border-neutral-200 focus:outline-none focus:border-[#e67e22] rounded-xl px-3 py-2 text-xs font-sans text-neutral-800"
            />
            <button
              onClick={() => handleSend(inputVal)}
              className="w-8 h-8 rounded-full bg-[#541d17] hover:bg-[#e67e22] text-white flex items-center justify-center shadow-sm cursor-pointer transition-colors"
              id="btn-chatbot-send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
