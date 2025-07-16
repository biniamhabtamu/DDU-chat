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
  deleteDoc,
  getDocs
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
import logo from "@/assets/dire-dev-logo.png";

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
  createdAt: any;
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
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState("public");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize with default rooms
  const defaultRooms: ChatRoom[] = [
    { id: "general", name: "General", type: "public", members: 245, icon: Hash, createdAt: new Date() },
    { id: "programming", name: "Programming", type: "public", members: 189, icon: Hash, createdAt: new Date() },
    { id: "mathematics", name: "Mathematics", type: "public", members: 156, icon: Hash, createdAt: new Date() },
    { id: "engineering", name: "Engineering", type: "public", members: 98, icon: Hash, createdAt: new Date() },
    { id: "study-group", name: "Study Group", type: "private", members: 24, icon: Lock, createdAt: new Date() },
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && showCreateRoomModal) {
        setShowCreateRoomModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCreateRoomModal]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load chat rooms from Firestore
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const roomsRef = collection(db, "rooms");
        const q = query(roomsRef, orderBy("createdAt", "asc"));
        const querySnapshot = await getDocs(q);
        
        const roomsData: ChatRoom[] = [];
        querySnapshot.forEach((doc) => {
          roomsData.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          } as ChatRoom);
        });
        
        // Combine default rooms with Firestore rooms
        const allRooms = [...defaultRooms, ...roomsData];
        setChatRooms(allRooms);
      } catch (error) {
        console.error("Error loading rooms:", error);
        setChatRooms(defaultRooms);
      }
    };

    loadRooms();
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

  // Create new chat room
  const createNewRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      // Add room to Firestore
      const newRoomRef = await addDoc(collection(db, "rooms"), {
        name: newRoomName,
        type: newRoomType,
        members: 0,
        createdAt: serverTimestamp()
      });
      
      // Add to local state
      const newRoom: ChatRoom = {
        id: newRoomRef.id,
        name: newRoomName,
        type: newRoomType,
        members: 0,
        icon: newRoomType === "public" ? Globe : Lock,
        createdAt: new Date()
      };
      
      setChatRooms([...chatRooms, newRoom]);
      setActiveChat(newRoomRef.id);
      setShowCreateRoomModal(false);
      setNewRoomName("");
      setNewRoomType("public");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Create Room Modal */}
      {showCreateRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Room</h3>
              <button 
                onClick={() => setShowCreateRoomModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Name
                </label>
                <Input
                  placeholder="Enter room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setNewRoomType("public")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      newRoomType === "public"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Public
                    </div>
                  </button>
                  <button
                    onClick={() => setNewRoomType("private")}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      newRoomType === "private"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Private
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateRoomModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={createNewRoom}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  Create Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-20 p-4 border-b dark:border-gray-800 flex justify-between items-center shadow-sm">
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
          className={`fixed lg:sticky top-0 left-0 h-screen z-20 bg-white dark:bg-gray-900 border-r dark:border-gray-800 transform ${
            sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-64'
          } transition-all duration-300 ease-in-out lg:block shadow-lg lg:shadow-none`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b dark:border-gray-800 flex items-center">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 mr-3" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dire-Dev
              </h2>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search rooms..." 
                className="pl-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Chat Rooms
                </h3>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {chatRooms.length}
                </span>
              </div>
              
              {chatRooms.map((room) => {
                const Icon = room.type === "public" ? Globe : Lock;
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
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="font-medium truncate max-w-[120px]">{room.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs mr-2 bg-white dark:bg-gray-800">
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
              
              <Button 
                variant="outline" 
                className="w-full mt-6 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-700"
                onClick={() => setShowCreateRoomModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Room
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300 min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:block p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Real-Time Chat
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect and collaborate with your fellow students
                </p>
              </div>
              <Badge variant="secondary" className="px-4 py-2 bg-white dark:bg-gray-800">
                <Users className="w-4 h-4 mr-2" />
                {chatRooms.find(room => room.id === activeChat)?.members} Online
              </Badge>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Room Header */}
            <div className="p-4 border-b dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                      <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {chatRooms.find(room => room.id === activeChat)?.name}
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chatRooms.find(room => room.id === activeChat)?.members} members
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800">
                  <Users className="w-4 h-4 mr-2" />
                  Members
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading messages...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No messages yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Be the first to send a message in this room!
                    </p>
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                      onClick={() => document.getElementById("messageInput")?.focus()}
                    >
                      Send First Message
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <MessageItem key={msg.id} msg={msg} />
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Message Input */}
            <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900 sticky bottom-0 shadow-lg">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    id="messageInput"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-12 py-5 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-5"
                  disabled={!message.trim()}
                >
                  <Send className="w-5 h-5" />
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
          className="fixed bottom-6 left-6 lg:hidden z-30 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-4 shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Chat;