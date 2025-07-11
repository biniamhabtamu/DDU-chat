import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Code,
  Play,
  Save,
  Download,
  CheckCircle2,
  Plus,
  Trash2,
  FileCode,
  FileText,
  ListTodo,
  Eye,
  Settings,
  Terminal,
  Sparkles,
  SunMoon,
  Lightbulb,
  Wand2,
  Timer,
  Bookmark,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2
} from "lucide-react";

const DevTools = () => {
  // Code Editor State
  const [htmlCode, setHtmlCode] = useState("<h1>Hello, Dire-Dev!</h1>\n<p>Start coding here...</p>");
  const [cssCode, setCssCode] = useState("h1 { \n  color: purple; \n  font-family: sans-serif;\n}");
  const [jsCode, setJsCode] = useState("// JavaScript goes here\nconsole.log('Hello Dire-Dev')");
  const [activeTab, setActiveTab] = useState("html");
  const [output, setOutput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Terminal State
  const [terminalOutput, setTerminalOutput] = useState([
    "> help",
    "Commands: help, about, clear, version, quote",
    "> about",
    "Welcome to Dire-Dev Terminal - created for students!"
  ]);
  const [terminalCommand, setTerminalCommand] = useState("");
  
  // Theme & UI State
  const [darkTheme, setDarkTheme] = useState(true);
  const [quote, setQuote] = useState(
    "The beautiful thing about learning is that no one can take it away from you."
  );
  
  // Pomodoro Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("work"); // work/shortBreak/longBreak
  
  // Todo List State
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React hooks", completed: false },
    { id: 2, text: "Build a project", completed: true },
    { id: 3, text: "Read documentation", completed: false }
  ]);
  const [newTodo, setNewTodo] = useState("");
  
  // Notes State
  const [notes, setNotes] = useState([
    { id: 1, title: "Meeting Notes", content: "- Discuss project timeline\n- Review designs" },
    { id: 2, title: "Learning Resources", content: "React docs: https://react.dev\nTailwind docs: https://tailwindcss.com" }
  ]);
  const [activeNote, setActiveNote] = useState(1);
  const [newNoteTitle, setNewNoteTitle] = useState("");

  // Run code in preview
  const runCode = () => {
    const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
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
  const handleTerminalCommand = () => {
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
    setTerminalOutput(newOutput);
    setTerminalCommand("");
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
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerMinutes, timerSeconds, timerMode]);

  // Todo list functions
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Notes functions
  const addNote = () => {
    if (newNoteTitle.trim()) {
      const newId = Date.now();
      setNotes([...notes, { id: newId, title: newNoteTitle, content: "" }]);
      setActiveNote(newId);
      setNewNoteTitle("");
    }
  };

  const updateActiveNote = (content: string) => {
    setNotes(notes.map(note => 
      note.id === activeNote ? { ...note, content } : note
    ));
  };

  const deleteNote = (id: number) => {
    if (notes.length > 1) {
      setNotes(notes.filter(note => note.id !== id));
      setActiveNote(notes[0].id);
    }
  };

  // Set timer mode
  const setTimer = (minutes: number, mode: string) => {
    setTimerMinutes(minutes);
    setTimerSeconds(0);
    setTimerMode(mode);
    setIsTimerRunning(false);
  };

  return (
    <div className={`min-h-screen ${darkTheme ? 'dark bg-gray-900' : 'bg-gray-50'} p-4 max-w-7xl mx-auto transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            DevTools Suite
          </h1>
          <Badge variant="secondary" className="hidden sm:flex">
            <Lightbulb className="w-4 h-4 mr-1" /> v2.0
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setDarkTheme(!darkTheme)} variant="ghost" size="icon" title="Toggle theme">
            <SunMoon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="code-editor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:w-auto lg:grid-cols-5 gap-1">
          <TabsTrigger value="code-editor" className="flex items-center gap-1">
            <FileCode className="w-4 h-4" /> Editor
          </TabsTrigger>
          <TabsTrigger value="todo-list" className="flex items-center gap-1">
            <ListTodo className="w-4 h-4" /> Todos
          </TabsTrigger>
          <TabsTrigger value="markdown-notes" className="flex items-center gap-1">
            <FileText className="w-4 h-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="terminal" className="flex items-center gap-1">
            <Terminal className="w-4 h-4" /> Terminal
          </TabsTrigger>
          <TabsTrigger value="inspiration" className="flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Inspire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code-editor">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className={isExpanded ? "col-span-2" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2" /> Code Editor
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" onClick={runCode}>
                      <Play className="w-4 h-4 mr-1" /> Run
                    </Button>
                  </div>
                </div>
                <CardDescription>Write and test your HTML, CSS, and JavaScript</CardDescription>
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
                    className="font-mono h-64"
                  />
                )}
                {activeTab === "css" && (
                  <Textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    className="font-mono h-64"
                  />
                )}
                {activeTab === "js" && (
                  <Textarea
                    value={jsCode}
                    onChange={(e) => setJsCode(e.target.value)}
                    className="font-mono h-64"
                  />
                )}
              </CardContent>
            </Card>

            {!isExpanded && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" /> Preview
                  </CardTitle>
                  <CardDescription>See your code in action</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[424px]">
                  <iframe
                    id="preview-iframe"
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>${cssCode}</style>
                        </head>
                        <body>${htmlCode}
                          <script>${jsCode}</script>
                        </body>
                      </html>
                    `}
                    className="w-full h-full border-0 rounded-b-lg"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="todo-list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListTodo className="w-5 h-5 mr-2" /> Todo List
              </CardTitle>
              <CardDescription>Stay organized with your tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <Button onClick={addTodo}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {todos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No tasks yet. Add one above!</p>
                ) : (
                  todos.map((todo) => (
                    <div key={todo.id} className="flex items-center p-3 border rounded-lg hover:bg-muted/50">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="mr-3"
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
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
                      onClick={() => setTodos(todos.filter(t => !t.completed))}
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
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Bookmark className="w-5 h-5 mr-2" /> Notes
                  </CardTitle>
                  <Button size="sm" onClick={addNote}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>Your personal markdown notes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-t">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => setActiveNote(note.id)}
                      className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${activeNote === note.id ? "bg-muted" : ""}`}
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
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {notes.find(n => n.id === activeNote)?.title || "Select a note"}
                </CardTitle>
                <CardDescription>
                  {activeNote ? "Write in markdown format" : "Create or select a note to edit"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeNote ? (
                  <>
                    <Input
                      value={notes.find(n => n.id === activeNote)?.title || ""}
                      onChange={(e) => {
                        const updatedNotes = notes.map(note => 
                          note.id === activeNote ? { ...note, title: e.target.value } : note
                        );
                        setNotes(updatedNotes);
                      }}
                      className="mb-4"
                    />
                    <Textarea
                      value={notes.find(n => n.id === activeNote)?.content || ""}
                      onChange={(e) => updateActiveNote(e.target.value)}
                      className="font-mono min-h-[300px]"
                      placeholder="Write your notes here (supports markdown)..."
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                    <FileText className="w-12 h-12 mb-2" />
                    <p>No note selected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="terminal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="w-5 h-5 mr-2" /> Terminal Emulator
                </CardTitle>
                <CardDescription>Try running simple commands like "help", "about", or "clear"</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-y-auto">
                  {terminalOutput.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <span className="bg-black text-green-400 font-mono p-2 rounded-l-lg">$</span>
                  <Input
                    placeholder="Type a command..."
                    value={terminalCommand}
                    onChange={(e) => setTerminalCommand(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTerminalCommand()}
                    className="font-mono rounded-l-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="w-5 h-5 mr-2" /> Pomodoro Timer
                </CardTitle>
                <CardDescription>Boost your productivity with focused work sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-mono font-bold mb-6">
                    {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                  </div>
                  
                  <div className="flex space-x-2 mb-6">
                    <Button
                      variant={timerMode === "work" ? "default" : "outline"}
                      onClick={() => setTimer(25, "work")}
                    >
                      Work
                    </Button>
                    <Button
                      variant={timerMode === "shortBreak" ? "default" : "outline"}
                      onClick={() => setTimer(5, "shortBreak")}
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
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="w-24"
                    >
                      {isTimerRunning ? "Pause" : "Start"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTimer(timerMode === "work" ? 25 : timerMode === "shortBreak" ? 5 : 15, timerMode);
                        setIsTimerRunning(false);
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
            <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" /> Daily Motivation
                </CardTitle>
                <CardDescription className="text-white/80">Get inspired while you work!</CardDescription>
              </CardHeader>
              <CardContent>
                <blockquote className="italic border-l-4 border-white pl-4 text-lg mb-4">{quote}</blockquote>
                <Button onClick={fetchQuote} className="bg-white text-black hover:bg-gray-200">
                  <Wand2 className="w-4 h-4 mr-2" /> New Quote
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheck className="w-5 h-5 mr-2" /> Quick Tips
                </CardTitle>
                <CardDescription>Productivity tips for developers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">The 20-20-20 Rule</h3>
                    <p className="text-sm text-muted-foreground">
                      Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Pomodoro Technique</h3>
                    <p className="text-sm text-muted-foreground">
                      Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">DRY Principle</h3>
                    <p className="text-sm text-muted-foreground">
                      Don't Repeat Yourself - reuse code through functions and components to keep your codebase clean.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevTools;