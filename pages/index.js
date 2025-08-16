// pages/landing.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// --- Navigation Icon Components ---
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H4a2 2 0 01-2-2V9z" />
    <polyline points="9,22 9,12 15,12 15,22" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
);

const AboutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

const FeaturesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" strokeWidth={2} />
    <rect x="14" y="3" width="7" height="7" strokeWidth={2} />
    <rect x="14" y="14" width="7" height="7" strokeWidth={2} />
    <rect x="3" y="14" width="7" height="7" strokeWidth={2} />
  </svg>
);

const DeveloperIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="16,18 22,12 16,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <polyline points="8,6 2,12 8,18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="12" y1="2" x2="12" y2="22" strokeLinecap="round" strokeWidth={2} />
  </svg>
);

const JoinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="9" cy="7" r="4" strokeWidth={2} />
    <line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round" strokeWidth={2} />
    <line x1="22" y1="11" x2="16" y2="11" strokeLinecap="round" strokeWidth={2} />
  </svg>
);

// --- Navigation Header Component ---
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const logoIcon = (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="url(#gradient)" stroke="white" strokeWidth="2"/>
      <path d="M12 14h8M10 18h12M14 22h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white/10 backdrop-blur-md border-b border-white/20'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {logoIcon}
            <div className="flex flex-col">
              <span className={`font-bold text-lg lg:text-xl transition-colors duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-gray-900'
              }`}>
                Anon-Chat
              </span>
              <span className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-blue-600' : 'text-blue-600'
              }`}>
                CSE Community
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className={`flex items-center space-x-2 p-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-800 hover:text-blue-600'
              }`}
              title="Home"
            >
              <HomeIcon />
              <span className="hidden xl:inline">Home</span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`flex items-center space-x-2 p-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-800 hover:text-blue-600'
              }`}
              title="About"
            >
              <AboutIcon />
              <span className="hidden xl:inline">About</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`flex items-center space-x-2 p-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-800 hover:text-blue-600'
              }`}
              title="Features"
            >
              <FeaturesIcon />
              <span className="hidden xl:inline">Features</span>
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className={`flex items-center space-x-2 p-2 rounded-lg font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-800 hover:text-blue-600'
              }`}
              title="Developer"
            >
              <DeveloperIcon />
              <span className="hidden xl:inline">Developer</span>
            </button>
            <button
              onClick={() => router.push('/join')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 shadow-lg"
              title="Join Now"
            >
              <JoinIcon />
              <span>Join Now</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-gray-800 hover:bg-white/20 bg-white/10'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-lg rounded-b-2xl shadow-lg border-t border-gray-100 mt-2">
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <HomeIcon />
              <span>Home</span>
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <AboutIcon />
              <span>About</span>
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <FeaturesIcon />
              <span>Features</span>
            </button>
            <button
              onClick={() => scrollToSection('developer')}
              className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <DeveloperIcon />
              <span>Developer</span>
            </button>
            <div className="px-4 pt-2">
              <button
                onClick={() => router.push('/join')}
                className="flex items-center justify-center space-x-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full text-center hover:shadow-lg transition-all duration-300"
              >
                <JoinIcon />
                <span>Join Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Animated Hero Section Components ---
const FloatingShape = ({ className, children, delay = 0 }) => (
  <div className={`absolute opacity-20 animate-float ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const AnimatedText = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {children}
    </div>
  );
};

