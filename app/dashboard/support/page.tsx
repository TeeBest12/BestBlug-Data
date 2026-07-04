"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Phone, Send, Sparkles, User, ShieldCheck } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "admin" | "system";
  text: string;
  timestamp: string;
  userEmail: string;
}

const DEFAULT_CHATS: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "system",
    text: "Welcome to BestBlug Premium Live Support! 🛡️ Our agents are online and ready to assist you in real-time.",
    timestamp: "10:00 AM",
    userEmail: "all",
  },
  {
    id: "welcome-2",
    sender: "admin",
    text: "Hello! Thank you for contacting BestBlug. If you have any questions regarding pending wallet funding, failed data delivery, or billing, please send us a message here.",
    timestamp: "10:01 AM",
    userEmail: "all",
  }
];

export default function SupportPage() {
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // Get current logged-in user
    const savedUser = localStorage.getItem("datasub_user");
    let currentEmail = "user@example.com";
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.email) {
          currentEmail = parsed.email;
          setUserEmail(parsed.email);
        }
      } catch (e) {}
    }

    // Load or initialize chat messages
    const savedChats = localStorage.getItem("datasub_live_chats");
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setMessages(parsed);
      } catch (e) {
        setMessages(DEFAULT_CHATS);
      }
    } else {
      // Setup default chats for this user
      const initialChats = DEFAULT_CHATS.map(m => ({ ...m, userEmail: currentEmail }));
      setMessages(initialChats);
      localStorage.setItem("datasub_live_chats", JSON.stringify(initialChats));
    }
  }, []);

  // Sync messages periodically to simulate "real-time" if admin responds in another tab
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const savedChats = localStorage.getItem("datasub_live_chats");
      if (savedChats) {
        try {
          const parsed = JSON.parse(savedChats);
          if (JSON.stringify(parsed) !== JSON.stringify(messages)) {
            setMessages(parsed);
          }
        } catch (e) {}
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, messages]);

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: newMessage.trim(),
      timestamp: timeStr,
      userEmail: userEmail,
    };

    const updatedChats = [...messages, userMsg];
    setMessages(updatedChats);
    localStorage.setItem("datasub_live_chats", JSON.stringify(updatedChats));
    setNewMessage("");

    // Simulate instant agent automatic response after 1 second if no admin has active custom reply
    setTimeout(() => {
      const latestChats = JSON.parse(localStorage.getItem("datasub_live_chats") || "[]");
      // Only trigger auto-reply if the last message is still the user's message
      if (latestChats.length > 0 && latestChats[latestChats.length - 1].sender === "user") {
        const autoReply: ChatMessage = {
          id: "reply-" + Date.now(),
          sender: "system",
          text: "🔄 Message Dispatched! Your ticket is active. An online support representative has been notified and will reply to this chat window immediately.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          userEmail: userEmail,
        };
        const nextChats = [...latestChats, autoReply];
        setMessages(nextChats);
        localStorage.setItem("datasub_live_chats", JSON.stringify(nextChats));
      }
    }, 1200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !ticketMessage) return;

    setTicketStatus("Ticket created successfully! Our team is reviewing your report.");
    setSubject("");
    setTicketMessage("");
    setTimeout(() => setTicketStatus(null), 4000);
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Support Systems...
        </div>
      </main>
    );
  }

  // Filter messages specifically for the logged-in user
  const userMessages = messages.filter(
    (m) => m.userEmail === userEmail || m.userEmail === "all"
  );

  return (
    <main className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B0F19] px-4 py-8 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Support Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column: Quick Channels & Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <section className="rounded-2xl bg-white dark:bg-[#111827] p-5 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">Support Channels</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 mb-4">
                Reach us via traditional channels for general help or WhatsApp inquiries.
              </p>

              <div className="space-y-3">
                <a
                  href="tel:+2348000000000"
                  className="flex items-center gap-3.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 tracking-tight">Voice Call Support</p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">+234 800 000 0000</p>
                  </div>
                </a>

                <a
                  href="mailto:support@datasub.com"
                  className="flex items-center gap-3.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 tracking-tight">Official Email</p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">support@datasub.com</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/2348000000000"
                  className="flex items-center gap-3.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 hover:border-green-500 transition-colors cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/40">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 tracking-tight">Instant WhatsApp</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">Tap to chat with us</p>
                  </div>
                </a>
              </div>
            </section>

            {/* Support Ticket Form */}
            <section className="rounded-2xl bg-white dark:bg-[#111827] p-5 border border-slate-200 dark:border-slate-800/80 shadow-sm transition-colors duration-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Submit Help Ticket</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">Our back-office team will review your ticket within 24 hours.</p>

              {ticketStatus && (
                <div className="mb-3.5 p-2.5 rounded bg-green-50 border border-green-200 text-[10px] font-bold text-green-700 uppercase tracking-tight">
                  {ticketStatus}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Failed MTN transaction"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500 dark:text-white transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Detailed Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the issue with your receipt ID..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-xs font-medium outline-none focus:border-blue-500 dark:text-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white py-2.5 text-xs font-black uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Submit Ticket
                </button>
              </form>
            </section>
          </div>

          {/* Right Column: Live Chat Interface (7 cols) */}
          <div className="lg:col-span-7">
            <section className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col h-[520px] overflow-hidden transition-colors duration-200">
              {/* Chat Header */}
              <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border-2 border-white shadow-sm">
                      <Sparkles size={16} className="text-yellow-300" />
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-slate-900 animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black uppercase tracking-wider">BestBlug Support</h3>
                      <span className="bg-blue-600/50 px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-widest text-blue-100">
                        Agent Online
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-semibold truncate max-w-[200px]">
                      Chatting as: <span className="font-mono text-blue-300">{userEmail}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none">Response Time</span>
                  <span className="text-[10px] text-green-400 font-bold uppercase mt-0.5 leading-none">Instant</span>
                </div>
              </div>

              {/* Chat Message Box */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/55 space-y-3 transition-colors duration-200">
                {userMessages.map((msg) => {
                  const isUser = msg.sender === "user";
                  const isSystem = msg.sender === "system";

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-2 animate-fade-in">
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-center max-w-[85%] shadow-sm">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 max-w-[80%] animate-fade-in ${
                        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {/* Avatar */}
                      <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-white ${
                        isUser ? "bg-blue-600" : "bg-slate-800"
                      }`}>
                        {isUser ? <User size={12} /> : <ShieldCheck size={12} className="text-yellow-300" />}
                      </div>

                      <div className="space-y-1">
                        <div className={`rounded-2xl px-3.5 py-2 text-xs font-medium ${
                          isUser
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm"
                        }`}>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <p className={`text-[9px] font-bold text-slate-400 uppercase tracking-tight ${
                          isUser ? "text-right" : "text-left"
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Send Form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex gap-2 transition-colors duration-200">
                <input
                  type="text"
                  placeholder="Type your support message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 dark:text-white dark:focus:bg-[#111827] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-9 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
                  title="Send Message"
                >
                  <Send size={15} />
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}