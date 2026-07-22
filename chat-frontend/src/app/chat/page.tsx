"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getProfile, logout, updateProfile } from "@/services/auth.service";
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  searchUsers, 
  createConversation,
  createGroupConversation,
  getConversationMembers,
  markConversationAsRead,
  deleteMessage,
  deleteMessagesBatch,
  Conversation, 
  Message, 
  UserProfile 
} from "@/services/chat.service";
import { AuthUser } from "@/types/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Search, 
  Send, 
  MessageSquare, 
  UserPlus, 
  Loader2, 
  Settings, 
  X, 
  Paperclip, 
  MapPin, 
  Image as ImageIcon, 
  FileText, 
  Download, 
  Compass, 
  Hash,
  XCircle,
  FileDown,
  Play,
  Pause,
  Mic,
  Trash2,
  Check,
  ArrowLeft,
  ListChecks,
  Users,
  Sun,
  Moon,
  Palette
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socket";

export type ThemePaletteId = "indigo" | "emerald" | "sunset" | "violet" | "ocean" | "crimson";

export interface ThemePalette {
  id: ThemePaletteId;
  name: string;
  gradientClass: string;
  btnGradientClass: string;
  previewGradient: string;
  glowShadow: string;
  darkPageBg: string;
  lightPageBg: string;
}

export const THEME_PALETTES: Record<ThemePaletteId, ThemePalette> = {
  indigo: {
    id: "indigo",
    name: "Royal Indigo",
    gradientClass: "bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600",
    btnGradientClass: "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white",
    previewGradient: "from-indigo-600 via-indigo-700 to-purple-600",
    glowShadow: "shadow-indigo-600/25",
    darkPageBg: "bg-gradient-to-br from-slate-950 via-zinc-950 to-indigo-950/40",
    lightPageBg: "bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50"
  },
  emerald: {
    id: "emerald",
    name: "Cyber Emerald",
    gradientClass: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600",
    btnGradientClass: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white",
    previewGradient: "from-emerald-600 via-teal-600 to-cyan-600",
    glowShadow: "shadow-emerald-600/25",
    darkPageBg: "bg-gradient-to-br from-zinc-950 via-slate-950 to-emerald-950/40",
    lightPageBg: "bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50"
  },
  sunset: {
    id: "sunset",
    name: "Sunset Flare",
    gradientClass: "bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600",
    btnGradientClass: "bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white",
    previewGradient: "from-rose-600 via-orange-600 to-amber-600",
    glowShadow: "shadow-rose-600/25",
    darkPageBg: "bg-gradient-to-br from-zinc-950 via-slate-950 to-rose-950/40",
    lightPageBg: "bg-gradient-to-br from-rose-50/70 via-orange-50/40 to-slate-50"
  },
  violet: {
    id: "violet",
    name: "Midnight Fuchsia",
    gradientClass: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600",
    btnGradientClass: "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white",
    previewGradient: "from-purple-600 via-fuchsia-600 to-pink-600",
    glowShadow: "shadow-purple-600/25",
    darkPageBg: "bg-gradient-to-br from-slate-950 via-zinc-950 to-purple-950/40",
    lightPageBg: "bg-gradient-to-br from-purple-50/70 via-fuchsia-50/40 to-slate-50"
  },
  ocean: {
    id: "ocean",
    name: "Ocean Sapphire",
    gradientClass: "bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500",
    btnGradientClass: "bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white",
    previewGradient: "from-blue-600 via-sky-600 to-cyan-500",
    glowShadow: "shadow-blue-600/25",
    darkPageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40",
    lightPageBg: "bg-gradient-to-br from-sky-50/70 via-blue-50/40 to-slate-50"
  },
  crimson: {
    id: "crimson",
    name: "Crimson Ruby",
    gradientClass: "bg-gradient-to-r from-red-600 via-rose-700 to-pink-700",
    btnGradientClass: "bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white",
    previewGradient: "from-red-600 via-rose-700 to-pink-700",
    glowShadow: "shadow-red-600/25",
    darkPageBg: "bg-gradient-to-br from-zinc-950 via-slate-950 to-red-950/40",
    lightPageBg: "bg-gradient-to-br from-red-50/70 via-rose-50/40 to-slate-50"
  }
};

// Voice Message player component for premium inline audio rendering
function VoiceMessagePlayer({ src, isCurrentUser }: { src: string; isCurrentUser: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (audio.duration === Infinity) {
        // WebM Infinity duration hack: seek to end to calculate, then seek back
        audio.currentTime = 1e9;
        const tempTimeUpdate = () => {
          if (audio.duration && audio.duration !== Infinity && !isNaN(audio.duration)) {
            setDuration(audio.duration);
            audio.currentTime = 0;
            audio.removeEventListener("timeupdate", tempTimeUpdate);
          }
        };
        audio.addEventListener("timeupdate", tempTimeUpdate);
      } else if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time) || time < 0) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const getPercentage = () => {
    const dur = duration && isFinite(duration) ? duration : 0;
    if (dur === 0) return 0;
    return (currentTime / dur) * 100;
  };

  return (
    <div className="flex items-center gap-3 p-3 min-w-[245px] max-w-[290px] select-none">
      <audio 
        ref={audioRef} 
        src={src} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-all active:scale-95 border ${
          isCurrentUser
            ? "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border-primary-foreground/20"
            : "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
        }`}
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4.5 w-4.5 fill-current" />
        ) : (
          <Play className="h-4.5 w-4.5 fill-current translate-x-0.5" />
        )}
      </Button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <input 
          type="range"
          min={0}
          max={duration && isFinite(duration) ? duration : 100}
          value={currentTime}
          onChange={handleSliderChange}
          className={`w-full h-1 rounded-lg appearance-none cursor-pointer accent-current ${
            isCurrentUser
              ? "text-primary-foreground"
              : "text-primary"
          }`}
          style={{ 
            outline: 'none',
            background: isCurrentUser
              ? `linear-gradient(to right, currentColor ${getPercentage()}%, rgba(255,255,255,0.2) ${getPercentage()}%)`
              : `linear-gradient(to right, hsl(var(--primary)) ${getPercentage()}%, rgba(120,120,120,0.15) ${getPercentage()}%)`
          }}
        />
        <div className="flex items-center justify-between text-[9px] opacity-75 font-semibold">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration && isFinite(duration) ? duration : 0)}</span>
        </div>
      </div>

      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
        isCurrentUser 
          ? "bg-primary-foreground/10 text-primary-foreground" 
          : "bg-primary/10 text-primary"
      }`}>
        {isPlaying ? (
          <div className="flex gap-0.5 items-center justify-center h-4">
            <span className="h-3 w-0.5 bg-current animate-pulse" style={{ animationDuration: '0.4s' }} />
            <span className="h-4.5 w-0.5 bg-current animate-pulse" style={{ animationDuration: '0.3s', animationDelay: '0.1s' }} />
            <span className="h-3 w-0.5 bg-current animate-pulse" style={{ animationDuration: '0.5s', animationDelay: '0.2s' }} />
          </div>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </div>
    </div>
  );
}

const getMediaUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // If url is a local browser blob or data URI preview
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  // Determine production backend base URL
  const backendBase = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : typeof window !== "undefined"
    ? `http://${window.location.hostname}:5000`
    : "http://localhost:5000";

  // Strip legacy localhost:5000 / 127.0.0.1:5000 prefixes if present
  let cleanUrl = url
    .replace(/^https?:\/\/localhost:5000/, "")
    .replace(/^https?:\/\/127\.0\.0\.1:5000/, "");

  // If cleanUrl is relative path (/uploads/...)
  if (cleanUrl.startsWith("/")) {
    return `${backendBase}${cleanUrl}`;
  }

  // If cleanUrl starts with uploads/
  if (cleanUrl.startsWith("uploads/")) {
    return `${backendBase}/${cleanUrl}`;
  }

  // If it's already an absolute external HTTP/HTTPS URL
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `${backendBase}/${cleanUrl}`;
};

