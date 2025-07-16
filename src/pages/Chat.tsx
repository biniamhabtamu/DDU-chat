import { useState, useEffect } from "react";
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
  Timestamp
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Trash2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: Timestamp;
  isEdited?: boolean;
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
  const [chatRooms] = useState<ChatRoom[]>([
    { id: "general", name: "General", type: "public", members: 245, icon: Hash },
    { id: "programming", name: "Programming", type: "public", members: 189, icon: Hash },
    { id: "mathematics", name: "Mathematics", type: "public", members: 156, icon: Hash },
    { id: "engineering", name: "Engineering", type: "public", members: 98, icon: Hash },
    { id: "study-group", name: "Study Group 2024", type: "private", members: 24, icon: Lock },
  ]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });
    
    return () => unsubscribe();
  }, []);

  // Fetch messages in real-time
  useEffect(() => {
    if (!activeChat) return;

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("roomId", "==", activeChat),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({
          id: doc.id,
          text: doc.data().text,
          userId: doc.data().userId,
          userName: doc.data().userName,
          userAvatar: doc.data().userAvatar,
          createdAt: doc.data().createdAt,
          isEdited: doc.data().isEdited || false
        });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [activeChat]);

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

  const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    try {
      return timestamp.toDate().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      console.error("Error formatting timestamp:", e);
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary mb-2">
                Real-Time Chat
              </h1>
              <p className="text-muted-foreground">
                Connect and collaborate with your fellow students
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {chatRooms.find(room => room.id === activeChat)?.members} Online
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Rooms Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat Rooms
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search rooms..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {chatRooms.map((room) => {
                  const Icon = room.icon;
                  return (
                    <button
                      key={room.id}
                      onClick={() => setActiveChat(room.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        activeChat === room.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          <span className="font-medium">{room.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {room.members}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1">
                        {room.type === "public" ? (
                          <Globe className="w-3 h-3 mr-1 text-success" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1 text-warning" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">
                          {room.type}
                        </span>
                      </div>
                    </button>
                  );
                })}
                
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Hash className="w-5 h-5 mr-2" />
                      {chatRooms.find(room => room.id === activeChat)?.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {chatRooms.find(room => room.id === activeChat)?.members} members
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Members
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex space-x-3 group">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {msg.userAvatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{msg.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(msg.createdAt)}
                          {msg.isEdited && <span className="ml-1">(edited)</span>}
                        </span>
                      </div>
                      {editingMessageId === msg.id ? (
                        <div className="flex flex-col space-y-2">
                          <Input
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={updateMessage}>
                              Save
                            </Button>
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="bg-muted/50 rounded-lg p-3 max-w-2xl">
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          {user?.uid === msg.userId && (
                            <div className="absolute right-0 top-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6"
                                onClick={() => startEditing(msg)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 text-red-500"
                                onClick={() => deleteMessage(msg.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
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
                    className="bg-gradient-primary"
                    disabled={!message.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;