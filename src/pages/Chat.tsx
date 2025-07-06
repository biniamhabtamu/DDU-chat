import { useState } from "react";
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
  Smile
} from "lucide-react";

const Chat = () => {
  const [activeChat, setActiveChat] = useState("general");
  const [message, setMessage] = useState("");

  const chatRooms = [
    { id: "general", name: "General", type: "public", members: 245, icon: Hash },
    { id: "programming", name: "Programming", type: "public", members: 189, icon: Hash },
    { id: "mathematics", name: "Mathematics", type: "public", members: 156, icon: Hash },
    { id: "engineering", name: "Engineering", type: "public", members: 98, icon: Hash },
    { id: "study-group", name: "Study Group 2024", type: "private", members: 24, icon: Lock },
  ];

  const messages = [
    {
      id: 1,
      user: "Ahmed Hassan",
      avatar: "AH",
      message: "Hey everyone! Anyone working on the React project?",
      time: "2:30 PM",
      isOnline: true
    },
    {
      id: 2,
      user: "Sara Mohammed",
      avatar: "SM",
      message: "Yes! I'm stuck on the authentication part. Can someone help?",
      time: "2:32 PM",
      isOnline: true
    },
    {
      id: 3,
      user: "David Wilson",
      avatar: "DW",
      message: "I can help with that! Firebase Auth is pretty straightforward once you get the hang of it.",
      time: "2:35 PM",
      isOnline: false
    },
    {
      id: 4,
      user: "Meron Tadesse",
      avatar: "MT",
      message: "Here's a helpful tutorial I found: https://firebase.google.com/docs/auth",
      time: "2:37 PM",
      isOnline: true
    }
  ];

  const onlineUsers = [
    { name: "Ahmed Hassan", avatar: "AH", status: "coding" },
    { name: "Sara Mohammed", avatar: "SM", status: "studying" },
    { name: "Meron Tadesse", avatar: "MT", status: "available" },
    { name: "John Doe", avatar: "JD", status: "in meeting" },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to Firebase
      console.log("Sending message:", message);
      setMessage("");
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
              {onlineUsers.length} Online
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

            {/* Online Users */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Online Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {onlineUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-gradient-primary text-white">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.status}</p>
                    </div>
                  </div>
                ))}
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
                  <div key={msg.id} className="flex space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {msg.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {msg.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 max-w-2xl">
                        <p className="text-sm">{msg.message}</p>
                      </div>
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
                  <Button onClick={handleSendMessage} className="bg-gradient-primary">
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