const ParticleAnimation = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30 animate-ping"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const TypewriterText = ({ texts, speed = 100 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < texts.length) {
      const currentFullText = texts[currentIndex];
      
      if (charIndex < currentFullText.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setCurrentIndex((currentIndex + 1) % texts.length);
          setCharIndex(0);
          setCurrentText('');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, charIndex, texts, speed]);

  return (
    <span className="text-blue-600">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// --- SVG Icon Components for How-To Section ---
const SelectRoomIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const GoAnonymousIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CollaborateIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const ConnectIcon = () => (
  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// --- Feature Icons ---
const AnonymousIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const RoomsIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const PrivateChatIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

export default function LandingPage() {
  const router = useRouter();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { 
      name: 'Anonymous Profiles', 
      description: 'Chat freely without revealing your identity. Your privacy is our priority.', 
      Icon: AnonymousIcon, 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      name: 'Multi-Year Rooms', 
      description: 'Dedicated chat rooms for each academic year, plus a common room for everyone.', 
      Icon: RoomsIcon, 
      color: 'from-green-500 to-green-600' 
    },
    { 
      name: 'Private Messaging', 
      description: 'Take conversations one-on-one with secure, private chat invitations.', 
      Icon: PrivateChatIcon, 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      name: 'Developer Friendly', 
      description: 'Share code blocks with syntax highlighting and express yourself with GIFs.', 
      Icon: CodeIcon, 
      color: 'from-red-500 to-red-600' 
    },
  ];

  const steps = [
    {
      title: 'Select Your Room',
      description: 'Jump into your year\'s dedicated space or the Common Room.',
      Icon: SelectRoomIcon
    },
    {
      title: 'Go Anonymous',
      description: 'Choose any username you like for the session. Your identity is always protected.',
      Icon: GoAnonymousIcon
    },
    {
      title: 'Collaborate & Share',
      description: 'Share formatted code blocks, post useful resources, or simply get instant help.',
      Icon: CollaborateIcon
    },
    {
      title: 'Connect Privately',
      description: 'Send a secure, one-on-one chat invitation to anyone in the room.',
      Icon: ConnectIcon
    }
  ];

  return (
    <>
      {/* Enhanced CSS with animations */}
      <style jsx global>{`
        html, body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          height: auto !important;
          min-height: 100vh !important;
        }
        
        #__next {
          height: auto !important;
          min-height: 100vh !important;
        }
        
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Advanced Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-30px) rotate(5deg); }
          66% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.3);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .hero-bg {
          background: linear-gradient(-45deg, #f8fafc, #e2e8f0, #e0f2fe, #f0f9ff);
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }

        /* Glassmorphism effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #4f46e5);
        }
        
        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .text-5xl { font-size: 2.25rem !important; }
          .text-7xl { font-size: 3rem !important; }
          .text-4xl { font-size: 1.875rem !important; }
          .text-5xl { font-size: 2.25rem !important; }
          .px-12 { padding-left: 2rem !important; padding-right: 2rem !important; }
          .py-24 { padding-top: 4rem !important; padding-bottom: 4rem !important; }
          .py-20 { padding-top: 3rem !important; padding-bottom: 3rem !important; }
        }
        
        @media (max-width: 768px) {
          .grid-cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }
        
        @media (max-width: 480px) {
          .grid-cols-4,
          .grid-cols-2 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
        }
      `}</style>

      <div style={{ height: 'auto', minHeight: '100vh' }}>
        {/* Header */}
        <Header />

        {/* Enhanced Hero Section */}
        <section 
          id="home"
          className="relative hero-bg pt-16 lg:pt-20 overflow-hidden"
          style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Animated Background Elements */}
          <ParticleAnimation />
          
          {/* Floating Shapes */}
          <FloatingShape className="top-20 left-10 text-blue-300" delay={0}>
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </FloatingShape>
          
          <FloatingShape className="top-32 right-20 text-indigo-300" delay={1}>
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </FloatingShape>
          
          <FloatingShape className="bottom-40 left-20 text-purple-300" delay={2}>
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="12,2 22,20 2,20"/>
            </svg>
          </FloatingShape>
          
          <FloatingShape className="bottom-20 right-10 text-blue-400" delay={0.5}>
            <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            </svg>
          </FloatingShape>

          {/* Main Content */}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-5xl mx-auto">
              {/* Animated Badge */}
              <AnimatedText delay={200}>
                <div className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full text-sm font-medium text-gray-700 mb-8 animate-pulse-glow">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                  <span>New features added!</span>
                </div>
              </AnimatedText>

              {/* Main Heading with Typewriter Effect */}
              <AnimatedText delay={400}>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
                  The Anonymous Chat Hub for{' '}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                      <TypewriterText texts={['CSE Students', 'Developers', 'Programmers', 'Coders']} speed={150} />
                    </span>
                  </span>
                </h1>
              </AnimatedText>

              {/* Subtitle */}
              <AnimatedText delay={800}>
                <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed px-4 max-w-3xl mx-auto">
                  Connect, collaborate, and share ideas with your peers across all years in 
                  <span className="font-semibold text-blue-600"> dedicated, anonymous chat rooms</span>
                </p>
              </AnimatedText>

              {/* CTA Buttons */}
              <AnimatedText delay={1200}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                  <button
                    onClick={() => router.push('/join')}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 text-lg animate-pulse-glow"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <JoinIcon />
                      <span>Join the Conversation</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('features')}
                    className="group px-8 py-4 glass-effect text-gray-700 font-semibold rounded-2xl hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300 text-lg"
                  >
                    <span className="flex items-center space-x-2">
                      <FeaturesIcon />
                      <span>Explore Features</span>
                    </span>
                  </button>
                </div>
              </AnimatedText>

              {/* Feature Pills */}
              <AnimatedText delay={1600}>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {['Anonymous', 'Secure', 'Real-time', 'Free'].map((feature, index) => (
                    <div
                      key={feature}
                      className="px-4 py-2 glass-effect rounded-full text-sm font-medium text-gray-700 hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                      style={{ animationDelay: `${1800 + index * 200}ms` }}
                    >
                      ✨ {feature}
                    </div>
                  ))}
                </div>
              </AnimatedText>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2 text-gray-400">
              <span className="text-sm font-medium">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Section 2: Why Anon-Chat? & How to Get Started */}
        <section id="about" className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-5xl mx-auto mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
                A Space for Every CSE Student
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed px-4">
                Ever had a question you thought was too "simple" to ask? Or wished you could easily get advice from senior students without feeling intimidated? Anon-Chat was built to solve this. By removing names and faces, we remove the pressure, creating a space where collaboration and curiosity can thrive. Whether you're debugging your first "Hello World" or tackling advanced algorithms, there's a place for you here.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="group text-center p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.Icon />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Core Features */}
        <section id="features" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Everything You Need to Connect
              </h2>
              <p className="text-lg sm:text-xl text-gray-600">Built for students, by students.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className="group bg-white p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <feature.Icon />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">{feature.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section 4: From the Developer */}
        <section id="developer" className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-8 sm:mb-12">
                From the Developer
              </h2>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12 rounded-3xl shadow-2xl">
                <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-gray-700 to-gray-900 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-xl sm:text-2xl shadow-xl">
                  S
                </div>
                <div className="pt-6 sm:pt-8">
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 italic leading-relaxed px-4">
                    "Hey everyone, I'm <strong>shadowxp</strong>. As a fellow CSE student, I built Anon-Chat to create a better, more open way for all of us—from first-years to seniors—to connect and help each other succeed. This platform is for you to ask questions without hesitation, share code without judgment, and build a stronger departmental community. This is an ongoing project built with Next.js and Firebase, and it's made for you. Enjoy the chat!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Final Call to Action */}
        <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 leading-relaxed px-4">
                Jump into your year's chat room and see what everyone is talking about.
              </p>
              <button
                onClick={() => router.push('/join')}
                className="group relative px-8 sm:px-12 py-4 sm:py-6 bg-white text-blue-600 font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 text-base sm:text-lg"
              >
                Choose Your Room
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
            <p className="text-base sm:text-lg">© 2025 Anon-Chat. A project by shadowxp for the CSE Department.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
