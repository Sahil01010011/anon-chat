// components/NotificationBox.js
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { database } from '../firebase';
import { ref, onValue, update, set, query, orderByChild, equalTo } from 'firebase/database';

function Modal({ open, onClose, children }) {
  const [mounted, setMounted] = useState(false);

  // mount guard for Next.js SSR
  useEffect(() => setMounted(true), []);

  // lock page scroll (works even if app uses its own scroll container)
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const y = window.scrollY;
    html.style.position = 'fixed';
    html.style.top = `-${y}px`;
    html.style.left = '0';
    html.style.right = '0';
    html.style.overflow = 'hidden';
    return () => {
      const top = html.style.top;
      html.style.position = '';
      html.style.top = '';
      html.style.left = '';
      html.style.right = '';
      html.style.overflow = '';
      window.scrollTo(0, Math.abs(parseInt(top || '0', 10)));
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col"
      >
        {children}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

const NotificationBox = ({ uniqueUserId, username }) => {
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Firebase listeners
  useEffect(() => {
    if (!uniqueUserId) return;

    const incomingQuery = query(
      ref(database, 'privateInvitations'),
      orderByChild('to'),
      equalTo(uniqueUserId)
    );
    const unsubIn = onValue(incomingQuery, (snap) => {
      const data = snap.val();
      const list = data
        ? Object.entries(data)
            .filter(([, v]) => v.status === 'pending')
            .map(([id, v]) => ({ ...v, id, type: 'invitation' }))
        : [];
      setNotifications((prev) => [...prev.filter((n) => n.type !== 'invitation'), ...list]);
    });

    const acceptedQuery = query(
      ref(database, 'privateInvitations'),
      orderByChild('from'),
      equalTo(uniqueUserId)
    );
    const unsubAc = onValue(acceptedQuery, (snap) => {
      const data = snap.val();
      const list = data
        ? Object.entries(data)
            .filter(([, v]) => v.status === 'accepted')
            .map(([id, v]) => ({ ...v, id, type: 'confirmation' }))
        : [];
      setNotifications((prev) => [...prev.filter((n) => n.type !== 'confirmation'), ...list]);
    });

    return () => {
      unsubIn();
      unsubAc();
    };
  }, [uniqueUserId]);

  const all = [...notifications].sort((a, b) => b.createdAt - a.createdAt);
  const unread = all.length;

  const handleAcceptInvite = async (invite) => {
    await update(ref(database, `privateInvitations/${invite.id}`), { status: 'accepted' });
    await set(ref(database, `privateSessions/${invite.roomCode}`), {
      participants: [invite.from, invite.to],
      createdAt: Date.now(),
      lastActivity: Date.now(),
      status: 'active',
      fromUser: invite.fromUsername,
      toUser: username,
    });
    setShowModal(false);
    localStorage.setItem('privateSessionId', invite.roomCode);
    localStorage.setItem('privateChatActive', 'true');
    router.push(`/private-chat?session=${invite.roomCode}`);
  };

  const handleJoinChat = async (invite) => {
    await update(ref(database, `privateInvitations/${invite.id}`), { status: 'joined' });
    setShowModal(false);
    localStorage.setItem('privateSessionId', invite.roomCode);
    localStorage.setItem('privateChatActive', 'true');
    router.push(`/private-chat?session=${invite.roomCode}`);
  };

  const handleDeclineOrDismiss = async (inviteId, status) => {
    const finalStatus = status === 'accepted' ? 'closed' : 'declined';
    await update(ref(database, `privateInvitations/${inviteId}`), { status: finalStatus });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`group relative p-2 sm:p-3 rounded-xl border shadow ${
          unread > 0 ? 'bg-blue-100 border-blue-300/40' : 'bg-gray-100 border-gray-300/40'
        }`}
        title="Notifications"
      >
        <svg
          className={`w-4 h-4 ${unread > 0 ? 'text-blue-600' : 'text-gray-600'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unread > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {unread > 9 ? '9+' : unread}
          </div>
        )}
      </button>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-xl">🔔 Notifications ({unread})</h3>
          <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-gray-100" title="Close">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {all.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <p className="text-lg font-medium">No new notifications</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {all.map((note) => (
                <div key={note.id} className="p-6 hover:bg-gray-50">
                  {note.type === 'invitation' ? (
                    <div>
                      <p className="font-semibold text-gray-900">🔒 Private Chat Invitation</p>
                      <p className="text-gray-600 mt-1">
                        Someone from <span className="font-medium text-blue-600">{note.fromYear} Year</span> wants to chat privately.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(note.createdAt).toLocaleString()}</p>
                      <div className="flex space-x-3 mt-4">
                        <button onClick={() => handleAcceptInvite(note)} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl">
                          ✅ Accept
                        </button>
                        <button onClick={() => handleDeclineOrDismiss(note.id, 'declined')} className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl">
                          ❌ Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-900">✅ Invitation Accepted!</p>
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium text-green-600">{note.toUsername}</span> accepted your invitation to chat.
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(note.createdAt).toLocaleString()}</p>
                      <div className="flex space-x-3 mt-4">
                        <button onClick={() => handleJoinChat(note)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                          💬 Join Chat
                        </button>
                        <button onClick={() => handleDeclineOrDismiss(note.id, 'accepted')} className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl">
                          🗑️ Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default NotificationBox;
