import { useState, useEffect, useRef } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  where,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Users, 
  Send, 
  Plus, 
  Search,
  Hash,
  Globe,
  Lock,
  Smile,
  Edit,
  Trash2,
  Menu,
  X
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: any;
  isEdited?: boolean;
  roomId: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: string;
  members: number;
  icon: any;
}

const Chat = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const chatRooms: ChatRoom[] = [
    { id: "general", name: "General", type: "public", members: 245, icon: Hash },
    { id: "programming", name: "Programming", type: "public", members: 189, icon: Hash },
    { id: "mathematics", name: "Mathematics", type: "public", members: 156, icon: Hash },
    { id: "engineering", name: "Engineering", type: "public", members: 98, icon: Hash },
    { id: "study-group", name: "Study Group 2024", type: "private", members: 24, icon: Lock },
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Real-time messages listener
  useEffect(() => {
    if (!activeChat) return;

    setLoading(true);
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("roomId", "==", activeChat),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userAvatar: user.displayName?.substring(0, 2) || "AN",
        roomId: activeChat,
        createdAt: serverTimestamp(),
        isEdited: false
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditingText(msg.text);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const updateMessage = async () => {
    if (!editingMessageId) return;

    try {
      await updateDoc(doc(db, "messages", editingMessageId), {
        text: editingText,
        isEdited: true,
        createdAt: serverTimestamp()
      });
      setEditingMessageId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", messageId));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageItem = ({ msg }: { msg: Message }) => {
    const isCurrentUser = user?.uid === msg.userId;
    
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex max-w-xs md:max-w-md rounded-2xl p-3 ${
          isCurrentUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
        }`}>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {msg.userAvatar}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">{msg.userName}</span>
            </div>
            <p className="text-sm">{msg.text}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-70">
                {formatTime(new Date(msg.createdAt))}
                {msg.isEdited && <span className="ml-1">(edited)</span>}
              </span>
              {isCurrentUser && (
                <div className="flex space-x-2 ml-2">
                  <button 
                    onClick={() => startEditing(msg)} 
                    className="text-xs hover:underline"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => deleteMessage(msg.id)} 
                    className="text-xs hover:underline text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-background z-20 p-4 border-b flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-semibold truncate">
            {chatRooms.find(room => room.id === activeChat)?.name}
          </h1>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Users className="w-4 h-4 mr-1" />
          {chatRooms.find(room => room.id === activeChat)?.members}
        </Badge>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* Fixed Sidebar */}
        <div 
          ref={sidebarRef}
          className={`fixed lg:sticky top-0 left-0 h-screen z-20 bg-background border-r transform ${
            sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'
          } transition-all duration-300 ease-in-out lg:block`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6 mr-2 text-blue-500" />
              <h2 className="text-xl font-bold">Chat Rooms</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="lg:hidden ml-auto"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Sidebar Content */}
          <div className="h-[calc(100vh-65px)] overflow-y-auto p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search rooms..." className="pl-10" />
            </div>
            
            <div className="space-y-2">
              {chatRooms.map((room) => {
                const Icon = room.icon;
                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveChat(room.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      activeChat === room.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      <span className="font-medium">{room.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs mr-2">
                        {room.members}
                      </Badge>
                      {room.type === "public" ? (
                        <Globe className="w-3 h-3 text-green-500" />
                      ) : (
                        <Lock className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </button>
                );
              })}
              
              <Button variant="outline" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
          {/* Desktop Header */}
          <div className="hidden lg:block p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gradient-primary mb-1">
                  Real-Time Chat
                </h1>
                <p className="text-muted-foreground text-sm">
                  Connect and collaborate with your fellow students
                </p>
              </div>
              <Badge variant="secondary" className="px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                {chatRooms.find(room => room.id === activeChat)?.members} Online
              </Badge>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Room Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Hash className="w-5 h-5 mr-2 text-blue-500" />
                    <h1 className="text-xl font-semibold">
                      {chatRooms.find(room => room.id === activeChat)?.name}
                    </h1>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {chatRooms.find(room => room.id === activeChat)?.members} members
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Members
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p>Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-muted-foreground">No messages yet. Send the first message!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageItem key={msg.id} msg={msg} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Message Input */}
            <div className="p-4 border-t bg-background sticky bottom-0">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 lg:hidden z-30 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Chat;