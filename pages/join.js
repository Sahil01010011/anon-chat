// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// --- SVG Icon Components (Slightly smaller for better mobile fit) ---
const GraduationCapIcon = () => <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 18.782V21M3 21v-2.218c0-1.024.368-2.006 1.078-2.788L12 14z" /></svg>;
const BookIcon = () => <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const LaptopIcon = () => <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const RocketIcon = () => <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const GlobeIcon = () => <svg className="w-8 h-8 sm:w-10 sm:h-10 mb-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h8a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.704 4.343a9.003 9.003 0 0110.592 0m-10.592 0a9.003 9.003 0 00-1.282 5.065M18.296 4.343a9.003 9.003 0 011.282 5.065m0 0a9 9 0 01-9.563 8.292m-5.065 1.282a9.003 9.003 0 010-10.592m0 0A9 9 0 0112 3c1.32 0 2.576.28 3.746.784" /></svg>;


export default function Home() {
  const [selectedYear, setSelectedYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const yearCredentials = {
    first: { email: 'first@csechat.com', password: 'first@2025' },
    second: { email: 'second@csechat.com', password: 'second@2025' },
    third: { email: 'third@csechat.com', password: 'third@2025' },
    fourth: { email: 'fourth@csechat.com', password: 'fourth@2025' },
    common: { email: 'common@csechat.com', password: 'common@2025' }
  };

  const roomData = [
    { value: 'first', name: 'First Year', Icon: GraduationCapIcon, color: 'hover:border-blue-500 hover:bg-blue-50' },
    { value: 'second', name: 'Second Year', Icon: BookIcon, color: 'hover:border-green-500 hover:bg-green-50' },
    { value: 'third', name: 'Third Year', Icon: LaptopIcon, color: 'hover:border-purple-500 hover:bg-purple-50' },
    { value: 'fourth', name: 'Fourth Year', Icon: RocketIcon, color: 'hover:border-red-500 hover:bg-red-50' },
    { value: 'common', name: 'Common Room', Icon: GlobeIcon, color: 'hover:border-emerald-500 hover:bg-emerald-50' },
  ];

  const handleRoomSelect = (year) => {
    setSelectedYear(year);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setSelectedYear('');
        setLoginId('');
        setPassword('');
        setUsername('');
    }, 300);
  };
  
  const handleLogin = async () => {
    if (!selectedYear || !loginId || !password || !username.trim()) {
      alert('Please fill all fields!');
      return;
    }
    if (username.trim().length < 2) {
      alert('Username must be at least 2 characters long!');
      return;
    }

    setLoading(true);

    try {
      const yearCred = yearCredentials[selectedYear];
      if (loginId === yearCred.email && password === yearCred.password) {
        await signInWithEmailAndPassword(auth, yearCred.email, yearCred.password);
        
        const uniqueUserId = `${username.trim().replace(/\s+/g, '_')}_${Date.now()}`;
        
        localStorage.setItem('userYear', selectedYear);
        localStorage.setItem('username', username.trim());
        localStorage.setItem('uniqueUserId', uniqueUserId);
        
        router.push('/chat');
      } else {
        alert('Invalid credentials for the selected room!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials or try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex items-center justify-center p-4">
      
      {/* Step 1: Room Selection */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Welcome to CSE Anonymous Chat
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">
          First, choose your chat room.
        </p>
        {/* CHANGE: Grid layout is now responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {roomData.map((room) => (
            <button
              key={room.value}
              onClick={() => handleRoomSelect(room.value)}
              // CHANGE: Padding and text size adjusted for mobile
              className={`flex flex-col items-center justify-center p-4 sm:p-6 border-2 rounded-xl text-center transition-all duration-200 ${room.color}`}
            >
              <room.Icon />
              <p className="font-semibold text-gray-700 text-sm sm:text-base">{room.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Authentication Modal */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
              Enter {roomData.find(r => r.value === selectedYear)?.name}
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm">Enter the credentials to join.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Room Access ID:</label>
                <input
                  type="email"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g., fourth@csechat.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Room Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Your Username: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., Alex21"
                  maxLength={20}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Chat Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}