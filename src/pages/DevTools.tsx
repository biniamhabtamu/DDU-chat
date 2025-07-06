import { useState } from "react";
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
  Settings
} from "lucide-react";

const DevTools = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
</head>
<body>
    <h1>Hello, Dire-Dev!</h1>
    <p>Start coding your amazing project here.</p>
</body>
</html>`);

  const [cssCode, setCssCode] = useState(`body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    text-align: center;
    font-size: 1.2rem;
}`);

  const [jsCode, setJsCode] = useState(`// Welcome to Dire-Dev Code Editor
console.log("Hello, Dire Dawa University!");

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    const heading = document.querySelector('h1');
    if (heading) {
        heading.style.animation = 'fadeIn 2s ease-in';
    }
});`);

  const [todos, setTodos] = useState([
    { id: 1, text: "Complete React project", completed: false, priority: "high" },
    { id: 2, text: "Study for Data Structures exam", completed: true, priority: "medium" },
    { id: 3, text: "Submit assignment by Friday", completed: false, priority: "high" },
    { id: 4, text: "Review JavaScript fundamentals", completed: false, priority: "low" },
  ]);

  const [newTodo, setNewTodo] = useState("");
  const [markdownText, setMarkdownText] = useState(`# My Study Notes

## JavaScript Fundamentals

### Variables and Data Types
- \`let\` and \`const\` for variable declarations
- String, Number, Boolean, Array, Object

### Functions
\`\`\`javascript
function greetStudent(name) {
    return \`Hello, \${name}! Welcome to Dire-Dev!\`;
}
\`\`\`

### Key Concepts
1. **Hoisting** - Variable and function declarations are moved to the top
2. **Closures** - Functions have access to outer scope
3. **Promises** - Handle asynchronous operations

> **Pro Tip:** Always use \`const\` by default, use \`let\` when you need to reassign

---

**Remember:** Practice makes perfect! 🚀`);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        priority: "medium"
      }]);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const getCompletedTodos = () => todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Dev-Tools Suite
          </h1>
          <p className="text-muted-foreground">
            Everything you need for coding, planning, and learning
          </p>
        </div>

        <Tabs defaultValue="code-editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="code-editor" className="flex items-center space-x-2">
              <FileCode className="w-4 h-4" />
              <span>Code Editor</span>
            </TabsTrigger>
            <TabsTrigger value="todo-list" className="flex items-center space-x-2">
              <ListTodo className="w-4 h-4" />
              <span>Todo List</span>
            </TabsTrigger>
            <TabsTrigger value="markdown-notes" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </TabsTrigger>
          </TabsList>

          {/* Code Editor */}
          <TabsContent value="code-editor">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        Live Code Editor
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Write HTML, CSS, and JavaScript with live preview
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="html" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="html" className="mt-4">
                        <Textarea
                          placeholder="Enter your HTML code..."
                          value={htmlCode}
                          onChange={(e) => setHtmlCode(e.target.value)}
                          className="font-mono text-sm h-64 resize-none"
                        />
                      </TabsContent>
                      
                      <TabsContent value="css" className="mt-4">
                        <Textarea
                          placeholder="Enter your CSS code..."
                          value={cssCode}
                          onChange={(e) => setCssCode(e.target.value)}
                          className="font-mono text-sm h-64 resize-none"
                        />
                      </TabsContent>
                      
                      <TabsContent value="js" className="mt-4">
                        <Textarea
                          placeholder="Enter your JavaScript code..."
                          value={jsCode}
                          onChange={(e) => setJsCode(e.target.value)}
                          className="font-mono text-sm h-64 resize-none"
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Live Preview
                      </span>
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg h-96 bg-white">
                      <iframe
                        className="w-full h-full rounded-lg"
                        srcDoc={`
                          ${htmlCode}
                          <style>${cssCode}</style>
                          <script>${jsCode}</script>
                        `}
                        title="Live Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Todo List */}
          <TabsContent value="todo-list">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <ListTodo className="w-5 h-5 mr-2" />
                        My Tasks
                      </span>
                      <Badge variant="secondary">
                        {getCompletedTodos()}/{todos.length} completed
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Stay organized with your study and project tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2 mb-4">
                      <Input
                        placeholder="Add a new task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addTodo()}
                        className="flex-1"
                      />
                      <Button onClick={addTodo} className="bg-gradient-primary">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {todos.map((todo) => (
                        <div
                          key={todo.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                            todo.completed ? "bg-muted/50 opacity-75" : "bg-card"
                          }`}
                        >
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                          />
                          <div className="flex-1">
                            <p className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                              {todo.text}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-xs mt-1 ${getPriorityColor(todo.priority)}`}
                            >
                              {todo.priority} priority
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
                      <div className="text-2xl font-bold">{getCompletedTodos()}</div>
                      <div className="text-sm opacity-90">Tasks Completed</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-card rounded-lg border">
                      <div className="text-2xl font-bold text-warning">{todos.filter(t => !t.completed && t.priority === "high").length}</div>
                      <div className="text-sm text-muted-foreground">High Priority</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-card rounded-lg border">
                      <div className="text-2xl font-bold text-success">{Math.round((getCompletedTodos() / todos.length) * 100)}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Markdown Notes */}
          <TabsContent value="markdown-notes">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Markdown Editor
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save Notes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Write formatted notes with Markdown syntax
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write your notes in Markdown..."
                    value={markdownText}
                    onChange={(e) => setMarkdownText(e.target.value)}
                    className="font-mono text-sm h-96 resize-none"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </CardTitle>
                  <CardDescription>
                    See how your markdown will be rendered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none h-96 overflow-y-auto border rounded-lg p-4 bg-muted/30">
                    <div dangerouslySetInnerHTML={{ 
                      __html: markdownText
                        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
                        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
                        .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
                        .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
                        .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
                        .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>')
                        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground">$1</blockquote>')
                        .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
                        .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
                        .replace(/\n/gim, '<br>')
                    }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DevTools;