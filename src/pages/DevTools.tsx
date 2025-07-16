import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Code, Play, Plus, Trash2, FileCode, FileText, ListTodo, 
  Terminal, Sparkles, Sun, Moon, Lightbulb, Wand2, Timer, 
  Bookmark, ClipboardCheck, Maximize2, Minimize2, 
  Users, MessageSquare, Palette, TextCursor, LayoutTemplate, Share2,
  Eye, CheckCircle2, Send
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { 
  doc, getDoc, setDoc, updateDoc, 
  collection, addDoc, deleteDoc, onSnapshot,
  query, where, orderBy, serverTimestamp
} from "firebase/firestore";

// Types for Firebase data
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  title: string;
  content: string;
}

interface Snippet {
  id: string;
  name: string;
  code: string;
}

interface Collaborator {
  id: string;
  name: string;
  online: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  text: string;
  time: string;
  timestamp: any;
}

interface CodeState {
  html: string;
  css: string;
  js: string;
}

interface TimerState {
  minutes: number;
  seconds: number;
  running: boolean;
  mode: string;
}

const DevTools = () => {
  const { user } = useAuth();
  const userId = user?.uid || "guest";
  
  // Firebase references
  const userDocRef = doc(db, "users", userId);
  const codeDocRef = doc(db, "users", userId, "tools", "code");
  const terminalDocRef = doc(db, "users", userId, "tools", "terminal");
  const timerDocRef = doc(db, "users", userId, "tools", "timer");
  const todosCollectionRef = collection(db, "users", userId, "todos");
  const notesCollectionRef = collection(db, "users", userId, "notes");
  const snippetsCollectionRef = collection(db, "users", userId, "snippets");
  const collaboratorsCollectionRef = collection(db, "users", userId, "collaborators");
  const chatCollectionRef = collection(db, "users", userId, "chat");
  
  // State with Firebase integration
  const [htmlCode, setHtmlCode] = useState("<h1>Hello, Dire-Dev!</h1>\n<p>Start coding here...</p>");
  const [cssCode, setCssCode] = useState("h1 { \n  color: #6d28d9; \n  font-family: 'Inter', sans-serif;\n}");
  const [jsCode, setJsCode] = useState("// JavaScript goes here\nconsole.log('Hello Dire-Dev')");
  const [activeTab, setActiveTab] = useState("html");
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorTheme, setEditorTheme] = useState("dark");
  
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "> help",
    "Commands: help, about, clear, version, quote",
    "> about",
    "Welcome to Dire-Dev Terminal - created for students!"
  ]);
  const [terminalCommand, setTerminalCommand] = useState("");
  
  const [darkTheme, setDarkTheme] = useState(false);
  const [quote, setQuote] = useState(
    "The beautiful thing about learning is that no one can take it away from you."
  );
  
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("work");
  
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Firebase listeners setup
  useEffect(() => {
    if (!userId) return;
    
    const unsubscribeFunctions: (() => void)[] = [];
    
    // Code Editor
    const unsubscribeCode = onSnapshot(codeDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as CodeState;
        setHtmlCode(data.html);
        setCssCode(data.css);
        setJsCode(data.js);
      }
    });
    unsubscribeFunctions.push(unsubscribeCode);
    
    // Terminal
    const unsubscribeTerminal = onSnapshot(terminalDocRef, (doc) => {
      if (doc.exists()) {
        setTerminalOutput(doc.data().output || []);
      }
    });
    unsubscribeFunctions.push(unsubscribeTerminal);
    
    // Timer
    const unsubscribeTimer = onSnapshot(timerDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as TimerState;
        setTimerMinutes(data.minutes);
        setTimerSeconds(data.seconds);
        setIsTimerRunning(data.running);
        setTimerMode(data.mode);
      }
    });
    unsubscribeFunctions.push(unsubscribeTimer);
    
    // Todos
    const unsubscribeTodos = onSnapshot(todosCollectionRef, (snapshot) => {
      const todosData: Todo[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Todo);
      setTodos(todosData);
    });
    unsubscribeFunctions.push(unsubscribeTodos);
    
    // Notes
    const unsubscribeNotes = onSnapshot(notesCollectionRef, (snapshot) => {
      const notesData: Note[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Note);
      setNotes(notesData);
      
      // Set active note if none is selected
      if (!activeNote && notesData.length > 0) {
        setActiveNote(notesData[0].id);
      }
    });
    unsubscribeFunctions.push(unsubscribeNotes);
    
    // Snippets
    const unsubscribeSnippets = onSnapshot(snippetsCollectionRef, (snapshot) => {
      const snippetsData: Snippet[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Snippet);
      setSnippets(snippetsData);
    });
    unsubscribeFunctions.push(unsubscribeSnippets);
    
    // Collaborators
    const unsubscribeCollaborators = onSnapshot(collaboratorsCollectionRef, (snapshot) => {
      const collaboratorsData: Collaborator[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Collaborator);
      setCollaborators(collaboratorsData);
    });
    unsubscribeFunctions.push(unsubscribeCollaborators);
    
    // Chat messages
    const chatQuery = query(chatCollectionRef, orderBy("timestamp", "asc"));
    const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      const chatData: ChatMessage[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          user: data.user,
          text: data.text,
          time: data.time,
          timestamp: data.timestamp
        };
      });
      setChatMessages(chatData);
    });
    unsubscribeFunctions.push(unsubscribeChat);
    
    // Cleanup function
    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }, [userId]);

  // Initialize Firestore data on first load
  useEffect(() => {
    if (!userId) return;

    const initializeData = async () => {
      // Initialize code if not exists
      const codeDoc = await getDoc(codeDocRef);
      if (!codeDoc.exists()) {
        await setDoc(codeDocRef, {
          html: htmlCode,
          css: cssCode,
          js: jsCode
        });
      }

      // Initialize terminal if not exists
      const terminalDoc = await getDoc(terminalDocRef);
      if (!terminalDoc.exists()) {
        await setDoc(terminalDocRef, {
          output: terminalOutput
        });
      }

      // Initialize timer if not exists
      const timerDoc = await getDoc(timerDocRef);
      if (!timerDoc.exists()) {
        await setDoc(timerDocRef, {
          minutes: timerMinutes,
          seconds: timerSeconds,
          running: isTimerRunning,
          mode: timerMode
        });
      }
    };

    initializeData();
  }, [userId]);

  // Run code in preview
  const runCode = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `);
    doc.close();
  };

  // Terminal commands handler
  const handleTerminalCommand = async () => {
    if (!terminalCommand.trim()) return;
    
    let newOutput = [...terminalOutput, "> " + terminalCommand];
    switch (terminalCommand.trim().toLowerCase()) {
      case "help":
        newOutput.push("Commands: help, about, clear, version, quote");
        break;
      case "about":
        newOutput.push("Welcome to Dire-Dev Terminal - created for students!");
        break;
      case "version":
        newOutput.push("Dire-Dev Tools v2.0.0");
        break;
      case "clear":
        newOutput = [];
        break;
      case "quote":
        fetchQuote();
        newOutput.push("New quote generated!");
        break;
      default:
        newOutput.push("Command not found: " + terminalCommand);
    }
    
    // Update Firestore
    await updateDoc(terminalDocRef, { output: newOutput });
    setTerminalCommand("");
  };

  // Clear terminal output
  const clearTerminal = async () => {
    await updateDoc(terminalDocRef, { output: [] });
  };

  // Fetch random quote
  const fetchQuote = () => {
    const quotes = [
      "Learning never exhausts the mind.",
      "Education is the most powerful weapon to change the world.",
      "Push yourself, because no one else is going to do it for you.",
      "Small steps every day lead to big results.",
      "Study hard, no matter if it seems boring. The result will be worth it.",
      "The expert in anything was once a beginner.",
      "Your limitation—it's only your imagination.",
      "Success is the sum of small efforts, repeated day in and day out."
    ];
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(random);
  };

  // Pomodoro timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        } else {
          // Timer completed
          clearInterval(interval);
          setIsTimerRunning(false);
          
          // Play sound
          new Audio("https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3").play();
          
          // Switch mode
          if (timerMode === "work") {
            setTimerMode("shortBreak");
            setTimerMinutes(5);
          } else if (timerMode === "shortBreak") {
            setTimerMode("work");
            setTimerMinutes(25);
          }
        }
        
        // Update Firestore
        updateDoc(timerDocRef, {
          minutes: timerMinutes,
          seconds: timerSeconds,
          running: isTimerRunning,
          mode: timerMode
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  // Update code in Firestore with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userId) {
        updateDoc(codeDocRef, {
          html: htmlCode,
          css: cssCode,
          js: jsCode
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode]);

  // Todo list functions
  const addTodo = async () => {
    if (newTodo.trim()) {
      await addDoc(todosCollectionRef, {
        text: newTodo,
        completed: false
      });
      setNewTodo("");
    }
  };

  const toggleTodo = async (id: string) => {
    const todoRef = doc(todosCollectionRef, id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateDoc(todoRef, { completed: !todo.completed });
    }
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(todosCollectionRef, id));
  };

  // Notes functions
  const addNote = async () => {
    if (newNoteTitle.trim()) {
      const newNoteRef = await addDoc(notesCollectionRef, {
        title: newNoteTitle,
        content: ""
      });
      setActiveNote(newNoteRef.id);
      setNewNoteTitle("");
    }
  };

  const updateActiveNote = async (content: string) => {
    if (activeNote) {
      await updateDoc(doc(notesCollectionRef, activeNote), { content });
    }
  };

  const deleteNote = async (id: string) => {
    await deleteDoc(doc(notesCollectionRef, id));
    
    if (activeNote === id) {
      setActiveNote(notes.length > 1 ? notes[0].id : null);
    }
  };

  // Set timer mode
  const setTimer = async (minutes: number, mode: string) => {
    setTimerMinutes(minutes);
    setTimerSeconds(0);
    setTimerMode(mode);
    setIsTimerRunning(false);
    
    await updateDoc(timerDocRef, {
      minutes,
      seconds: 0,
      running: false,
      mode
    });
  };

  // Collaboration functions
  const sendMessage = async () => {
    if (newMessage.trim() && user) {
      const newMsg = {
        user: user.displayName || "You",
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: serverTimestamp()
      };
      
      await addDoc(chatCollectionRef, newMsg);
      setNewMessage("");
    }
  };

  // Insert snippet into editor
  const insertSnippet = (code: string) => {
    switch (activeTab) {
      case "html":
        setHtmlCode(htmlCode + "\n" + code);
        break;
      case "css":
        setCssCode(cssCode + "\n" + code);
        break;
      case "js":
        setJsCode(jsCode + "\n" + code);
        break;
    }
  };

  // Add new snippet
  const addSnippet = async () => {
    const name = prompt("Enter snippet name:");
    if (name) {
      await addDoc(snippetsCollectionRef, {
        name,
        code: ""
      });
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">
              Please sign in to access DevTools
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkTheme ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'} p-4 max-w-7xl mx-auto transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            DevTools Suite
          </h1>
          <Badge variant="secondary" className="hidden sm:flex bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
            <Lightbulb className="w-4 h-4 mr-1" /> v2.0
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setDarkTheme(!darkTheme)} 
            variant="outline" 
            size="icon" 
            title="Toggle theme"
            className="bg-transparent border border-purple-500/30 hover:bg-purple-500/10"
          >
            {darkTheme ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </Button>
          <Button variant="outline" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white border-0 hover:opacity-90">
            <Share2 className="w-4 h-4 mr-1" /> Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="code-editor" className="space-y-6">
        <TabsList className="w-full flex overflow-x-auto p-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
          <TabsTrigger value="code-editor" className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all">
            <FileCode className="w-4 h-4" /> Editor
          </TabsTrigger>
          <TabsTrigger value="todo-list" className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all">
            <ListTodo className="w-4 h-4" /> Todos
          </TabsTrigger>
          <TabsTrigger value="markdown-notes" className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all">
            <FileText className="w-4 h-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="terminal" className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all">
            <Terminal className="w-4 h-4" /> Terminal
          </TabsTrigger>
          <TabsTrigger value="inspiration" className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all">
            <Sparkles className="w-4 h-4" /> Inspire
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center gap-1 px-4 py-2 rounded-lg transition-all">
            <Users className="w-4 h-4" /> Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code-editor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className={isExpanded ? "col-span-2" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-purple-500" /> Code Editor
                  </CardTitle>
                  <div className="flex space-x-2">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditorTheme(editorTheme === "dark" ? "light" : "dark")} title="Toggle theme">
                        <Palette className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Font size">
                        <TextCursor className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" onClick={runCode} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                      <Play className="w-4 h-4 mr-1" /> Run
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Write and test your HTML, CSS, and JavaScript</div>
              </CardHeader>
              <CardContent>
                <div className="flex border-b mb-4">
                  <Button
                    variant={activeTab === "html" ? "default" : "ghost"}
                    onClick={() => setActiveTab("html")}
                    className="rounded-b-none"
                  >
                    HTML
                  </Button>
                  <Button
                    variant={activeTab === "css" ? "default" : "ghost"}
                    onClick={() => setActiveTab("css")}
                    className="rounded-b-none"
                  >
                    CSS
                  </Button>
                  <Button
                    variant={activeTab === "js" ? "default" : "ghost"}
                    onClick={() => setActiveTab("js")}
                    className="rounded-b-none"
                  >
                    JavaScript
                  </Button>
                </div>
                
                {activeTab === "html" && (
                  <Textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    className={`font-mono h-64 ${editorTheme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-50 text-gray-800'}`}
                  />
                )}
                {activeTab === "css" && (
                  <Textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    className={`font-mono h-64 ${editorTheme === 'dark' ? 'bg-gray-900 text-blue-400' : 'bg-gray-50 text-gray-800'}`}
                  />
                )}
                {activeTab === "js" && (
                  <Textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    className={`font-mono h-64 ${editorTheme === 'dark' ? 'bg-gray-900 text-yellow-400' : 'bg-gray-50 text-gray-800'}`}
                  />
                )}
              </CardContent>
            </Card>

            {!isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-500" /> Preview
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">See your code in action</div>
                  </CardHeader>
                  <CardContent className="p-0 h-[424px]">
                    <iframe
                      ref={iframeRef}
                      title="code-preview"
                      className="w-full h-full border-0 rounded-b-lg"
                    />
                  </CardContent>
                </Card>
                
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <LayoutTemplate className="w-5 h-5 mr-2 text-green-500" /> Snippets
                      </CardTitle>
                      <Button 
                        size="sm" 
                        onClick={addSnippet}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">Reusable code templates</div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[424px] overflow-y-auto">
                      {snippets.map(snippet => (
                        <div 
                          key={snippet.id} 
                          className="p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => insertSnippet(snippet.code)}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{snippet.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(snippetsCollectionRef, snippet.id));
                              }}
                              className="h-6 w-6 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <pre className="text-xs mt-2 text-muted-foreground overflow-x-auto">
                            {snippet.code}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="todo-list">
          <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListTodo className="w-5 h-5 mr-2 text-purple-500" /> Todo List
              </CardTitle>
              <div className="text-sm text-muted-foreground">Stay organized with your tasks</div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                  className="bg-background"
                />
                <Button onClick={addTodo} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {todos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <ListTodo className="w-12 h-12 mb-2 opacity-50" />
                    <p>No tasks yet. Add one above!</p>
                  </div>
                ) : (
                  todos.map((todo) => (
                    <div 
                      key={todo.id} 
                      className={`flex items-center p-3 rounded-lg transition-all ${todo.completed ? 'bg-green-500/10 border border-green-500/20' : 'bg-background border border-muted'} hover:shadow-sm`}
                    >
                      <div 
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 rounded-full border mr-3 cursor-pointer flex items-center justify-center ${todo.completed ? 'bg-green-500 border-green-500' : 'border-muted-foreground'}`}
                      >
                        {todo.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <label
                        className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {todo.text}
                      </label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              
              {todos.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground flex justify-between">
                  <span>
                    {todos.filter(t => t.completed).length} of {todos.length} completed
                  </span>
                  {todos.filter(t => t.completed).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        todos.filter(t => t.completed).forEach(todo => {
                          deleteDoc(doc(todosCollectionRef, todo.id));
                        });
                      }}
                      className="text-red-500"
                    >
                      Clear completed
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markdown-notes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-1 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Bookmark className="w-5 h-5 mr-2 text-purple-500" /> Notes
                  </CardTitle>
                  <Button size="sm" onClick={addNote} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Your personal markdown notes</div>
              </CardHeader>
              <CardContent className="p-0">
                {notes.length > 0 ? (
                  <div className="border-t border-muted">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        onClick={() => setActiveNote(note.id)}
                        className={`p-3 border-b cursor-pointer transition-all ${activeNote === note.id ? 'bg-purple-500/10 border-l-4 border-purple-500' : 'hover:bg-muted/10'}`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium truncate">{note.title}</h3>
                          {activeNote === note.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                              }}
                              className="h-6 w-6 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {note.content.substring(0, 50)}{note.content.length > 50 ? "..." : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mb-2 opacity-50" />
                    <p>No notes yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="text-purple-500">
                    {activeNote ? notes.find(n => n.id === activeNote)?.title || "New Note" : "Select a note"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeNote ? (
                  <>
                    <Input
                      value={notes.find(n => n.id === activeNote)?.title || ""}
                      onChange={(e) => {
                        if (activeNote) {
                          updateDoc(doc(notesCollectionRef, activeNote), {
                            title: e.target.value
                          });
                        }
                      }}
                      className="mb-4 bg-background"
                    />
                    <Textarea
                      value={notes.find(n => n.id === activeNote)?.content || ""}
                      onChange={(e) => updateActiveNote(e.target.value)}
                      className="font-mono min-h-[300px] bg-background"
                      placeholder="Write your notes here (supports markdown)..."
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <FileText className="w-12 h-12 mb-2 opacity-50" />
                    <p>No note selected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terminal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-green-500" /> Terminal Emulator
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearTerminal}
                  >
                    Clear
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Try running simple commands like "help", "about", or "clear"</div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                  {terminalOutput.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <span className="bg-gray-900 text-green-400 font-mono p-2 rounded-l-lg">$</span>
                  <Input
                    placeholder="Type a command..."
                    value={terminalCommand}
                    onChange={(e) => setTerminalCommand(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTerminalCommand()}
                    className="font-mono rounded-l-none bg-gray-900 text-green-400 border-0"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="w-5 h-5 mr-2 text-yellow-500" /> Pomodoro Timer
                </CardTitle>
                <div className="text-sm text-muted-foreground">Boost your productivity with focused work sessions</div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className={`text-5xl font-mono font-bold mb-6 ${timerMode === "work" ? "text-red-500" : "text-green-500"}`}>
                    {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                  </div>
                  
                  <div className="flex space-x-2 mb-6">
                    <Button
                      variant={timerMode === "work" ? "default" : "outline"}
                      onClick={() => setTimer(25, "work")}
                      className={timerMode === "work" ? "bg-red-500" : ""}
                    >
                      Work
                    </Button>
                    <Button
                      variant={timerMode === "shortBreak" ? "default" : "outline"}
                      onClick={() => setTimer(5, "shortBreak")}
                      className={timerMode === "shortBreak" ? "bg-green-500" : ""}
                    >
                      Short Break
                    </Button>
                    <Button
                      variant={timerMode === "longBreak" ? "default" : "outline"}
                      onClick={() => setTimer(15, "longBreak")}
                    >
                      Long Break
                    </Button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => {
                        setIsTimerRunning(!isTimerRunning);
                        updateDoc(timerDocRef, {
                          running: !isTimerRunning
                        });
                      }}
                      className={`w-24 ${isTimerRunning ? "bg-yellow-500" : "bg-green-500"}`}
                    >
                      {isTimerRunning ? "Pause" : "Start"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTimer(timerMode === "work" ? 25 : timerMode === "shortBreak" ? 5 : 15, timerMode);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inspiration">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" /> Daily Motivation
                </CardTitle>
                <div className="text-white/80">Get inspired while you work!</div>
              </CardHeader>
              <CardContent>
                <blockquote className="italic border-l-4 border-white pl-4 text-lg mb-4">{quote}</blockquote>
                <Button onClick={fetchQuote} className="bg-white text-black hover:bg-gray-200">
                  <Wand2 className="w-4 h-4 mr-2" /> New Quote
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="w-5 h-5 mr-2 text-blue-500" /> Quick Tips
                </CardTitle>
                <div className="text-sm text-muted-foreground">Productivity tips for developers</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="bg-purple-500 w-3 h-3 rounded-full mr-2"></span>
                      The 20-20-20 Rule
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="bg-blue-500 w-3 h-3 rounded-full mr-2"></span>
                      Pomodoro Technique
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                    <h3 className="font-medium mb-2 flex items-center">
                      <span className="bg-green-500 w-3 h-3 rounded-full mr-2"></span>
                      DRY Principle
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Don't Repeat Yourself - reuse code through functions and components to keep your codebase clean.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collaboration">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-500" /> Team Members
                </CardTitle>
                <div className="text-sm text-muted-foreground">Online collaborators</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {collaborators.map(collab => (
                    <div key={collab.id} className="flex items-center p-3 rounded-lg bg-background border border-muted">
                      <div className={`w-3 h-3 rounded-full mr-3 ${collab.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="font-medium">{collab.name}</span>
                      {collab.online && (
                        <span className="ml-auto text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                          Online
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Invite Collaborator
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-500" /> Team Chat
                </CardTitle>
                <div className="text-sm text-muted-foreground">Communicate with your team in real-time</div>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto mb-4 space-y-4">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.user === "You" ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-xl ${msg.user === "You" ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                        <div className="font-medium">{msg.user}</div>
                        <div className="mt-1">{msg.text}</div>
                        <div className={`text-xs mt-1 ${msg.user === "You" ? 'text-blue-100' : 'text-muted-foreground'}`}>{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="bg-background"
                  />
                  <Button onClick={sendMessage} className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        DevTools Suite v2.0 • Made with ❤️ for developers
      </footer>
    </div>
  );
};

export default DevTools;