export default function ChatDashboard() {
  const router = useRouter();
  
  // Theme & Appearance states (using next-themes)
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeMode: "dark" | "light" = mounted 
    ? ((resolvedTheme || theme) === "light" ? "light" : "dark") 
    : "dark";

  const [activePaletteId, setActivePaletteId] = useState<ThemePaletteId>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme_palette") as ThemePaletteId) || "indigo";
    }
    return "indigo";
  });

  const currentPalette = THEME_PALETTES[activePaletteId] || THEME_PALETTES.indigo;

  const handleSelectPalette = (id: ThemePaletteId) => {
    setActivePaletteId(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme_palette", id);
    }
  };

  const handleToggleThemeMode = () => {
    const nextMode = themeMode === "dark" ? "light" : "dark";
    setTheme(nextMode);
  };

  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Chat states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Delete Message & Multi-Select states
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<number[]>([]);

  // Create Group Chat states
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGroupMembersModalOpen, setIsGroupMembersModalOpen] = useState(false);
  const [groupMembersList, setGroupMembersList] = useState<UserProfile[]>([]);
  const [isLoadingGroupMembers, setIsLoadingGroupMembers] = useState(false);
  const [inspectedUser, setInspectedUser] = useState<UserProfile | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedActionMessage, setSelectedActionMessage] = useState<Message | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedGroupUserIds, setSelectedGroupUserIds] = useState<number[]>([]);
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState<UserProfile[]>([]);
  const [isSearchingGroupUsers, setIsSearchingGroupUsers] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Profile Modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "appearance">("profile");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [profileAvatarPreview, setProfileAvatarPreview] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Attachments states
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // Voice Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const shouldSendRef = useRef(true);
  const [attachedFilePreview, setAttachedFilePreview] = useState("");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Real-time online/typing states
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("Someone");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isCurrentlyTypingRef = useRef(false);

  // Lightbox Modal states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Loading states
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Load User Profile and Conversations
  useEffect(() => {
    const initData = async () => {
      try {
        const profile = await getProfile();
        setCurrentUser(profile);
        setProfileName(profile.name);
        setProfileEmail(profile.email);
        setAuthLoading(false);
        
        await fetchConversations();
      } catch (err) {
        console.error("Failed to authenticate:", err);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };
    initData();
  }, [router]);

  // Handle outside click to close search dropdown and attach menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fetch conversations
  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) {
        setConversationsLoading(true);
      }
      const data = await getConversations();
      const uniqueData = Array.from(new Map((data || []).map((c: Conversation) => [c.id, c])).values());
      setConversations(uniqueData);
      return uniqueData;
    } catch (err) {
      console.error("Failed to load conversations:", err);
      toast.error("Failed to load conversations");
      return [];
    } finally {
      if (!silent) {
        setConversationsLoading(false);
      }
    }
  };

  // Sync refs to avoid stale closures in event listeners
  const activeConversationRef = useRef(activeConversation);
  const currentUserRef = useRef(currentUser);
  const messagesRef = useRef(messages);
  
  useEffect(() => {
    activeConversationRef.current = activeConversation;
    setIsOtherUserTyping(false);
  }, [activeConversation]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Handle Socket.io lifecycle and event registrations
  useEffect(() => {
    if (!currentUser) return;

    const socketInstance = initSocket();
    socketInstance.connect();

    socketInstance.on("connect", () => {
      console.log("WebSocket connected. Requesting online directory.");
      socketInstance.emit("get_online_users");
      const activeConv = activeConversationRef.current;
      if (activeConv) {
        socketInstance.emit("join_conversation", activeConv.id);
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
      toast.error(`Real-time connection error: ${err.message}`);
    });

    socketInstance.on("online_users_list", (users: number[]) => {
      setOnlineUsers(users);
    });

    socketInstance.on("user_status_change", (data: { userId: number; status: string }) => {
      setOnlineUsers((prev) => {
        if (data.status === "online") {
          return prev.includes(data.userId) ? prev : [...prev, data.userId];
        } else {
          return prev.filter((id) => id !== data.userId);
        }
      });
    });

    socketInstance.on("new_message", (message: Message) => {
      const activeConv = activeConversationRef.current;
      if (activeConv && message.conversation_id === activeConv.id) {
        // Message belongs to the active conversation -> Append to list
        setMessages((prev) => {
          // If we already have this message by its database ID, ignore it
          if (prev.some((m) => m.id === message.id)) return prev;

          // If this is a message we sent and there is an optimistic temp- message, swap it
          const hasOptimistic = prev.some((m) => String(m.id).startsWith("temp-"));
          if (hasOptimistic && Number(message.sender_id) === Number(currentUserRef.current?.id)) {
            let replaced = false;
            return prev.map((m) => {
              if (String(m.id).startsWith("temp-") && !replaced) {
                replaced = true;
                return message;
              }
              return m;
            });
          }

          return [...prev, message];
        });
        setTimeout(scrollToBottom, 50);

        // Mark as read instantly on backend since we are actively viewing the chat!
        markConversationAsRead(activeConv.id).catch((err) => console.error("Error marking msg as read:", err));

        // Update local sidebar state with zero unread count
        setConversations((prev) => 
          prev.map((c) => 
            c.id === message.conversation_id 
              ? { 
                  ...c, 
                  unread_count: 0,
                  latest_message: message.message_type === "text" 
                    ? message.content 
                    : message.message_type === "location" 
                      ? "Shared location 📍" 
                      : `Shared attachment 📎`,
                  latest_message_created_at: message.created_at
                } 
              : c
          )
        );
      } else {
        // Message belongs to a background conversation -> Show Toast Notification
        toast(`New message from ${message.sender_name}`, {
          description: message.message_type === "text" 
            ? message.content 
            : message.message_type === "location" 
              ? "Shared a location 📍" 
              : `Shared an attachment 📎`,
          action: {
            label: "Reply",
            onClick: () => {
              fetchConversations(true).then((updatedList) => {
                const found = updatedList.find((c) => c.id === message.conversation_id);
                if (found) {
                  setActiveConversation(found);
                }
              });
            }
          }
        });

        // Increment local unread count badge
        setConversations((prev) => 
          prev.map((c) => 
            c.id === message.conversation_id 
              ? { 
                  ...c, 
                  unread_count: (c.unread_count || 0) + 1,
                  latest_message: message.message_type === "text" 
                    ? message.content 
                    : message.message_type === "location" 
                      ? "Shared location 📍" 
                      : `Shared attachment 📎`,
                  latest_message_created_at: message.created_at
                } 
              : c
          )
        );
      }
      
      // Update sidebar latest message summary and order
      fetchConversations(true);
    });

    socketInstance.on("messages_read", (data: { conversationId: number; readBy: number }) => {
      const activeConv = activeConversationRef.current;
      const isReadMatch = activeConv && (
        activeConv.is_group 
          ? Number(data.readBy) !== Number(currentUserRef.current?.id)
          : Number(data.readBy) === Number(activeConv.other_user_id)
      );
      if (activeConv && Number(data.conversationId) === Number(activeConv.id) && isReadMatch) {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.sender_id === currentUser.id ? { ...msg, is_read: true } : msg
          )
        );
      }
    });

    socketInstance.on("message_deleted", (data: { conversationId: number; messageId: number }) => {
      const activeConv = activeConversationRef.current;
      if (activeConv && Number(data.conversationId) === Number(activeConv.id)) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.messageId
              ? {
                  ...m,
                  is_deleted: true,
                  content: "This message was deleted",
                  message_type: "deleted",
                  file_url: null,
                  file_name: null,
                  file_size: null
                }
              : m
          )
        );
      }
      fetchConversations(true);
    });

    socketInstance.on("messages_deleted", (data: { conversationId: number; messageIds: number[] }) => {
      const activeConv = activeConversationRef.current;
      if (activeConv && Number(data.conversationId) === Number(activeConv.id)) {
        setMessages((prev) =>
          prev.map((m) =>
            data.messageIds.includes(m.id)
              ? {
                  ...m,
                  is_deleted: true,
                  content: "This message was deleted",
                  message_type: "deleted",
                  file_url: null,
                  file_name: null,
                  file_size: null
                }
              : m
          )
        );
      }
      fetchConversations(true);
    });

    socketInstance.on("conversation_created", (conversation: Conversation) => {
      setConversations((prev) => {
        if (prev.some((c) => c.id === conversation.id)) return prev;
        return [conversation, ...prev];
      });
      const socket = getSocket();
      if (socket) {
        socket.emit("join_conversation", conversation.id);
      }
    });

    socketInstance.on("typing_status", (data: { conversationId: any; userId: any; isTyping: boolean; userName?: string }) => {
      const activeConv = activeConversationRef.current;
      console.log("Typing Status Received:", data);
      if (activeConv) {
        const isMatch = Number(data.conversationId) === Number(activeConv.id) && (
          activeConv.is_group 
            ? Number(data.userId) !== Number(currentUserRef.current?.id)
            : Number(data.userId) === Number(activeConv.other_user_id)
        );
        
        console.log(`Typing Match Check: ${isMatch}`, {
          eventConvId: data.conversationId,
          activeConvId: activeConv.id,
          eventUserId: data.userId,
          activeOtherUserId: activeConv.other_user_id
        });

        if (isMatch) {
          const resolvedName = data.userName || 
            messagesRef.current.find(m => Number(m.sender_id) === Number(data.userId))?.sender_name || 
            (activeConv.is_group ? "Someone" : activeConv.other_user_name || "Someone");
          setTypingUserName(resolvedName);
          setIsOtherUserTyping(data.isTyping);
        }
      }
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("connect_error");
      socketInstance.off("online_users_list");
      socketInstance.off("user_status_change");
      socketInstance.off("new_message");
      socketInstance.off("messages_read");
      socketInstance.off("typing_status");
      disconnectSocket();
    };
  }, [currentUser]);

  // Fetch messages and handle socket room joining when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit("join_conversation", activeConversation.id);
    }

    const fetchMessages = async () => {
      try {
        setMessagesLoading(true);
        const data = await getMessages(activeConversation.id);
        setMessages(data);
        setTimeout(scrollToBottom, 50);
        
        // Mark conversation as read on the backend
        await markConversationAsRead(activeConversation.id);

        // Reset unread count locally for instant UI update
        setConversations((prev) => 
          prev.map((c) => 
            c.id === activeConversation.id ? { ...c, unread_count: 0 } : c
          )
        );
        fetchConversations(true);
      } catch (err) {
        console.error("Failed to load messages:", err);
        toast.error("Failed to load messages");
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (socketInstance) {
        socketInstance.emit("leave_conversation", activeConversation.id);
      }
    };
  }, [activeConversation]);

  // Scroll to bottom when typing status changes to true
  useEffect(() => {
    if (isOtherUserTyping) {
      setTimeout(scrollToBottom, 50);
    }
  }, [isOtherUserTyping]);

  // Scroll messages to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  // Search for users
  useEffect(() => {
    const triggerSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        setIsSearching(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      triggerSearch();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Search for group members
  useEffect(() => {
    if (!isGroupModalOpen) return;
    const triggerGroupSearch = async () => {
      try {
        setIsSearchingGroupUsers(true);
        const results = await searchUsers(groupSearchQuery);
        const filtered = results.filter((u) => u.id !== currentUser?.id);
        setGroupSearchResults(filtered);
      } catch (err) {
        console.error("Failed to search group users:", err);
      } finally {
        setIsSearchingGroupUsers(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      triggerGroupSearch();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [groupSearchQuery, isGroupModalOpen, currentUser]);

  const handleToggleGroupUserSelect = (userId: number) => {
    setSelectedGroupUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (selectedGroupUserIds.length === 0) {
      toast.error("Please select at least one participant");
      return;
    }

    try {
      setIsCreatingGroup(true);
      const res = await createGroupConversation(
        newGroupName.trim(),
        newGroupDescription.trim(),
        selectedGroupUserIds
      );

      toast.success(`Group "${newGroupName}" created!`);
      setIsGroupModalOpen(false);
      
      // Update local sidebar
      await fetchConversations(true);

      // Instantly open the newly created group chat
      setActiveConversation(res.conversation);
    } catch (err) {
      console.error("Failed to create group:", err);
      toast.error("Failed to create group conversation");
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleShowGroupMembers = async () => {
    if (!activeConversation) return;
    try {
      setIsLoadingGroupMembers(true);
      setIsGroupMembersModalOpen(true);
      const res = await getConversationMembers(activeConversation.id);
      setGroupMembersList(res.members);
    } catch (err) {
      console.error("Failed to load group members:", err);
      toast.error("Failed to retrieve group members");
      setIsGroupMembersModalOpen(false);
    } finally {
      setIsLoadingGroupMembers(false);
    }
  };

  const handleInspectUserProfile = (id: number, name: string, email: string, avatarUrl?: string | null) => {
    setInspectedUser({
      id,
      name,
      email,
      avatar_url: avatarUrl || null
    });
    setIsInspectModalOpen(true);
  };

  // Start a new conversation
  const handleStartChat = async (user: UserProfile) => {
    try {
      const res = await createConversation(user.id);
      
      // Update local conversations list
      await fetchConversations(true);
      
      // Construct a conversation object to select it
      const selectedConv: Conversation = {
        id: res.conversation.id,
        created_at: "",
        updated_at: "",
        other_user_id: user.id,
        other_user_name: user.name,
        other_user_email: user.email,
        other_user_avatar_url: user.avatar_url || null,
        latest_message: null,
        latest_message_created_at: null
      };
      
      setActiveConversation(selectedConv);
      setSearchQuery("");
      setShowSearchDropdown(false);
    } catch (err: any) {
      console.error("Error creating chat:", err);
      toast.error(err.response?.data?.message || "Failed to start chat");
    }
  };

  // Handle text input typing and emit typing status over socket
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewMessage(val);

    if (!activeConversation) return;
    const socketInstance = getSocket();
    if (!socketInstance) return;

    // Clear existing inactivity timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // If value is empty, emit stop typing immediately and reset typing ref
    if (val.trim() === "") {
      if (isCurrentlyTypingRef.current) {
        socketInstance.emit("typing_stop", {
          conversationId: activeConversation.id
        });
        isCurrentlyTypingRef.current = false;
      }
      return;
    }

    // Emit typing_start only ONCE when they begin typing, rather than on every keystroke
    if (!isCurrentlyTypingRef.current) {
      socketInstance.emit("typing_start", {
        conversationId: activeConversation.id,
        userName: currentUser?.name || "Someone"
      });
      isCurrentlyTypingRef.current = true;
    }

    // Set new timeout to emit typing_stop after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketInstance.emit("typing_stop", {
        conversationId: activeConversation.id
      });
      isCurrentlyTypingRef.current = false;
    }, 1500);
  };

  // Start recording audio
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // Stop all audio tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());

        if (audioChunksRef.current.length === 0) return;

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        // Only send if we didn't cancel
        if (shouldSendRef.current) {
          const audioFile = new File([audioBlob], "voice-message.webm", { type: "audio/webm" });
          
          try {
            setSendingMessage(true);
            const messageObj = await sendMessage(activeConversation!.id, "Voice Message", audioFile, "audio");
            
            // Append message locally, check for socket event race conditions
            setMessages((prev) => {
              if (prev.some((m) => m.id === messageObj.id)) return prev;
              return [...prev, {
                ...messageObj,
                sender_name: currentUser!.name,
                sender_email: currentUser!.email
              }];
            });
            
            setTimeout(scrollToBottom, 50);
            fetchConversations(true);
          } catch (err) {
            console.error("Error sending voice message:", err);
            toast.error("Failed to send voice message");
          } finally {
            setSendingMessage(false);
          }
        }
      };

      shouldSendRef.current = true;
      recorder.start(250); // get slice every 250ms
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start duration timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Failed to access microphone:", err);
      toast.error("Microphone access denied or not available");
    }
  };

  // Stop and send audio recording
  const handleStopAndSendRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;
    shouldSendRef.current = true;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  // Cancel audio recording
  const handleCancelRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;
    shouldSendRef.current = false;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  // Send message with text and/or file attachments
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !currentUser) return;
    if (!newMessage.trim() && !attachedFile) return;
    const text = newMessage.trim();
    const file = attachedFile;

    if (!text && !file) return;

    try {
      // Only set loading/disable state for files (which take time to upload)
      if (file) {
        setSendingMessage(true);
      }

      // Clear inputs and refocus text box instantly for high-fidelity responsive UX
      setNewMessage("");
      setAttachedFile(null);
      setAttachedFilePreview("");
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 10);

      // Stop typing immediately
      const socketInstance = getSocket();
      if (socketInstance) {
        socketInstance.emit("typing_stop", {
          conversationId: activeConversation.id
        });
      }
      isCurrentlyTypingRef.current = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Optimistically append the message to the list immediately
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: Message = {
        id: tempId as any,
        conversation_id: activeConversation.id,
        sender_id: currentUser.id,
        content: text || (file ? file.name : ""),
        message_type: file ? (file.type.startsWith("image/") ? "image" as const : "file" as const) : "text" as const,
        file_url: file ? URL.createObjectURL(file) : null,
        file_name: file ? file.name : null,
        file_size: file ? file.size : null,
        is_read: false,
        created_at: new Date().toISOString(),
        sender_name: currentUser.name,
        sender_email: currentUser.email
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setTimeout(scrollToBottom, 50);

      // Send to server in background
      const messageObj = await sendMessage(activeConversation.id, text, file);
      
      // Swap optimistic message with the database message
      setMessages((prev) => 
        prev.map((m) => String(m.id) === tempId ? {
          ...messageObj,
          sender_name: currentUser.name,
          sender_email: currentUser.email
        } : m)
      );
      
      setTimeout(scrollToBottom, 50);
      fetchConversations(true);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 10);
    }
  };

  // Handle Location Sharing
  const handleShareLocation = () => {
    if (!activeConversation || !currentUser) return;
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          const messageObj = await sendMessage(
            activeConversation.id, 
            JSON.stringify(coords), 
            null, 
            "location"
          );
          
          // Append location message locally, check for socket event race conditions
          setMessages((prev) => {
            if (prev.some((m) => m.id === messageObj.id)) return prev;
            return [...prev, {
              ...messageObj,
              sender_name: currentUser.name,
              sender_email: currentUser.email
            }];
          });
          
          setTimeout(scrollToBottom, 50);
          fetchConversations(true);
          toast.success("Location shared successfully");
        } catch (err) {
          console.error("Error sending location:", err);
          toast.error("Failed to send location");
        } finally {
          setIsLocationLoading(false);
        }
      },
      (err: GeolocationPositionError) => {
        console.error("Location error:", err.code, err.message);
        setIsLocationLoading(false);
        
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please click the lock icon 🔒 in your browser address bar to allow Location access.");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error("Location unavailable. Please turn on Location/GPS in your Windows system settings.");
        } else if (err.code === err.TIMEOUT) {
          toast.error("Location request timed out. Please try again.");
        } else {
          toast.error("Unable to retrieve location. Please check your browser location permissions.");
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
    );
  };

  // Handle Attachment Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size cannot exceed 25MB");
      return;
    }

    setAttachedFile(file);
    if (file.type.startsWith("image/")) {
      setAttachedFilePreview(URL.createObjectURL(file));
    } else {
      setAttachedFilePreview("");
    }
  };

  // Handle Profile Update Submission
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setIsSavingProfile(true);
      const formData = new FormData();
      formData.append("name", profileName);
      formData.append("email", profileEmail);
      if (profileAvatarFile) {
        formData.append("avatar", profileAvatarFile);
      }

      const updatedUser = await updateProfile(formData);
      setCurrentUser(updatedUser);
      setIsProfileModalOpen(false);
      toast.success("Profile updated successfully!");
      fetchConversations(true);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Helper to check if message was created within the last 3 hours
  const isWithin3Hours = (createdAt: string) => {
    const messageTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const threeHoursInMs = 3 * 60 * 60 * 1000;
    return (currentTime - messageTime) < threeHoursInMs;
  };

  // Toggle message selection in multi-select mode
  const handleToggleSelectMessage = (msgId: number) => {
    setSelectedMessageIds((prev) => {
      if (prev.includes(msgId)) {
        return prev.filter((id) => id !== msgId);
      } else {
        return [...prev, msgId];
      }
    });
  };

  // Trigger Selection Mode
  const handleStartSelectionMode = (msg: Message) => {
    setIsSelectionMode(true);
    setSelectedMessageIds([msg.id]);
  };

  // Exit Selection Mode
  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedMessageIds([]);
  };

  // Batch delete selected messages
  const handleConfirmBatchDeleteMessages = async () => {
    if (selectedMessageIds.length === 0) return;
    const idsToDelete = [...selectedMessageIds];
    
    try {
      // 1. Optimistic updates
      setMessages((prev) =>
        prev.map((m) =>
          idsToDelete.includes(m.id)
            ? {
                ...m,
                is_deleted: true,
                content: "This message was deleted",
                message_type: "deleted",
                file_url: null,
                file_name: null,
                file_size: null
              }
            : m
        )
      );

      // 2. Reset selection mode
      handleCancelSelection();

      // 3. Dispatch batch API call
      await deleteMessagesBatch(idsToDelete);
      toast.success("Messages deleted");
    } catch (err) {
      console.error("Failed to batch delete messages:", err);
      toast.error("Failed to delete selected messages");

      // Revert if failed
      if (activeConversation) {
        getMessages(activeConversation.id).then(setMessages).catch(console.error);
      }
    }
  };

  // Handle Delete Message Triggers
  const handleDeleteMessageClick = (msg: Message) => {
    setMessageToDelete(msg);
  };

  const handleConfirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    const msgId = messageToDelete.id;
    try {
      // 1. Perform optimistic state updates locally
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? {
                ...m,
                is_deleted: true,
                content: "This message was deleted",
                message_type: "deleted",
                file_url: null,
                file_name: null,
                file_size: null
              }
            : m
        )
      );

      // 2. Clear state modal
      setMessageToDelete(null);

      // 3. Dispatch delete request to API server in background
      await deleteMessage(msgId);
      toast.success("Message deleted");
    } catch (err) {
      console.error("Failed to delete message:", err);
      toast.error("Failed to delete message");
      
      // Revert changes on failure
      if (activeConversation) {
        getMessages(activeConversation.id).then(setMessages).catch(console.error);
      }
    }
  };

  // Handle Profile Avatar Selection
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Avatar must be an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image size cannot exceed 5MB");
      return;
    }

    setProfileAvatarFile(file);
    setProfileAvatarPreview(URL.createObjectURL(file));
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      toast.success("Successfully logged out");
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      toast.error("Logout failed");
    }
  };

  // Helper to get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Helper to generate random color themes for avatars
  const getAvatarThemeClass = (name: string) => {
    const code = name.charCodeAt(0) % 5;
    const themes = [
      "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
      "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
      "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
    ];
    return themes[code];
  };

  // Helper to format file size
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm animate-pulse">Initializing premium workspace...</p>
      </div>
    );
  }

  return (
    <main className={`h-dvh w-full flex flex-col overflow-hidden select-none font-sans transition-all duration-500 ${
      themeMode === "dark" 
        ? `${currentPalette.darkPageBg} text-foreground` 
        : `${currentPalette.lightPageBg} text-slate-900`
    }`}>
      <div className="w-full flex-1 min-h-0 flex overflow-hidden relative">
        
        {/* SIDEBAR */}
        <section className={`h-full border-r border-border flex flex-col z-10 bg-card/10 backdrop-blur-md shrink-0 transition-all duration-200 ${
          activeConversation ? "hidden md:flex md:w-80" : "w-full md:w-80 flex"
        }`}>
          {/* Header (Profile Details, Settings & Logout) */}
          <header className={`p-4 flex items-center justify-between shrink-0 backdrop-blur-xl z-10 transition-colors duration-300 ${
            themeMode === "dark" 
              ? "bg-gradient-to-r from-slate-900/90 via-zinc-900/95 to-slate-900/90 border-b border-border/40 text-foreground" 
              : "bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 border-b border-slate-200/80 text-slate-900 shadow-sm"
          }`}>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                {currentUser?.avatar_url ? (
                  <AvatarImage src={getMediaUrl(currentUser.avatar_url)} alt={currentUser.name} className="object-cover" />
                ) : null}
                <AvatarFallback className={`font-semibold text-sm ${getAvatarThemeClass(currentUser?.name || "User")}`}>
                  {currentUser ? getInitials(currentUser.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm truncate max-w-[110px]">{currentUser?.name}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[110px]">{currentUser?.email}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors rounded-full cursor-pointer h-9 w-9"
                onClick={() => {
                  setNewGroupName("");
                  setNewGroupDescription("");
                  setGroupSearchQuery("");
                  setSelectedGroupUserIds([]);
                  setIsGroupModalOpen(true);
                }}
                title="Create Group Chat"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-full cursor-pointer h-9 w-9"
                onClick={() => {
                  setProfileName(currentUser?.name || "");
                  setProfileEmail(currentUser?.email || "");
                  setProfileAvatarFile(null);
                  setProfileAvatarPreview(currentUser?.avatar_url || "");
                  setIsProfileModalOpen(true);
                }}
                title="Workspace Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-full cursor-pointer h-9 w-9"
                onClick={() => setIsLogoutConfirmOpen(true)}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* User Search Container */}
          <div className="p-3" ref={searchContainerRef}>
            <div className="relative">
              <Search className={`absolute left-3 top-2.5 h-4 w-4 ${themeMode === "dark" ? "text-slate-400" : "text-slate-500"}`} />
              <Input
                placeholder="Search new users..."
                className={`pl-9 h-9 text-xs rounded-xl border ${
                  themeMode === "dark" 
                    ? "bg-slate-900/60 border-slate-800 text-slate-100 placeholder:text-slate-400 focus:ring-1 focus:ring-primary/40" 
                    : "bg-white/90 border-slate-300 text-slate-900 placeholder:text-slate-500 shadow-sm focus:ring-1 focus:ring-slate-400"
                }`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
              />
              
              {/* Search dropdown */}
              <AnimatePresence>
                {showSearchDropdown && (searchQuery.trim().length > 0) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto border shadow-xl rounded-xl z-20 p-2 custom-scrollbar ${
                      themeMode === "dark" 
                        ? "bg-slate-900 border-slate-800 text-slate-100" 
                        : "bg-white border-slate-200 text-slate-900 shadow-slate-300/40"
                    }`}
                  >
                    {isSearching ? (
                      <div className="flex items-center justify-center py-4 text-xs text-muted-foreground gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleStartChat(user)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer ${
                            themeMode === "dark" ? "hover:bg-slate-800/80" : "hover:bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <Avatar className="h-8 w-8 border">
                                {user.avatar_url ? (
                                  <AvatarImage src={getMediaUrl(user.avatar_url)} alt={user.name} className="object-cover" />
                                ) : null}
                                <AvatarFallback className={`font-bold text-xs ${getAvatarThemeClass(user.name)}`}>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              {onlineUsers.includes(user.id) && (
                                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-card shadow-sm" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-xs text-foreground">{user.name}</span>
                              <span className="text-[10px] text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                          <UserPlus className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      ))
                    ) : (
                      <div className="py-4 text-center text-xs text-muted-foreground">No users found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 min-h-0 h-full custom-scrollbar overflow-y-auto">
            <div className="px-2 pb-4 space-y-1">
              <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${
                themeMode === "dark" ? "text-slate-400" : "text-slate-600 font-extrabold"
              }`}>
                Conversations
              </div>
              
              {conversationsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Loading chats...</span>
                </div>
              ) : conversations.length > 0 ? (
                <AnimatePresence initial={false}>
                  {conversations.map((conv, index) => {
                    const isActive = activeConversation?.id === conv.id;
                    return (
                      <motion.button
                        key={`conv-${conv.id}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setActiveConversation(conv)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left ${
                          isActive 
                            ? `${currentPalette.gradientClass} text-white shadow-lg ${currentPalette.glowShadow} scale-[0.99] font-medium` 
                            : themeMode === "dark"
                              ? "hover:bg-white/5 text-slate-300 hover:text-white border border-transparent"
                              : "hover:bg-slate-200/50 text-slate-800 hover:text-slate-900 border border-transparent"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="h-10 w-10 border border-border/10">
                            {conv.is_group ? (
                              conv.group_avatar_url ? (
                                <AvatarImage src={getMediaUrl(conv.group_avatar_url)} alt={conv.group_name || "Group"} className="object-cover" />
                              ) : null
                            ) : conv.other_user_avatar_url ? (
                              <AvatarImage src={getMediaUrl(conv.other_user_avatar_url)} alt={conv.other_user_name || "User"} className="object-cover" />
                            ) : null}
                            <AvatarFallback className={`font-bold text-xs ${
                              isActive 
                                ? "bg-white/20 text-white border-white/30" 
                                : getAvatarThemeClass(conv.is_group ? (conv.group_name || "Group") : (conv.other_user_name || "User"))
                            }`}>
                              {getInitials(conv.is_group ? (conv.group_name || "Group") : (conv.other_user_name || "User"))}
                            </AvatarFallback>
                          </Avatar>
                          {!conv.is_group && conv.other_user_id && onlineUsers.includes(conv.other_user_id) && (
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-card shadow-sm" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold text-xs truncate ${
                              isActive 
                                ? "text-white font-bold" 
                                : themeMode === "dark" 
                                  ? "text-slate-100" 
                                  : "text-slate-900 font-bold"
                            }`}>
                              {conv.is_group ? (conv.group_name || "Group Chat") : conv.other_user_name}
                            </span>
                            {conv.latest_message_created_at && (
                              <span className={`text-[9px] ${
                                isActive 
                                  ? "text-white/90 font-medium" 
                                  : themeMode === "dark" 
                                    ? "text-slate-400" 
                                    : "text-slate-500 font-medium"
                              }`}>
                                {new Date(conv.latest_message_created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className={`text-[11px] truncate flex-1 pr-1 ${
                              isActive 
                                ? "text-white/85" 
                                : themeMode === "dark" 
                                  ? "text-slate-400" 
                                  : "text-slate-600 font-medium"
                            }`}>
                              {conv.latest_message || "No messages yet"}
                            </p>
                            {conv.unread_count !== undefined && conv.unread_count > 0 && !isActive && (
                              <span className="ml-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white animate-pulse shadow-sm shadow-red-500/25 shrink-0">
                                {conv.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3 px-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/45" />
                  <span className="text-xs text-muted-foreground">Search and select a user to start your first chat!</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </section>

        {/* CHAT MAIN CONTENT AREA */}
        <section className={`h-full flex-col z-0 relative bg-card/5 overflow-hidden transition-all duration-200 ${
          activeConversation ? "flex w-full md:flex-1" : "hidden md:flex md:flex-1"
        }`}>
          <AnimatePresence mode="wait">
            {activeConversation ? (
              <motion.div 
                key={activeConversation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full h-full flex flex-col overflow-hidden"
              >
                {/* Active Chat Header */}
                <header className={`p-4 flex items-center justify-between backdrop-blur-xl shrink-0 z-20 sticky top-0 transition-colors duration-300 ${
                  themeMode === "dark" 
                    ? "bg-gradient-to-r from-slate-900/95 via-zinc-900/90 to-slate-900/95 border-b border-border/40 text-foreground shadow-md" 
                    : "bg-gradient-to-r from-white/95 via-slate-50/95 to-white/95 border-b border-slate-200/80 text-slate-900 shadow-sm"
                }`}>
                  <div className="flex items-center gap-3">
                    {/* Back Button for Mobile layouts */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="md:hidden h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0 hover:bg-muted"
                      onClick={() => setActiveConversation(null)}
                    >
                      <ArrowLeft className="h-4.5 w-4.5" />
                    </Button>
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10 border border-border/20 shadow-sm">
                        {activeConversation.is_group ? (
                          activeConversation.group_avatar_url ? (
                            <AvatarImage src={getMediaUrl(activeConversation.group_avatar_url)} alt={activeConversation.group_name || "Group"} className="object-cover" />
                          ) : null
                        ) : activeConversation.other_user_avatar_url ? (
                          <AvatarImage src={getMediaUrl(activeConversation.other_user_avatar_url)} alt={activeConversation.other_user_name || "User"} className="object-cover" />
                        ) : null}
                        <AvatarFallback className={`font-bold text-xs ${getAvatarThemeClass(activeConversation.is_group ? (activeConversation.group_name || "Group") : (activeConversation.other_user_name || "User"))}`}>
                          {getInitials(activeConversation.is_group ? (activeConversation.group_name || "Group") : (activeConversation.other_user_name || "User"))}
                        </AvatarFallback>
                      </Avatar>
                      {!activeConversation.is_group && activeConversation.other_user_id && onlineUsers.includes(activeConversation.other_user_id) && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-card shadow-sm" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground tracking-tight">
                        {activeConversation.is_group ? (activeConversation.group_name || "Group Chat") : activeConversation.other_user_name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                         {activeConversation.is_group ? (
                          <>
                            <span className="truncate max-w-[150px]">{activeConversation.group_description || "Workspace Channel"}</span>
                            <span>•</span>
                            <button
                              onClick={handleShowGroupMembers}
                              className="text-indigo-400 hover:text-indigo-300 font-bold transition-all hover:underline cursor-pointer active:scale-95 flex items-center gap-1 select-none bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 shadow-sm"
                              title="Click to view group members"
                            >
                              {activeConversation.member_count || 1} members
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{activeConversation.other_user_email}</span>
                            <span>•</span>
                            {activeConversation.other_user_id && onlineUsers.includes(activeConversation.other_user_id) ? (
                              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active now
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60">Offline</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </header>

                {/* Message Log */}
                <ScrollArea className="flex-1 min-h-0 p-4 custom-scrollbar bg-dots-pattern">
                  <div className="pb-2">
                    {messagesLoading && messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-48 gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Loading historic messages...</span>
                      </div>
                    ) : messages.length > 0 ? (
                      <AnimatePresence initial={false}>
                        {messages.map((msg, index) => {
                          const isCurrentUser = msg.sender_id === currentUser?.id;
                          const isLastInGroup = 
                            index === messages.length - 1 || 
                            messages[index + 1].sender_id !== msg.sender_id;
                          const isFirstInGroup = 
                            index === 0 || 
                            messages[index - 1].sender_id !== msg.sender_id;

                          return (
                            <motion.div
                              key={`msg-${msg.id}-${index}`}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ type: "spring", stiffness: 350, damping: 25 }}
                              className={`flex items-end ${isCurrentUser ? "justify-end" : "justify-start"} ${
                                isLastInGroup ? "mb-4" : "mb-1.5"
                              }`}
                            >
                              {!isCurrentUser && activeConversation?.is_group && (
                                <div className="flex items-end mr-2 shrink-0 select-none pb-1">
                                  {isLastInGroup ? (
                                    <Avatar 
                                      className="h-8 w-8 border border-border/10 cursor-pointer hover:opacity-85 active:scale-95 transition-all shadow-sm"
                                      onClick={() => handleInspectUserProfile(msg.sender_id, msg.sender_name, msg.sender_email, msg.sender_avatar_url)}
                                      title={`View ${msg.sender_name}'s profile`}
                                    >
                                      {msg.sender_avatar_url ? (
                                        <AvatarImage src={getMediaUrl(msg.sender_avatar_url)} alt={msg.sender_name} className="object-cover" />
                                      ) : null}
                                      <AvatarFallback className={`font-extrabold text-[10px] ${getAvatarThemeClass(msg.sender_name)}`}>
                                        {getInitials(msg.sender_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <div className="w-8 h-8" />
                                  )}
                                </div>
                              )}

                              {(() => {
                                const isDeletable = isCurrentUser && msg.message_type !== "deleted" && isWithin3Hours(msg.created_at);
                                const isSelected = selectedMessageIds.includes(msg.id);

                                return (
                                  <div 
                                    className={`flex flex-col max-w-[70%] gap-1 group relative transition-opacity duration-200 ${
                                      isSelectionMode && !isDeletable ? "opacity-35 select-none pointer-events-none" : ""
                                    }`}
                                  >
                                    {!isCurrentUser && activeConversation?.is_group && isFirstInGroup && (
                                      <span className="text-[10px] font-bold text-primary px-1 select-none leading-none mb-0.5">
                                        {msg.sender_name}
                                      </span>
                                    )}
                                    {/* Checkbox indicator for Selection Mode */}
                                    {isSelectionMode && isDeletable && (
                                      <div 
                                        className="absolute top-1/2 -translate-y-1/2 right-full mr-3 flex items-center justify-center cursor-pointer z-20 animate-in fade-in zoom-in-95 duration-150"
                                        onClick={() => handleToggleSelectMessage(msg.id)}
                                      >
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                                          isSelected
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "border-muted-foreground/45 hover:border-foreground"
                                        }`}>
                                          {isSelected && (
                                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Action buttons on group hover */}
                                    {isCurrentUser && isDeletable && !isSelectionMode && (
                                        <div className={`absolute top-1/2 -translate-y-1/2 right-full flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20 ${
                                          isLastInGroup ? "mr-2" : "mr-16"
                                        }`}>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer flex items-center justify-center border border-border/10 bg-background/60 backdrop-blur-sm shadow-sm"
                                            onClick={() => handleDeleteMessageClick(msg)}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer flex items-center justify-center border border-border/10 bg-background/60 backdrop-blur-sm shadow-sm"
                                            onClick={() => handleStartSelectionMode(msg)}
                                          >
                                            <ListChecks className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      )}
                                    
                                    {/* Message bubble body based on type */}
                                    <div 
                                      onClick={() => {
                                        if (isSelectionMode && isDeletable) {
                                          handleToggleSelectMessage(msg.id);
                                        }
                                      }}
                                      onDoubleClick={() => {
                                        if (isDeletable) {
                                          if (isSelectionMode) {
                                            handleToggleSelectMessage(msg.id);
                                          } else {
                                            setSelectedActionMessage(msg);
                                            setIsActionSheetOpen(true);
                                          }
                                        }
                                      }}
                                      className={`rounded-2xl shadow-sm text-sm break-words relative transition-all ${
                                        isSelectionMode && isDeletable 
                                          ? "cursor-pointer hover:scale-[1.01] active:scale-[0.98] select-none" 
                                          : ""
                                      } ${
                                        isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                                      } ${
                                        msg.message_type === "deleted"
                                          ? "bg-muted/40 text-muted-foreground/70 border border-dashed border-border/60 rounded-2xl"
                                          : isCurrentUser 
                                            ? `${currentPalette.gradientClass} text-white rounded-tr-none font-medium shadow-md ${currentPalette.glowShadow} border border-white/20` 
                                            : "bg-gradient-to-br from-card/90 via-muted/80 to-card/90 text-foreground rounded-tl-none border border-border/50 shadow-sm"
                                      }`}
                                    >
                                  
                                  {/* RENDER TYPE: IMAGE */}
                                  {msg.message_type === "image" && msg.file_url && (
                                    <div className="p-1">
                                      <img 
                                        src={getMediaUrl(msg.file_url)} 
                                        alt={msg.file_name || "image"} 
                                        className="rounded-xl max-h-60 max-w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setSelectedImage(getMediaUrl(msg.file_url))}
                                        onLoad={scrollToBottom}
                                      />
                                      {msg.content && msg.content !== msg.file_name && (
                                        <p className="px-2 pt-2 pb-1 text-sm">{msg.content}</p>
                                      )}
                                    </div>
                                  )}

                                  {/* RENDER TYPE: FILE */}
                                  {msg.message_type === "file" && msg.file_url && (
                                    <div className="p-3 flex items-center gap-3">
                                      <div className="h-10 w-10 bg-background/25 rounded-xl flex items-center justify-center text-foreground font-semibold text-lg shrink-0">
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div className="flex flex-col min-w-0 pr-2">
                                        <span className="font-semibold text-xs truncate max-w-[180px]">{msg.file_name}</span>
                                        <span className="text-[10px] opacity-75">{formatFileSize(msg.file_size)}</span>
                                        
                                        <a 
                                          href={getMediaUrl(msg.file_url)} 
                                          target="_blank" 
                                          rel="noreferrer" 
                                          download={msg.file_name || ""} 
                                          className={`flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg border text-[10px] w-fit font-bold transition-all hover:bg-background/10 active:scale-95 ${
                                            isCurrentUser
                                              ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                                              : "bg-background/10 border-border text-foreground"
                                          }`}
                                        >
                                          <FileDown className="h-3 w-3" /> Download
                                        </a>
                                      </div>
                                    </div>
                                  )}

                                  {/* RENDER TYPE: LOCATION */}
                                  {msg.message_type === "location" && (
                                    <div className="p-3.5 flex flex-col gap-2 min-w-[200px]">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary dark:text-primary-foreground" />
                                        <span className="font-bold text-xs">Shared Location</span>
                                      </div>
                                      
                                      {(() => {
                                        try {
                                          const { lat, lng } = JSON.parse(msg.content);
                                          return (
                                            <>
                                              <span className="text-[10px] opacity-75">Latitude: {lat.toFixed(4)}, Longitude: {lng.toFixed(4)}</span>
                                              <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`flex items-center justify-center gap-1.5 mt-1 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:bg-background/10 active:scale-95 border ${
                                                  isCurrentUser
                                                    ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground"
                                                    : "bg-background/10 border-border text-foreground"
                                                }`}
                                              >
                                                <Compass className="h-3.5 w-3.5" /> View on Maps
                                              </a>
                                            </>
                                          );
                                        } catch {
                                          return <span className="text-xs">Invalid coordinates</span>;
                                        }
                                      })()}
                                    </div>
                                  )}

                                   {/* RENDER TYPE: AUDIO / VOICE MESSAGE */}
                                   {msg.message_type === "audio" && msg.file_url && (
                                     <VoiceMessagePlayer 
                                       src={getMediaUrl(msg.file_url)} 
                                       isCurrentUser={isCurrentUser} 
                                     />
                                   )}

                                  {/* RENDER TYPE: TEXT */}
                                  {msg.message_type === "text" && (
                                    <div className="px-4 py-2.5">
                                      {msg.content}
                                    </div>
                                  )}

                                  {/* RENDER TYPE: DELETED PLACEHOLDER */}
                                  {msg.message_type === "deleted" && (
                                    <div className="px-4 py-2 flex items-center gap-2 text-muted-foreground/75 italic select-none">
                                      <Trash2 className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                      <span>This message was deleted</span>
                                    </div>
                                  )}

                                </div>
                                  <span className={`text-[9px] px-1 text-muted-foreground transition-all duration-200 flex items-center gap-1 ${
                                    isCurrentUser ? "text-right justify-end" : "text-left"
                                  } ${
                                    isLastInGroup 
                                      ? "opacity-100 mt-0.5" 
                                      : "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 whitespace-nowrap " + (isCurrentUser ? "right-full mr-3" : "left-full ml-3")
                                  }`}>
                                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {isCurrentUser && isLastInGroup && (
                                      <span className="flex shrink-0">
                                        {msg.is_read ? (
                                          <span className="text-sky-400 font-bold flex items-center select-none">
                                            <span className="text-[10px] leading-none">✓</span>
                                            <span className="text-[10px] leading-none -ml-0.5">✓</span>
                                          </span>
                                        ) : (!activeConversation.is_group && activeConversation.other_user_id && onlineUsers.includes(activeConversation.other_user_id)) ? (
                                          <span className="text-muted-foreground/60 font-bold flex items-center select-none">
                                            <span className="text-[10px] leading-none">✓</span>
                                            <span className="text-[10px] leading-none -ml-0.5">✓</span>
                                          </span>
                                        ) : (
                                          <span className="text-muted-foreground/60 font-bold select-none text-[10px] leading-none">
                                            ✓
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                  </div>
                                );
                              })()}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
                        <Hash className="h-8 w-8 text-muted-foreground/35" />
                        <span className="text-xs">No messages in this chat. Wave hello! 👋</span>
                      </div>
                    )}
                    {/* Real-time Typing Indicator Bubble */}
                    {isOtherUserTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="flex justify-start mb-4"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="bg-muted/80 text-foreground px-4 py-2.5 rounded-2xl rounded-tl-none border border-border/40 flex items-center gap-1.5 shadow-sm">
                            <span className="text-[11px] font-medium text-muted-foreground mr-0.5">
                              {typingUserName} is typing
                            </span>
                            <div className="flex gap-0.5 items-center h-2 mt-0.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.6s' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* File Attachment Preview Bar */}
                <AnimatePresence>
                  {attachedFile && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="px-4 py-2.5 border-t border-border bg-muted/40 backdrop-blur-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {attachedFilePreview ? (
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-border bg-background">
                            <img src={attachedFilePreview} alt="upload preview" className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center text-muted-foreground">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
                          <span className="text-[10px] text-muted-foreground">{formatFileSize(attachedFile.size)}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-full cursor-pointer"
                        onClick={() => {
                          setAttachedFile(null);
                          setAttachedFilePreview("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Input Controls / Multi-Select Panel */}
                <footer className={`p-4 border-t relative min-h-[72px] flex items-center shrink-0 z-20 transition-colors duration-300 ${
                  themeMode === "dark" 
                    ? "bg-slate-900/90 border-border/40 text-foreground" 
                    : "bg-white/95 border-slate-200/90 shadow-sm text-slate-900"
                }`}>
                  <AnimatePresence mode="wait">
                    {isSelectionMode ? (
                      <motion.div
                        key="selection-controls"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={{ duration: 0.2 }}
                        className="w-full flex items-center justify-between gap-4 select-none"
                      >
                        <div className="flex items-center gap-3">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted"
                            onClick={handleCancelSelection}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold text-xs md:text-sm text-foreground">
                            {selectedMessageIds.length} {selectedMessageIds.length === 1 ? "message" : "messages"} selected
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className="rounded-xl px-3.5 h-9 font-medium text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-all"
                            onClick={handleCancelSelection}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            className="rounded-xl px-4 h-9 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-destructive/20 cursor-pointer transition-all"
                            disabled={selectedMessageIds.length === 0}
                            onClick={handleConfirmBatchDeleteMessages}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="input-form-controls"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="w-full"
                      >
                        <form onSubmit={handleSendMessage} className="flex gap-2 items-center w-full">
                          
                          {/* Hidden Attachment Inputs */}
                          <input 
                            type="file" 
                            ref={imageInputRef} 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                          <input 
                            type="file" 
                            ref={documentInputRef} 
                            className="hidden" 
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                          />

                          {isRecording ? (
                            <div className="flex-1 flex gap-3 items-center bg-destructive/10 dark:bg-destructive/15 border border-destructive/20 rounded-xl px-4 py-1 select-none h-10 w-full">
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                                <span className="text-[10px] font-extrabold text-red-500 tracking-wider">RECORDING</span>
                              </div>
                              <div className="flex-1 text-center font-mono font-bold text-sm text-foreground/80">
                                {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-red-500 hover:bg-destructive/15 h-8 gap-1.5 px-3 rounded-lg cursor-pointer transition-all font-semibold"
                                onClick={handleCancelRecording}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-[10px]">Cancel</span>
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 gap-1.5 px-4 rounded-lg cursor-pointer transition-all font-bold"
                                onClick={handleStopAndSendRecording}
                              >
                                <Check className="h-4 w-4" />
                                <span className="text-[10px]">Send</span>
                              </Button>
                            </div>
                          ) : (
                            <>
                              {/* Custom Floating Attach Dropdown Menu */}
                              <div className="relative flex" ref={attachMenuRef}>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className={`h-10 w-10 shrink-0 cursor-pointer rounded-xl transition-all ${
                                    showAttachMenu
                                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                  }`}
                                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                                  disabled={sendingMessage}
                                  title="Attach Content"
                                >
                                  <Paperclip className="h-4.5 w-4.5" />
                                </Button>

                                <AnimatePresence>
                                  {showAttachMenu && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                      transition={{ type: "spring", duration: 0.3 }}
                                      className="absolute bottom-12 left-0 w-52 bg-card border border-border shadow-2xl rounded-2xl p-2 z-30 flex flex-col gap-1 backdrop-blur-md"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowAttachMenu(false);
                                          imageInputRef.current?.click();
                                        }}
                                        className="w-full flex items-center gap-3 p-2.5 hover:bg-muted/80 rounded-xl text-left text-xs font-semibold text-foreground transition-all active:scale-[0.98] cursor-pointer"
                                      >
                                        <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
                                          <ImageIcon className="h-4 w-4" />
                                        </div>
                                        Share Image/Photo
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowAttachMenu(false);
                                          documentInputRef.current?.click();
                                        }}
                                        className="w-full flex items-center gap-3 p-2.5 hover:bg-muted/80 rounded-xl text-left text-xs font-semibold text-foreground transition-all active:scale-[0.98] cursor-pointer"
                                      >
                                        <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center">
                                          <FileText className="h-4 w-4 animate-duration-1000" />
                                        </div>
                                        Share Document/File
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowAttachMenu(false);
                                          handleShareLocation();
                                        }}
                                        className="w-full flex items-center gap-3 p-2.5 hover:bg-muted/80 rounded-xl text-left text-xs font-semibold text-foreground transition-all active:scale-[0.98] cursor-pointer"
                                        disabled={isLocationLoading}
                                      >
                                        <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center">
                                          {isLocationLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin animate-duration-1000" />
                                          ) : (
                                            <MapPin className="h-4 w-4" />
                                          )}
                                        </div>
                                        Share GPS Location
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              <Input
                                ref={messageInputRef}
                                placeholder={attachedFile ? "Add description (optional)..." : "Type a message..."}
                                className={`flex-1 rounded-xl py-5 text-sm border transition-colors ${
                                  themeMode === "dark" 
                                    ? "bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:ring-1 focus:ring-primary/40" 
                                    : "bg-slate-100/90 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:ring-1 focus:ring-slate-400 font-medium"
                                }`}
                                value={newMessage}
                                onChange={handleInputChange}
                                disabled={sendingMessage}
                                maxLength={1000}
                              />

                              {newMessage.trim() || attachedFile ? (
                                <Button 
                                  type="submit" 
                                  size="icon" 
                                  className={`h-10 w-10 shrink-0 cursor-pointer rounded-xl ${currentPalette.btnGradientClass} shadow-md ${currentPalette.glowShadow} transition-all hover:scale-105 active:scale-95 border-0`}
                                  disabled={sendingMessage}
                                >
                                  {sendingMessage ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Send className="h-4 w-4" />
                                  )}
                                </Button>
                              ) : (
                                <Button 
                                  type="button" 
                                  size="icon" 
                                  className="h-10 w-10 shrink-0 cursor-pointer rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all active:scale-95 border border-border"
                                  onClick={handleStartRecording}
                                  disabled={sendingMessage}
                                  title="Record Voice Message"
                                >
                                  <Mic className="h-4.5 w-4.5 text-primary" />
                                </Button>
                              )}
                            </>
                          )}
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </footer>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-card/2"
              >
                <div className="relative mb-6">
                  {/* Glowing background bubble */}
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                  <div className="h-16 w-16 glass-panel rounded-2xl flex items-center justify-center border-border/80 shadow-md relative">
                    <MessageSquare className="h-8 w-8 text-primary animate-bounce" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <h2 className="text-lg font-bold tracking-tight mb-1 text-foreground">Next-Gen Workspace Chat</h2>
                <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  Select an active chat session from the list or lookup coworker profiles to create new conversations.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>

      {/* 👤 PROFILE SETTINGS MODAL */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative z-10 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="font-bold text-lg text-foreground">Workspace Settings</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Tab Switcher */}
              <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/40">
                <button
                  type="button"
                  onClick={() => setSettingsTab("profile")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    settingsTab === "profile" 
                      ? `${currentPalette.gradientClass} text-white shadow-sm` 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab("appearance")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    settingsTab === "appearance" 
                      ? `${currentPalette.gradientClass} text-white shadow-sm` 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Palette className="h-3.5 w-3.5" /> Appearance & Theme
                </button>
              </div>

              {settingsTab === "profile" ? (
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 pt-1">
                  {/* Avatar upload sector */}
                  <div className="flex flex-col items-center gap-2">
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      className="hidden" 
                      onChange={handleAvatarFileChange} 
                      accept="image/*"
                    />
                    <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                      <Avatar className="h-20 w-20 border-2 border-primary/20 group-hover:opacity-85 transition-opacity">
                        {profileAvatarPreview ? (
                          <AvatarImage src={getMediaUrl(profileAvatarPreview)} className="object-cover" />
                        ) : null}
                        <AvatarFallback className={`font-bold text-xl ${getAvatarThemeClass(currentUser?.name || "User")}`}>
                          {currentUser ? getInitials(currentUser.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Upload Profile Photo</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Name</label>
                    <Input 
                      value={profileName} 
                      onChange={(e) => setProfileName(e.target.value)} 
                      required 
                      className="h-10 text-sm border-border focus:ring-1"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <Input 
                      type="email" 
                      value={profileEmail} 
                      disabled
                      className="h-10 text-sm border-border bg-muted/50 cursor-not-allowed select-none opacity-80"
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="cursor-pointer rounded-xl h-10 text-sm"
                      onClick={() => setIsProfileModalOpen(false)}
                      disabled={isSavingProfile}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`cursor-pointer rounded-xl h-10 text-sm px-6 ${currentPalette.btnGradientClass} font-semibold border-0 shadow-md`}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                        </>
                      ) : (
                        "Save Profile"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4 pt-1">
                  <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-border/40">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">Theme Mode</span>
                      <span className="text-[10px] text-muted-foreground">Switch between light & dark interface</span>
                    </div>
                    <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-xl border border-border/40">
                      <button
                        type="button"
                        onClick={handleToggleThemeMode}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          themeMode === "dark" 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Moon className="h-3.5 w-3.5 text-indigo-400" /> Dark
                      </button>
                      <button
                        type="button"
                        onClick={handleToggleThemeMode}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          themeMode === "light" 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Sun className="h-3.5 w-3.5 text-amber-500" /> Light
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-foreground">Gradient Color Accent</span>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.values(THEME_PALETTES).map((palette) => {
                        const isSelected = activePaletteId === palette.id;
                        return (
                          <button
                            key={palette.id}
                            type="button"
                            onClick={() => handleSelectPalette(palette.id)}
                            className={`flex flex-col gap-1.5 p-2 rounded-xl border transition-all cursor-pointer relative ${
                              isSelected 
                                ? "border-primary ring-2 ring-primary/30 bg-primary/5 shadow-sm scale-[1.02]" 
                                : "border-border/60 hover:border-border hover:bg-muted/30"
                            }`}
                          >
                            <div className={`h-6 w-full rounded-lg bg-gradient-to-r ${palette.previewGradient} flex items-center justify-end pr-1.5 shadow-sm`}>
                              {isSelected && <Check className="h-3.5 w-3.5 text-white font-bold stroke-[3]" />}
                            </div>
                            <span className="text-[10px] font-bold text-foreground text-center truncate">{palette.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-1">
                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Saved & applied live
                    </span>
                    <Button
                      type="button"
                      className={`cursor-pointer rounded-xl h-9 text-xs px-5 ${currentPalette.btnGradientClass} font-semibold border-0 shadow-md`}
                      onClick={() => setIsProfileModalOpen(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🖼️ IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-full text-white/70 hover:text-white hover:bg-white/10 z-10 cursor-pointer bg-black/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Lightbox Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl max-h-screen relative z-10 flex items-center justify-center"
            >
              <img 
                src={selectedImage} 
                alt="expanded media" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Message Confirmation Modal */}
      <AnimatePresence>
        {messageToDelete && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 text-center"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <Trash2 className="h-6 w-6" />
              </div>
              
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-lg text-foreground">Delete message?</h3>
                <p className="text-xs text-muted-foreground text-center">
                  Are you sure you want to delete this message for everyone? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl cursor-pointer"
                  onClick={() => setMessageToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 rounded-xl cursor-pointer"
                  onClick={handleConfirmDeleteMessage}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👥 CREATE GROUP CHAT MODAL */}
      <AnimatePresence>
        {isGroupModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative z-10 p-6 flex flex-col gap-5 max-h-[90vh]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-lg text-foreground">Create Group Chat</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setIsGroupModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCreateGroupSubmit} className="flex flex-col gap-4 overflow-hidden">
                {/* Group Details */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground">GROUP NAME</label>
                    <Input
                      type="text"
                      placeholder="e.g. Project Apollo, Marketing, Family..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      required
                      maxLength={100}
                      className="rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground">DESCRIPTION (OPTIONAL)</label>
                    <Input
                      type="text"
                      placeholder="What is this group about?"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      maxLength={200}
                      className="rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                {/* Add Members Selection */}
                <div className="flex flex-col gap-2 flex-1 overflow-hidden min-h-[220px]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-muted-foreground">ADD MEMBERS</label>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      {selectedGroupUserIds.length} selected
                    </span>
                  </div>

                  {/* Search users input */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      type="text"
                      placeholder="Search users to add..."
                      value={groupSearchQuery}
                      onChange={(e) => setGroupSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl text-xs focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>

                  {/* Scrollable list of members check list */}
                  <div className="flex-1 overflow-y-auto border border-border/60 rounded-xl p-2 bg-muted/20 flex flex-col gap-1.5 max-h-[240px]">
                    {isSearchingGroupUsers ? (
                      <div className="py-8 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Loading users...</span>
                      </div>
                    ) : groupSearchResults.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No users found
                      </div>
                    ) : (
                      groupSearchResults.map((user) => {
                        const isChecked = selectedGroupUserIds.includes(user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => handleToggleGroupUserSelect(user.id)}
                            className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border ${
                              isChecked 
                                ? "bg-primary/5 border-primary/20" 
                                : "hover:bg-muted/40 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Avatar className="h-8 w-8 border border-border/10">
                                {user.avatar_url ? (
                                  <AvatarImage src={getMediaUrl(user.avatar_url)} className="object-cover" />
                                ) : null}
                                <AvatarFallback className={`font-semibold text-[10px] ${getAvatarThemeClass(user.name)}`}>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-foreground truncate">{user.name}</span>
                                <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                              </div>
                            </div>
                            <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                              isChecked 
                                ? "bg-primary border-primary text-primary-foreground" 
                                : "border-muted-foreground/30 bg-background"
                            }`}>
                              {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-xl cursor-pointer"
                    onClick={() => setIsGroupModalOpen(false)}
                    disabled={isCreatingGroup}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl cursor-pointer bg-primary text-primary-foreground"
                    disabled={isCreatingGroup || !newGroupName.trim() || selectedGroupUserIds.length === 0}
                  >
                    {isCreatingGroup ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        Creating...
                      </>
                    ) : (
                      "Create Group"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👥 GROUP MEMBERS LIST MODAL */}
      <AnimatePresence>
        {isGroupMembersModalOpen && activeConversation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGroupMembersModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative z-10 p-6 flex flex-col gap-4 max-h-[80vh]"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-bold text-base text-foreground truncate max-w-[240px]">
                    {activeConversation.group_name || "Group Members"}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">Group Participants</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  onClick={() => setIsGroupMembersModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Members List Container */}
              <div className="flex-1 overflow-y-auto border border-border/60 rounded-xl p-2 bg-muted/20 flex flex-col gap-1.5 min-h-[180px] max-h-[360px]">
                {isLoadingGroupMembers ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Loading members...</span>
                  </div>
                ) : groupMembersList.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    No members found
                  </div>
                ) : (
                  groupMembersList.map((user) => {
                    const isCurrentUserMember = Number(user.id) === Number(currentUser?.id);
                    const isGroupCreator = Number(user.id) === Number(activeConversation.group_created_by);
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 rounded-xl border border-transparent hover:bg-muted/40 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative">
                            <Avatar className="h-8 w-8 border border-border/10">
                              {user.avatar_url ? (
                                <AvatarImage src={getMediaUrl(user.avatar_url)} className="object-cover" />
                              ) : null}
                              <AvatarFallback className={`font-semibold text-[10px] ${getAvatarThemeClass(user.name)}`}>
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            {!isCurrentUserMember && onlineUsers.includes(user.id) && (
                              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-card shadow-sm" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground truncate flex items-center gap-1.5">
                              {user.name}
                              {isCurrentUserMember && (
                                <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-bold select-none">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                          </div>
                        </div>

                        {/* Optional status badges for admins / creators */}
                        {isGroupCreator && (
                          <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full font-bold select-none shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Close Action Controls */}
              <div className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl cursor-pointer"
                  onClick={() => setIsGroupMembersModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 👤 INSPECT USER PROFILE MODAL */}
      <AnimatePresence>
        {isInspectModalOpen && inspectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInspectModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative z-10 p-6 flex flex-col items-center gap-5"
            >
              <div className="w-full flex items-center justify-between">
                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">User Profile</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  onClick={() => setIsInspectModalOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Avatar details */}
              <div className="flex flex-col items-center gap-3 mt-2 text-center w-full">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-lg">
                    {inspectedUser.avatar_url ? (
                      <AvatarImage src={getMediaUrl(inspectedUser.avatar_url)} className="object-cover" />
                    ) : null}
                    <AvatarFallback className={`font-bold text-2xl ${getAvatarThemeClass(inspectedUser.name)}`}>
                      {getInitials(inspectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsers.includes(inspectedUser.id) && (
                    <span className="absolute bottom-0 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-card shadow-sm animate-pulse" />
                  )}
                </div>

                <div className="flex flex-col gap-1 w-full px-2">
                  <span className="font-bold text-lg text-foreground truncate">{inspectedUser.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{inspectedUser.email}</span>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="w-full flex flex-col gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-muted-foreground">Online Status:</span>
                  {onlineUsers.includes(inspectedUser.id) ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      Online Now
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-semibold">Offline</span>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <div className="w-full pt-1">
                <Button
                  type="button"
                  className="w-full rounded-xl cursor-pointer bg-primary text-primary-foreground font-semibold"
                  onClick={() => setIsInspectModalOpen(false)}
                >
                  Close Profile
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 🚪 LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="w-full max-w-sm bg-card border border-border shadow-2xl rounded-2xl overflow-hidden relative z-10 p-6 flex flex-col items-center gap-4"
            >
              {/* Alert icon or sign */}
              <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 mb-1">
                <LogOut className="h-5 w-5" />
              </div>

              <div className="text-center flex flex-col gap-1.5">
                <h3 className="font-bold text-base text-foreground">Confirm Logout</h3>
                <p className="text-xs text-muted-foreground px-2 leading-relaxed">
                  Are you sure you want to log out of your workspace session? You will need to log back in to receive real-time notifications.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex gap-3 pt-2 mt-1 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl cursor-pointer h-10 text-sm font-semibold"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 rounded-xl cursor-pointer h-10 text-sm font-semibold bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={async () => {
                    setIsLogoutConfirmOpen(false);
                    await handleLogout();
                  }}
                >
                  Yes, Log Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 📱 TOUCH ACTION SHEET MODAL */}
      <AnimatePresence>
        {isActionSheetOpen && selectedActionMessage && (
          <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsActionSheetOpen(false);
                setSelectedActionMessage(null);
              }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Action Sheet Card */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-t-2xl md:rounded-2xl overflow-hidden relative z-10 p-5 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-foreground">Message Actions</span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[280px]">
                    "{selectedActionMessage.content}"
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                  onClick={() => {
                    setIsActionSheetOpen(false);
                    setSelectedActionMessage(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Action options */}
              <div className="flex flex-col gap-2.5">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer font-bold px-3"
                  onClick={() => {
                    const msg = selectedActionMessage;
                    setIsActionSheetOpen(false);
                    setSelectedActionMessage(null);
                    handleDeleteMessageClick(msg);
                  }}
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  Delete Message
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-primary hover:text-primary hover:bg-primary/10 rounded-xl cursor-pointer font-bold px-3"
                  onClick={() => {
                    const msg = selectedActionMessage;
                    setIsActionSheetOpen(false);
                    setSelectedActionMessage(null);
                    handleStartSelectionMode(msg);
                  }}
                >
                  <ListChecks className="h-4 w-4 shrink-0" />
                  Select Multiple Messages
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl cursor-pointer font-semibold text-xs mt-1.5"
                  onClick={() => {
                    setIsActionSheetOpen(false);
                    setSelectedActionMessage(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
