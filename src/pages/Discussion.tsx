import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Search,
  Pin,
  Clock,
  Eye,
  CheckCircle2,
  Tag,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Code,
  BookOpen
} from "lucide-react";

const Discussion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Discussions", count: 156, icon: MessageCircle },
    { id: "programming", name: "Programming", count: 45, icon: Code },
    { id: "mathematics", name: "Mathematics", count: 32, icon: BookOpen },
    { id: "help", name: "Help & Support", count: 28, icon: HelpCircle },
    { id: "projects", name: "Projects", count: 23, icon: Lightbulb },
    { id: "general", name: "General", count: 18, icon: MessageCircle }
  ];

  const discussions = [
    {
      id: 1,
      title: "How to handle authentication in React applications?",
      content: "I'm building a React app and struggling with implementing user authentication. Should I use JWT tokens or session-based auth? What are the best practices?",
      author: "Biniam Habtamu",
      authorAvatar: "AH",
      category: "programming",
      tags: ["React", "Authentication", "Security"],
      upvotes: 24,
      replies: 8,
      views: 156,
      createdAt: "2024-01-15T10:30:00Z",
      isPinned: false,
      isSolved: false,
      lastActivity: "2 hours ago"
    },
    {
      id: 2,
      title: "Linear Algebra: Eigenvalues and Eigenvectors explained",
      content: "Can someone explain the concept of eigenvalues and eigenvectors in simple terms? I'm having trouble understanding their practical applications.",
      author: "Sara Mogese",
      authorAvatar: "SM",
      category: "mathematics",
      tags: ["Linear Algebra", "Mathematics", "Eigenvalues"],
      upvotes: 18,
      replies: 12,
      views: 89,
      createdAt: "2024-01-14T14:20:00Z",
      isPinned: true,
      isSolved: true,
      lastActivity: "4 hours ago"
    },
    {
      id: 3,
      title: "Group Project: Building a University Management System",
      content: "Looking for team members to build a comprehensive university management system. We need frontend developers, backend developers, and UI/UX designers.",
      author: "Meron Tadesse",
      authorAvatar: "MT",
      category: "projects",
      tags: ["Project", "Team", "Full-Stack"],
      upvotes: 32,
      replies: 15,
      views: 203,
      createdAt: "2024-01-13T09:15:00Z",
      isPinned: false,
      isSolved: false,
      lastActivity: "1 hour ago"
    },
    {
      id: 4,
      title: "Best resources for learning Data Structures and Algorithms?",
      content: "I'm preparing for technical interviews and need good resources for DSA. What books, courses, or websites do you recommend?",
      author: "David Wilson",
      authorAvatar: "DW",
      category: "help",
      tags: ["DSA", "Interview Prep", "Resources"],
      upvotes: 15,
      replies: 20,
      views: 145,
      createdAt: "2024-01-12T16:45:00Z",
      isPinned: false,
      isSolved: true,
      lastActivity: "6 hours ago"
    },
    {
      id: 5,
      title: "Python vs JavaScript: Which should I learn first?",
      content: "I'm new to programming and can't decide between Python and JavaScript as my first language. What are your thoughts?",
      author: "Lisa Chen",
      authorAvatar: "LC",
      category: "programming",
      tags: ["Python", "JavaScript", "Beginner"],
      upvotes: 28,
      replies: 25,
      views: 312,
      createdAt: "2024-01-11T11:30:00Z",
      isPinned: false,
      isSolved: false,
      lastActivity: "30 minutes ago"
    }
  ];

  const trendingTopics = [
    { name: "React Hooks", count: 15 },
    { name: "Machine Learning", count: 12 },
    { name: "Web Development", count: 18 },
    { name: "Data Science", count: 9 },
    { name: "Mobile Development", count: 7 }
  ];

  const topContributors = [
    { name: "Biniam Habtamu", avatar: "AH", points: 245, badge: "Expert" },
    { name: "Sara Moges", avatar: "SM", points: 189, badge: "Helper" },
    { name: "Meron Tadesse", avatar: "MT", points: 156, badge: "Mentor" },
    { name: "David Wilson", avatar: "DW", points: 134, badge: "Helper" }
  ];

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Expert": return "bg-primary";
      case "Mentor": return "bg-accent";
      case "Helper": return "bg-secondary";
      default: return "bg-muted";
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
                Discussion Forum
              </h1>
              <p className="text-muted-foreground">
                Ask questions, share knowledge, and connect with your peers
              </p>
            </div>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
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
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{topic.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {topic.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topContributors.map((contributor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gradient-primary text-white">
                        {contributor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{contributor.name}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">{contributor.points} pts</span>
                        <Badge className={`text-xs ${getBadgeColor(contributor.badge)} text-white`}>
                          {contributor.badge}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="recent" className="space-y-6">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="solved">Solved</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-soft transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                          <button className="p-1 hover:bg-muted rounded">
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium">{discussion.upvotes}</span>
                          <button className="p-1 hover:bg-muted rounded">
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {discussion.isPinned && (
                                <Pin className="w-4 h-4 text-primary flex-shrink-0" />
                              )}
                              {discussion.isSolved && (
                                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                              )}
                              <h3 className="text-lg font-semibold hover:text-primary cursor-pointer">
                                {discussion.title}
                              </h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {discussion.content}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs bg-gradient-primary text-white">
                                    {discussion.authorAvatar}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{discussion.author}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {discussion.replies}
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {discussion.views}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {discussion.lastActivity}
                              </div>
                            </div>

                            <Badge variant="outline" className="text-xs capitalize">
                              {discussion.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Popular Discussions</h3>
                  <p className="text-muted-foreground">
                    Discussions sorted by engagement and upvotes
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="solved" className="space-y-4">
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-4" />
                  <h3 className="text-lg font-medium mb-2">Solved Discussions</h3>
                  <p className="text-muted-foreground">
                    Questions that have been marked as solved
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-4">
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 mx-auto text-warning mb-4" />
                  <h3 className="text-lg font-medium mb-2">Unanswered Questions</h3>
                  <p className="text-muted-foreground">
                    Questions that need your help and expertise
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;