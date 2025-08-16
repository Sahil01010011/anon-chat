// pages/private-chat.js
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { database, auth } from '../firebase';
import { ref, onValue, push, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

export default function PrivateChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [otherUser, setOtherUser] = useState('Anonymous');

  const router = useRouter();
  const messagesEndRef = useRef(null);
  const { session } = router.query;

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  const uniqueUserId = typeof window !== 'undefined' ? localStorage.getItem('uniqueUserId') : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || !username || !uniqueUserId) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, [router, username, uniqueUserId]);

  useEffect(() => {
    if (!session || !uniqueUserId) return;

    const sessionRef = ref(database, `privateSessions/${session}`);
    const sessionUnsubscribe = onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.participants.includes(uniqueUserId)) {
        setSessionInfo(data);
        const otherUsername = (uniqueUserId === data.from) ? data.toUser : data.fromUser;
        setOtherUser(otherUsername || 'User');
        setLoading(false);
      } else {
        localStorage.removeItem('privateSessionId');
        localStorage.removeItem('privateChatActive');
        router.push('/chat');
      }
    });

    const messagesRef = ref(database, `privateSessions/${session}/messages`);
    const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data)
          .map(([id, msg]) => ({ id, ...msg }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgs);
      }
    });

    return () => {
      sessionUnsubscribe();
      messagesUnsubscribe();
    };
  }, [session, uniqueUserId, router]);

  useEffect(() => {
    if (!sessionInfo) return;
    const interval = setInterval(() => {
      const inactivityLimit = 30 * 60 * 1000; 
      const remaining = sessionInfo.lastActivity + inactivityLimit - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        leaveChat(true, true);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionInfo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !session || !uniqueUserId) return;
    const messageData = {
      text: input.trim(),
      timestamp: Date.now(),
      userId: uniqueUserId,
      userDisplayName: username
    };
    const messagesRef = ref(database, `privateSessions/${session}/messages`);
    await push(messagesRef, messageData);
    const sessionRef = ref(database, `privateSessions/${session}`);
    await update(sessionRef, { lastActivity: Date.now() });
    setInput('');
  };

  const leaveChat = async (isEnding = false, isAuto = false) => {
    if (isEnding && !isAuto) {
      if (!window.confirm('Are you sure you want to end this chat for both users?')) return;
    }
    if (isEnding) {
      try {
        const sessionRef = ref(database, `privateSessions/${session}`);
        await update(sessionRef, { status: 'expired' });
      } catch (error) {
        console.error('Failed to end chat session:', error);
      }
    }
    localStorage.removeItem('privateSessionId');
    localStorage.removeItem('privateChatActive');
    router.push('/chat');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formatTimeLeft = (ms) => {
    if (!ms || ms < 0) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <p className="animate-pulse">Connecting to private chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-indigo-900 via-blue-900 to-black text-white">
      
      {/* HEADER */}
      <header className="bg-black/40 backdrop-blur-lg border-b border-white/10 px-4 py-3 shadow-md">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div>
              <h1 className="font-semibold text-base sm:text-lg">Chat with {otherUser}</h1>
              <div className="flex items-center space-x-2 text-xs text-gray-300">
                <span className="flex items-center text-green-400"><div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>Secure</span>
                {timeLeft && <span className="text-yellow-400">{formatTimeLeft(timeLeft)}</span>}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => leaveChat(true)} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={() => leaveChat(false)} className="p-2 rounded-full bg-gray-500/20 hover:bg-gray-500/40">
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isOwner = msg.userId === uniqueUserId;
            return (
              <div key={msg.id} className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow ${isOwner ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-gray-700/60 backdrop-blur-md text-gray-200'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 text-right ${isOwner ? 'text-blue-200' : 'text-gray-400'}`}>{formatTime(msg.timestamp)}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* INPUT */}
      <footer className="bg-black/40 backdrop-blur-lg border-t border-white/10 p-3">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyPress={handleKeyPress} 
            placeholder="Type a message..." 
            rows="1"
            className="flex-1 resize-none bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-white placeholder-gray-400"
          />
          <button 
            onClick={sendMessage} 
            disabled={!input.trim()} 
            className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 rounded-full flex items-center justify-center transition-all duration-200 shadow-md"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
