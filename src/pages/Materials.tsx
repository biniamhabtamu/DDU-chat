import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Book, 
  Download, 
  Search, 
  Filter,
  Upload,
  FileText,
  FileImage,
  Video,
  Code,
  Star,
  Eye,
  Calendar,
  User
} from "lucide-react";

const Materials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Materials", count: 156 },
    { id: "programming", name: "Programming", count: 45 },
    { id: "mathematics", name: "Mathematics", count: 32 },
    { id: "engineering", name: "Engineering", count: 28 },
    { id: "physics", name: "Physics", count: 23 },
    { id: "chemistry", name: "Chemistry", count: 18 },
    { id: "literature", name: "Literature", count: 10 }
  ];

  const materials = [
    {
      id: 1,
      title: "Complete JavaScript Guide for Beginners",
      type: "pdf",
      category: "programming",
      author: "Biniam Habtamu",
      downloadCount: 245,
      rating: 4.8,
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      description: "Comprehensive guide covering JavaScript fundamentals, ES6+ features, and modern development practices.",
      tags: ["JavaScript", "Web Development", "Programming Basics"]
    },
    {
      id: 2,
      title: "Data Structures and Algorithms",
      type: "pdf",
      category: "programming",
      author: "Dr. Sarah Moges",
      downloadCount: 189,
      rating: 4.9,
      size: "5.2 MB",
      uploadDate: "2024-01-10",
      description: "Essential data structures and algorithms with examples in multiple programming languages.",
      tags: ["DSA", "Computer Science", "Problem Solving"]
    },
    {
      id: 3,
      title: "Linear Algebra Lecture Notes",
      type: "pdf",
      category: "mathematics",
      author: "Prof. David Wilson",
      downloadCount: 156,
      rating: 4.7,
      size: "3.8 MB",
      uploadDate: "2024-01-08",
      description: "Comprehensive lecture notes covering vectors, matrices, eigenvalues, and linear transformations.",
      tags: ["Linear Algebra", "Mathematics", "Engineering Math"]
    },
    {
      id: 4,
      title: "React.js Tutorial Series",
      type: "video",
      category: "programming",
      author: "Meron Tadesse",
      downloadCount: 312,
      rating: 4.9,
      size: "450 MB",
      uploadDate: "2024-01-12",
      description: "Complete React.js course covering hooks, state management, and building real-world applications.",
      tags: ["React", "Frontend", "Web Development"]
    },
    {
      id: 5,
      title: "Thermodynamics Problem Solutions",
      type: "pdf",
      category: "engineering",
      author: "Dr. John Anderson",
      downloadCount: 98,
      rating: 4.6,
      size: "1.9 MB",
      uploadDate: "2024-01-05",
      description: "Detailed solutions to thermodynamics problems with step-by-step explanations.",
      tags: ["Thermodynamics", "Engineering", "Problem Solving"]
    },
    {
      id: 6,
      title: "Python for Data Science",
      type: "pdf",
      category: "programming",
      author: "Lisa Chen",
      downloadCount: 201,
      rating: 4.8,
      size: "4.1 MB",
      uploadDate: "2024-01-01",
      description: "Learn Python programming with focus on data analysis, visualization, and machine learning.",
      tags: ["Python", "Data Science", "Machine Learning"]
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return FileText;
      case "video": return Video;
      case "image": return FileImage;
      case "code": return Code;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "pdf": return "bg-destructive";
      case "video": return "bg-primary";
      case "image": return "bg-success";
      case "code": return "bg-accent";
      default: return "bg-muted";
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Dev-Materials & Resources
          </h1>
          <p className="text-muted-foreground">
            Access free textbooks, PDFs, videos, and study materials shared by your peers
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Button className="w-full bg-gradient-primary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Material
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Ahmed Hassan</p>
                  <p className="text-muted-foreground">uploaded JavaScript Guide</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Sarah Mohammed</p>
                  <p className="text-muted-foreground">shared Linear Algebra notes</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Meron Tadesse</p>
                  <p className="text-muted-foreground">uploaded React tutorial</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="grid" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Showing {filteredMaterials.length} of {materials.length} materials</span>
                </div>
              </div>

              {/* Grid View */}
              <TabsContent value="grid">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMaterials.map((material) => {
                    const FileIcon = getFileIcon(material.type);
                    return (
                      <Card key={material.id} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className={`w-12 h-12 rounded-lg ${getTypeColor(material.type)} flex items-center justify-center mb-3`}>
                              <FileIcon className="w-6 h-6 text-white" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {material.type.toUpperCase()}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                            {material.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {material.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {material.author}
                              </div>
                              <div className="flex items-center">
                                <Download className="w-4 h-4 mr-1" />
                                {material.downloadCount}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{material.rating}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{material.size}</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {material.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {material.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{material.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex space-x-2 pt-2">
                              <Button className="flex-1 bg-gradient-primary">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              <Button variant="outline" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* List View */}
              <TabsContent value="list">
                <div className="space-y-4">
                  {filteredMaterials.map((material) => {
                    const FileIcon = getFileIcon(material.type);
                    return (
                      <Card key={material.id} className="hover:shadow-soft transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg ${getTypeColor(material.type)} flex items-center justify-center flex-shrink-0`}>
                              <FileIcon className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold truncate">{material.title}</h3>
                                <Badge variant="outline" className="ml-2 flex-shrink-0">
                                  {material.type.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {material.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    {material.author}
                                  </div>
                                  <div className="flex items-center">
                                    <Download className="w-4 h-4 mr-1" />
                                    {material.downloadCount}
                                  </div>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                                    {material.rating}
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(material.uploadDate).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                  </Button>
                                  <Button size="sm" className="bg-gradient-primary">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;