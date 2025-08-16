// pages/chat.js
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { database, auth } from "../firebase";
import {
  ref,
  onValue,
  push,
  remove,
  update,
  get,
  set,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import NotificationBox from "../components/NotificationBox";

const CodeBlock = dynamic(() => import("../components/CodeBlock"), {
  ssr: false,
});

// Sticker and GIF data
const STICKER_EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
  "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  "🎉", "🎊", "🎈", "🎁", "🎀", "🎂", "🎄", "🎃", "🎇", "🎆",
];

const SAMPLE_GIFS = [
  "https://media.giphy.com/media/3oz8xLd9DJq2l2VFtu/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const userYear = typeof window !== "undefined" ? localStorage.getItem("userYear") : null;
  const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const uniqueUserId = typeof window !== "undefined" ? localStorage.getItem("uniqueUserId") : null;

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && username && uniqueUserId) {
        setCurrentUser(user);
      } else {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router, username, uniqueUserId]);

  useEffect(() => {
    if (!userYear || !currentUser || !username || !uniqueUserId) {
      if (!loading) router.push("/");
      return;
    }

    const messagesRef = ref(database, `messages/${userYear}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgs = Object.entries(data)
          .map(([id, msg]) => ({ id, ...msg }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setMessages(msgs);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userYear, currentUser, router, loading, username, uniqueUserId]);

  // CHANGE: The automatic redirection listener that was here has been removed.
  // The new 3-way handshake logic is now handled entirely within NotificationBox.js.

  useEffect(() => {
    scrollToBottomSmooth();
  }, [messages]);

  const scrollToBottomSmooth = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      gsap.to(messagesContainerRef.current, {
        scrollTop: messagesContainerRef.current.scrollHeight,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  const detectCodeBlock = (text) => {
    const codeMatch = text.match(/^``````$/);
    if (codeMatch) {
      return { isCode: true, lang: codeMatch[1] || "javascript", code: codeMatch.trim() };
    }
    return { isCode: false };
  };

  const detectGifUrl = (text) => {
    const gifMatch = text.match(/https?:\/\/.*\.(gif|webp)/i);
    return gifMatch ? { isGif: true, url: text.trim() } : { isGif: false };
  };

  const generateRoomCode = () => {
    return "CHAT-" + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const sendPrivateInvite = async (targetMessage) => {
    if (targetMessage.userId === uniqueUserId) {
      alert("You can't invite yourself to a private chat!");
      return;
    }

    try {
      const roomCode = generateRoomCode();
      const newInviteRef = push(ref(database, 'privateInvitations')); // Use push to get a unique key

      const invitationData = {
        from: uniqueUserId,
        to: targetMessage.userId,
        fromUsername: username,
        toUsername: targetMessage.userDisplayName,
        roomCode: roomCode,
        status: "pending",
        createdAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        fromYear: userYear,
      };

      await set(newInviteRef, invitationData);
      alert(`Private chat invitation sent to ${targetMessage.userDisplayName}!`);
    } catch (error) {
      console.error("Failed to send invitation:", error);
      alert("Failed to send invitation. Please try again.");
    }
  };

  const sendMessage = () => {
    if (input.trim() === "" || !currentUser || !username || !uniqueUserId)
      return;

    const codeInfo = detectCodeBlock(input.trim());
    const gifInfo = detectGifUrl(input.trim());

    const messageData = {
      text: codeInfo.isCode ? codeInfo.code : input.trim(),
      originalText: input.trim(),
      timestamp: Date.now(),
      userId: uniqueUserId,
      userDisplayName: username,
      isCode: codeInfo.isCode,
      lang: codeInfo.lang || null,
      isGif: gifInfo.isGif,
      gifUrl: gifInfo.url || null,
    };

    if (replyingTo && replyingTo.id) {
      messageData.replyToId = replyingTo.id;
      messageData.replyToText =
        replyingTo.text || replyingTo.originalText || "";
      messageData.replyToUser =
        replyingTo.userDisplayName || replyingTo.username || "Someone";
    }

    const messagesRef = ref(database, `messages/${userYear}`);
    push(messagesRef, messageData);

    setInput("");
    setReplyingTo(null);
  };

  const deleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const messageRef = ref(database, `messages/${userYear}/${messageId}`);
      remove(messageRef);
    }
  };

  const deleteAllUserMessages = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete ALL your messages in this room? This action cannot be undone!"
      )
    ) {
      return;
    }

    try {
      const messagesRef = ref(database, `messages/${userYear}`);
      const snapshot = await get(messagesRef);
      const dbMessages = snapshot.val();

      if (!dbMessages) {
        alert("No messages found to delete.");
        return;
      }

      const userMessages = Object.entries(dbMessages).filter(
        ([msgId, message]) => message.userId === uniqueUserId
      );

      if (userMessages.length === 0) {
        alert("No messages found to delete.");
        return;
      }

      const deletePromises = userMessages.map(([msgId]) => {
        const msgRef = ref(database, `messages/${userYear}/${msgId}`);
        return remove(msgRef);
      });

      await Promise.all(deletePromises);

      alert(`Successfully deleted ${userMessages.length} message(s)!`);
    } catch (error) {
      console.error("Failed to delete messages:", error);
      alert("Failed to delete messages. Please try again.");
    }
  };

  const startEdit = (message) => {
    setEditingMessage(message.id);
    setEditText(message.originalText || message.text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;

    const codeInfo = detectCodeBlock(editText.trim());
    const messageRef = ref(database, `messages/${userYear}/${editingMessage}`);

    update(messageRef, {
      text: codeInfo.isCode ? codeInfo.code : editText.trim(),
      originalText: editText.trim(),
      isCode: codeInfo.isCode,
      lang: codeInfo.lang || null,
      edited: true,
      editedAt: Date.now(),
    })
      .then(() => {
        setEditingMessage(null);
        setEditText("");
      })
      .catch((error) => {
        console.error("Edit failed:", error);
        alert("Failed to edit message. Please try again.");
      });
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        saveEdit();
      } else {
        sendMessage();
      }
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffDays = Math.floor((now - messageTime) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return messageTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return messageTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const isMyMessage = (message) => {
    return uniqueUserId && message.userId === uniqueUserId;
  };

  const getYearInfo = () => {
    const yearMap = {
      first: { name: "First Year", color: "from-blue-500 to-blue-600", emoji: "🎓" },
      second: { name: "Second Year", color: "from-green-500 to-green-600", emoji: "📚" },
      third: { name: "Third Year", color: "from-purple-500 to-purple-600", emoji: "💻" },
      fourth: { name: "Fourth Year", color: "from-red-500 to-red-600", emoji: "🚀" },
      common: { name: "Common Room", color: "from-emerald-500 to-emerald-600", emoji: "🌍" },
    };
    return yearMap[userYear] || { name: "Unknown", color: "from-gray-500 to-gray-600", emoji: "❓" };
  };

  const addSticker = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowStickerPicker(false);
  };

  const addGif = (gifUrl) => {
    setInput(gifUrl);
    setShowGifPicker(false);
  };

  const startReply = (message) => {
    const replyContext = {
      id: message.id,
      text: message.text || message.originalText || "Original message",
      userDisplayName: message.userDisplayName || message.username || "Someone",
    };

    setReplyingTo(replyContext);
    setShowStickerPicker(false);
    setShowGifPicker(false);

    const inputField = document.querySelector(
      'textarea[placeholder*="Type your message"]'
    );
    if (inputField) inputField.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderMessageContent = (msg) => {
    if (msg.isCode) {
      return <CodeBlock code={msg.text} lang={msg.lang || "javascript"} />;
    } else if (msg.isGif && msg.gifUrl) {
      return (
        <div className="rounded-lg overflow-hidden max-w-xs">
          <img
            src={msg.gifUrl}
            alt="GIF"
            className="w-full h-auto rounded-lg"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <div className="hidden text-sm text-gray-500 italic">
            GIF failed to load
          </div>
        </div>
      );
    } else {
      return (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {msg.text}
        </p>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading your chat...</p>
        </div>
      </div>
    );
  }

  const yearInfo = getYearInfo();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-xl border-b border-blue-100/50 px-4 py-3 sm:px-6 sm:py-4 shadow-lg shadow-blue-100/20 rounded-b-2xl mx-2 mt-2 mb-1">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${yearInfo.color} rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/30 flex-shrink-0`}
            >
              <span className="text-white text-lg sm:text-xl">
                {yearInfo.emoji}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-gray-900 text-base sm:text-xl truncate">
                {yearInfo.name} CSE Chat
              </h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {messages.length} messages • {username}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <NotificationBox
              uniqueUserId={uniqueUserId}
              username={username}
              userYear={userYear}
            />
            <button
              onClick={deleteAllUserMessages}
              className="group relative p-2 sm:p-3 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-md sm:shadow-lg shadow-slate-200/50 hover:shadow-lg sm:hover:shadow-xl hover:shadow-slate-300/60 border border-slate-200/50"
              title="Delete all your messages"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 group-hover:text-slate-700 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={handleLogout}
              className="group relative p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl sm:rounded-2xl transition-all duration-200 shadow-md sm:shadow-lg shadow-blue-200/50 hover:shadow-lg sm:hover:shadow-xl hover:shadow-blue-300/60 border border-blue-300/30"
              title="Logout"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-2 py-4 sm:px-4 sm:py-6 max-w-4xl mx-auto w-full"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-4">
            <div className="relative">
              <div
                className={`w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-r ${yearInfo.color} rounded-full flex items-center justify-center shadow-xl`}
              >
                <svg
                  className="w-8 sm:w-12 h-8 sm:h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm sm:text-lg">👋</span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Welcome to {yearInfo.name}!
              </h3>
              <p className="text-gray-600 text-sm sm:text-base max-w-md">
                This is the beginning of your discussion. Share notes, ask
                questions, and help each other out!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {messages.map((msg, index) => {
              const isOwner = isMyMessage(msg);
              const isConsecutive =
                index > 0 && messages[index - 1].userId === msg.userId;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isOwner ? "justify-end" : "justify-start"
                  } ${isConsecutive ? "mt-1" : "mt-4 sm:mt-6"}`}
                >
                  <div
                    className={`flex items-end space-x-2 sm:space-x-3 max-w-[85%] sm:max-w-md md:max-w-2xl ${
                      isOwner ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    {!isConsecutive && (
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 ${
                          isOwner
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : "bg-gradient-to-r from-gray-400 to-gray-500"
                        }`}
                      >
                        <span className="text-white text-xs sm:text-sm font-bold">
                          {msg.userDisplayName?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                    )}

                    <div
                      className={`${
                        isConsecutive
                          ? isOwner
                            ? "mr-10 sm:mr-13"
                            : "ml-10 sm:ml-13"
                          : ""
                      }`}
                    >
                      {!isConsecutive && !isOwner && (
                        <p className="text-xs text-gray-500 mb-1 ml-1 font-medium">
                          {msg.userDisplayName || "Anonymous"}
                        </p>
                      )}

                      <div
                        className={`relative group ${
                          msg.isCode
                            ? "p-0"
                            : isOwner
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        } rounded-2xl ${
                          msg.isCode ? "" : "px-3 py-2 sm:px-4 sm:py-3"
                        } shadow-lg hover:shadow-xl transition-all duration-200 break-words`}
                      >
                        {msg.replyToId && (
                          <div
                            className={`mb-2 p-2 rounded-lg border-l-4 ${
                              isOwner
                                ? "border-blue-200 bg-blue-50/20"
                                : "border-gray-300 bg-gray-50"
                            } text-xs`}
                          >
                            <div className="flex items-center space-x-1 mb-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              <p
                                className={`font-semibold ${
                                  isOwner ? "text-blue-200" : "text-gray-600"
                                }`}
                              >
                                Replying to {msg.replyToUser || "Someone"}
                              </p>
                            </div>
                            <p
                              className={`${
                                isOwner ? "text-blue-100" : "text-gray-500"
                              } truncate text-xs italic pl-4`}
                            >
                              "{msg.replyToText || "Original message"}"
                            </p>
                          </div>
                        )}

                        {editingMessage === msg.id ? (
                          <div className="space-y-3 px-3 py-2 sm:px-4 sm:py-3">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="w-full bg-transparent border-none resize-none focus:outline-none text-sm min-h-[60px]"
                              autoFocus
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-full text-xs transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {renderMessageContent(msg)}
                            {msg.edited && (
                              <p
                                className={`text-xs mt-2 italic ${
                                  isOwner ? "text-blue-200" : "text-gray-400"
                                } ${msg.isCode ? "px-4" : ""}`}
                              >
                                Edited {formatTime(msg.editedAt)}
                              </p>
                            )}
                          </>
                        )}

                        {editingMessage !== msg.id && (
                          <div className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="flex space-x-1 bg-white rounded-full shadow-lg border border-gray-200 p-1">
                              <button
                                onClick={() => startReply(msg)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                title="Reply to this message"
                              >
                                <svg
                                  className="w-3 h-3 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                  />
                                </svg>
                              </button>
                              {!isOwner && (
                                <button
                                  onClick={() => sendPrivateInvite(msg)}
                                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                  title="Invite to private chat"
                                >
                                  <svg
                                    className="w-3 h-3 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                  </svg>
                                </button>
                              )}
                              {isOwner && (
                                <>
                                  <button
                                    onClick={() => startEdit(msg)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Edit message"
                                  >
                                    <svg
                                      className="w-3 h-3 text-gray-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete message"
                                  >
                                    <svg
                                      className="w-3 h-3 text-red-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-xs text-gray-400 mt-1 ${
                          isOwner ? "text-right mr-1" : "ml-1"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="bg-white/95 backdrop-blur-xl border-t border-blue-100/50 p-3 sm:p-4 relative rounded-t-2xl mx-2 mb-2 shadow-lg shadow-blue-100/20">
        {replyingTo && (
          <div className="max-w-4xl mx-auto mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <svg
                className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-blue-800">
                  Replying to {replyingTo.userDisplayName || "Someone"}
                </p>
                <p className="text-xs text-blue-600 truncate">
                  "{replyingTo.text || "Original message"}"
                </p>
              </div>
            </div>
            <button
              onClick={cancelReply}
              className="ml-2 p-1 hover:bg-blue-100 rounded-full transition-colors flex-shrink-0"
            >
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        {showStickerPicker && (
          <div className="absolute bottom-20 sm:bottom-24 right-4 sm:right-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 grid grid-cols-6 sm:grid-cols-8 gap-2 w-80 max-h-64 overflow-y-auto z-50">
            {STICKER_EMOJIS.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addSticker(emoji)}
                className="text-2xl hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center w-12 h-12"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        {showGifPicker && (
          <div className="absolute bottom-20 sm:bottom-24 right-4 sm:right-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 max-h-64 overflow-y-auto z-50">
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_GIFS.map((gifUrl, index) => (
                <button
                  key={index}
                  onClick={() => addGif(gifUrl)}
                  className="hover:opacity-80 transition-opacity rounded-lg overflow-hidden"
                >
                  <img
                    src={gifUrl}
                    alt={`GIF ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    replyingTo
                      ? `Reply to ${replyingTo.userDisplayName || "Someone"}...`
                      : "Type your message..."
                  }
                  rows="1"
                  className="w-full resize-none bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-blue-300 rounded-3xl px-6 py-4 pr-32 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm placeholder-gray-500 shadow-inner"
                  style={{ minHeight: "52px", maxHeight: "120px" }}
                />

                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setShowStickerPicker(!showStickerPicker);
                      setShowGifPicker(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Stickers"
                  >
                    <span className="text-lg">🎭</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowGifPicker(!showGifPicker);
                      setShowStickerPicker(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-xs font-bold text-gray-600"
                    title="GIFs"
                  >
                    GIF
                  </button>

                  {input.trim() && (
                    <button
                      onClick={sendMessage}
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 px-2">
            <p className="text-xs text-gray-400">
              Press Enter to send, Shift + Enter for new line
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>{input.length}/1000</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}