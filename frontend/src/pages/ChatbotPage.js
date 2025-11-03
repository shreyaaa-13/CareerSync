import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { chatbotAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  Loader,
  RotateCcw
} from 'lucide-react';

const ChatbotPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: `Hello ${user?.full_name || 'there'}! 👋 I'm your AI Career Assistant. I can help you with career guidance, skill development, job search tips, and more. What would you like to know?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    loadSuggestions();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSuggestions = () => {
    setSuggestions([
      "What career is best for me?",
      "How do I become a software engineer?",
      "What skills should I learn?",
      "Tell me about data science careers",
      "How to prepare for job interviews?",
      "What certifications are valuable?"
    ]);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Try to get response from backend
      try {
        const response = await chatbotAPI.sendMessage({ message: messageText });
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (apiErr) {
        // Use local response generation
        const botResponse = generateLocalResponse(messageText);
        const botMessage = {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setTimeout(() => {
          setMessages(prev => [...prev, botMessage]);
        }, 1000);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your question. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateLocalResponse = (message) => {
    const messageLower = message.toLowerCase();

    // Greetings
    if (messageLower.match(/\b(hello|hi|hey|greetings)\b/)) {
      return `Hello! I'm here to help with your career questions. You can ask me about:\n\n• Career paths and options\n• Required skills and education\n• Job market trends\n• Interview preparation\n• Resume tips\n• Salary expectations\n\nWhat would you like to know?`;
    }

    // Career recommendations
    if (messageLower.includes('best career') || messageLower.includes('which career') || messageLower.includes('career for me')) {
      return `To recommend the best career for you, I need to understand your interests and skills better.\n\n**I suggest you:**\n1. Complete our career assessment quiz\n2. Upload your resume for skill analysis\n3. Then I can provide personalized recommendations\n\nAlternatively, tell me about your interests! For example:\n• Do you enjoy problem-solving and logic?\n• Are you creative and artistic?\n• Do you like working with people?\n• Are you interested in technology?`;
    }

    // Software Engineering
    if (messageLower.includes('software engineer') || messageLower.includes('programmer') || messageLower.includes('developer')) {
      return `**Software Engineering Career Path:**\n\n**What they do:**\nDesign, develop, and maintain software applications and systems.\n\n**Required Skills:**\n• Programming (Python, Java, JavaScript, C++)\n• Data structures & algorithms\n• Problem-solving\n• Version control (Git)\n• Database management\n\n**Education:**\nBachelor's in Computer Science or bootcamp + portfolio\n\n**Salary Range:** $80,000 - $150,000+\n\n**How to start:**\n1. Learn programming fundamentals\n2. Build projects for your portfolio\n3. Contribute to open source\n4. Practice coding challenges\n5. Apply for internships\n\nWould you like to know more about any specific aspect?`;
    }

    // Data Science
    if (messageLower.includes('data scien') || messageLower.includes('data analy') || messageLower.includes('machine learning')) {
      return `**Data Science Career Path:**\n\n**What they do:**\nAnalyze complex data to help organizations make informed decisions using statistics, ML, and visualization.\n\n**Required Skills:**\n• Python/R programming\n• Statistics & mathematics\n• Machine Learning\n• SQL & databases\n• Data visualization (Tableau, PowerBI)\n\n**Education:**\nBachelor's or Master's in Data Science, Statistics, or CS\n\n**Salary Range:** $90,000 - $160,000+\n\n**Learning Path:**\n1. Master Python and statistics\n2. Learn ML algorithms\n3. Work on data projects\n4. Build a portfolio\n5. Get certified (Google, IBM)\n\nInterested in specific tools or techniques?`;
    }

    // Skills to learn
    if (messageLower.includes('skills') || messageLower.includes('learn') || messageLower.includes('study')) {
      return `**Top Skills to Learn in 2024:**\n\n**Technical Skills:**\n• Programming (Python, JavaScript)\n• Cloud platforms (AWS, Azure)\n• Data analysis & visualization\n• AI/Machine Learning basics\n• Cybersecurity fundamentals\n\n**Soft Skills:**\n• Communication\n• Problem-solving\n• Adaptability\n• Critical thinking\n• Collaboration\n\n**How to learn:**\n• Online courses (Coursera, Udemy)\n• YouTube tutorials\n• Practice projects\n• Bootcamps\n• Certifications\n\nWhich area interests you most?`;
    }

    // Interview preparation
    if (messageLower.includes('interview') || messageLower.includes('job search')) {
      return `**Interview Preparation Tips:**\n\n**Before the interview:**\n• Research the company thoroughly\n• Review the job description\n• Prepare STAR method examples\n• Practice common questions\n• Prepare questions to ask\n\n**During the interview:**\n• Arrive 10-15 minutes early\n• Dress professionally\n• Make eye contact\n• Be enthusiastic\n• Ask clarifying questions\n\n**Common Questions:**\n• Tell me about yourself\n• Why this company?\n• Your strengths/weaknesses\n• Describe a challenge you faced\n• Where do you see yourself in 5 years?\n\n**After the interview:**\n• Send a thank-you email within 24 hours\n• Follow up if you don't hear back\n\nNeed help with specific interview questions?`;
    }

    // Certifications
    if (messageLower.includes('certification') || messageLower.includes('certificate')) {
      return `**Valuable Certifications by Field:**\n\n**Technology:**\n• AWS Certified Solutions Architect\n• Google Professional Certificates\n• CompTIA A+/Network+/Security+\n• Microsoft Azure Fundamentals\n\n**Data Science:**\n• Google Data Analytics Certificate\n• IBM Data Science Professional\n• Tableau Desktop Specialist\n\n**Business:**\n• PMP (Project Management)\n• Six Sigma Green/Black Belt\n• Scrum Master (CSM)\n• Google Digital Marketing\n\n**Tips:**\n• Choose based on career goals\n• Many are available online\n• Some employers pay for certifications\n• Keep certifications current\n\nWhich field are you interested in?`;
    }

    // Resume help
    if (messageLower.includes('resume') || messageLower.includes('cv')) {
      return `**Resume Writing Tips:**\n\n**Structure:**\n• Contact information\n• Professional summary\n• Work experience (reverse chronological)\n• Education\n• Skills\n• Certifications (if applicable)\n\n**Best Practices:**\n• Tailor to each job\n• Use action verbs (developed, managed, created)\n• Quantify achievements (increased sales by 30%)\n• Keep it concise (1-2 pages)\n• Use bullet points\n• Proofread carefully\n\n**What to avoid:**\n• Typos and errors\n• Generic objectives\n• Irrelevant information\n• Unprofessional email addresses\n• Photos (unless required)\n\n**Pro tip:** Upload your resume on our platform for AI-powered analysis!\n\nNeed help with a specific section?`;
    }

    // Salary questions
    if (messageLower.includes('salary') || messageLower.includes('pay') || messageLower.includes('earn')) {
      return `**Salary Information by Career:**\n\n**Entry-Level Ranges (US):**\n• Software Engineer: $60k-$90k\n• Data Scientist: $70k-$100k\n• Web Developer: $50k-$75k\n• Product Manager: $80k-$110k\n• UX Designer: $55k-$85k\n• Marketing Manager: $50k-$80k\n\n**Factors affecting salary:**\n• Location (higher in tech hubs)\n• Experience level\n• Company size\n• Industry\n• Education\n• Specific skills\n\n**Negotiation tips:**\n• Research market rates\n• Know your worth\n• Consider total compensation\n• Be prepared to justify\n• Don't accept first offer immediately\n\nWhich career are you curious about?`;
    }

    // Career change
    if (messageLower.includes('career change') || messageLower.includes('switch career') || messageLower.includes('transition')) {
      return `**Career Transition Guide:**\n\n**Steps to change careers:**\n\n1. **Self-Assessment**\n   • Identify transferable skills\n   • Understand your motivations\n   • Research target careers\n\n2. **Skill Development**\n   • Take online courses\n   • Get certifications\n   • Build a portfolio\n   • Volunteer or freelance\n\n3. **Networking**\n   • Join professional groups\n   • Attend industry events\n   • Connect on LinkedIn\n   • Find a mentor\n\n4. **Job Search**\n   • Update your resume\n   • Highlight transferable skills\n   • Target entry-level roles\n   • Be patient and persistent\n\n**Common transitions:**\n• Teacher → Corporate Trainer\n• Sales → Marketing\n• Any field → Tech (via bootcamps)\n\nWhat career are you considering?`;
    }

    // Default response
    return `I'm here to help with career guidance! I can assist with:\n\n• **Career exploration** - Finding the right path\n• **Skill development** - What to learn\n• **Job search** - Interview tips and strategies\n• **Education** - Degrees and certifications\n• **Salary info** - Market rates and negotiation\n• **Career transitions** - Changing fields\n\nWhat specific aspect would you like to discuss? Feel free to ask any career-related question!`;
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      text: `Chat cleared! How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-full">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Career Assistant</h1>
                <p className="text-primary-100">Ask me anything about careers, skills, or job search</p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Clear Chat</span>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white shadow-xl rounded-b-2xl">
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {message.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 max-w-[70%] ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 mb-3 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Suggested questions:</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your career question here..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">AI-Powered</h3>
            </div>
            <p className="text-sm text-gray-600">Get intelligent career advice based on your profile</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">24/7 Available</h3>
            </div>
            <p className="text-sm text-gray-600">Chat anytime, get instant responses to your questions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Personalized</h3>
            </div>
            <p className="text-sm text-gray-600">Tailored advice based on your skills and goals</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
