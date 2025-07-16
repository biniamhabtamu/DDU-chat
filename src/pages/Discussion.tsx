// src/app/discussion/page.tsx
"use client";

import { useState, useEffect, useLayoutEffect } from "react";
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
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy, 
  Timestamp,
  updateDoc,
  doc,
  increment,
  getDoc
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

// Custom media query hook to replace react-responsive
const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener("resize", checkMobile);
    
    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const Discussion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    tags: "",
    category: "general"
  });
  const [newComment, setNewComment] = useState("");
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [viewedDiscussions, setViewedDiscussions] = useState<string[]>([]);
  
  const isMobile = useMediaQuery();

  const categories = [
    { id: "all", name: "All Discussions", count: 0, icon: MessageCircle },
    { id: "programming", name: "Programming", count: 0, icon: Code },
    { id: "mathematics", name: "Mathematics", count: 0, icon: BookOpen },
    { id: "help", name: "Help & Support", count: 0, icon: HelpCircle },
    { id: "projects", name: "Projects", count: 0, icon: Lightbulb },
    { id: "general", name: "General", count: 0, icon: MessageCircle }
  ];

  const trendingTopics = [
    { name: "React Hooks", count: 15 },
    { name: "Machine Learning", count: 12 },
    { name: "Web Development", count: 18 },
    { name: "Data Science", count: 9 },
    { name: "Mobile Development", count: 7 }
  ];

  const topContributors = [
    { name: "Biniam Habtamu", avatar: "BH", points: 245, badge: "Expert" },
    { name: "Sara Moges", avatar: "SM", points: 189, badge: "Helper" },
    { name: "Meron Tadesse", avatar: "MT", points: 156, badge: "Mentor" },
    { name: "David Wilson", avatar: "DW", points: 134, badge: "Helper" }
  ];

  // Fetch discussions from Firestore
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          lastActivity: formatDistanceToNow(
            data.createdAt?.toDate() || new Date(), 
            { addSuffix: true }
          )
        };
      });
      
      // Update discussion counts for categories
      const updatedCategories = [...categories];
      updatedCategories.forEach(cat => {
        if (cat.id === "all") {
          cat.count = docs.length;
        } else {
          cat.count = docs.filter(d => d.category === cat.id).length;
        }
      });
      
      setDiscussions(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch comments when discussion detail is opened
  useEffect(() => {
    if (!selectedDiscussion) return;
    
    const commentsRef = collection(db, "discussions", selectedDiscussion.id, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setComments(commentsData);
    });
    
    return () => unsubscribe();
  }, [selectedDiscussion]);

  // Create new discussion
  const createDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.content) return;
    
    try {
      await addDoc(collection(db, "discussions"), {
        ...newDiscussion,
        tags: newDiscussion.tags.split(",").map(tag => tag.trim()),
        author: "Current User",
        authorAvatar: "CU",
        upvotes: 0,
        downvotes: 0,
        replies: 0,
        views: 0,
        isPinned: false,
        isSolved: false,
        createdAt: Timestamp.now()
      });
      setIsModalOpen(false);
      setNewDiscussion({ title: "", content: "", tags: "", category: "general" });
    } catch (error) {
      console.error("Error adding discussion: ", error);
    }
  };

  // Add comment to discussion
  const addComment = async () => {
    if (!newComment.trim() || !selectedDiscussion) return;
    
    try {
      await addDoc(collection(db, "discussions", selectedDiscussion.id, "comments"), {
        content: newComment,
        author: "Current User",
        authorAvatar: "CU",
        createdAt: Timestamp.now(),
        upvotes: 0
      });
      
      // Update the discussion's reply count
      await updateDoc(doc(db, "discussions", selectedDiscussion.id), {
        replies: increment(1)
      });
      
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  // Handle voting for discussions
  const handleVote = async (discussionId: string, type: 'upvote' | 'downvote') => {
    try {
      const discussionRef = doc(db, "discussions", discussionId);
      
      if (type === 'upvote') {
        await updateDoc(discussionRef, {
          upvotes: increment(1)
        });
      } else {
        await updateDoc(discussionRef, {
          downvotes: increment(1)
        });
      }
    } catch (error) {
      console.error("Error updating vote: ", error);
    }
  };

  // Handle voting for comments
  const handleCommentVote = async (commentId: string) => {
    if (!selectedDiscussion) return;
    
    try {
      const commentRef = doc(db, "discussions", selectedDiscussion.id, "comments", commentId);
      await updateDoc(commentRef, {
        upvotes: increment(1)
      });
    } catch (error) {
      console.error("Error updating comment vote: ", error);
    }
  };

  // Track view for a discussion
  const trackView = async (discussionId: string) => {
    if (viewedDiscussions.includes(discussionId)) return;
    
    try {
      const discussionRef = doc(db, "discussions", discussionId);
      await updateDoc(discussionRef, {
        views: increment(1)
      });
      
      setViewedDiscussions(prev => [...prev, discussionId]);
    } catch (error) {
      console.error("Error tracking view: ", error);
    }
  };

  // Open discussion detail
  const openDiscussionDetail = async (discussion: any) => {
    trackView(discussion.id);
    setSelectedDiscussion(discussion);
    setIsDetailOpen(true);
  };

  // Close discussion detail
  const closeDiscussionDetail = () => {
    setIsDetailOpen(false);
    setSelectedDiscussion(null);
    setComments([]);
  };

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.tags.some((tag: string) => 
                           tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort discussions based on active tab
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (activeTab === "recent") {
      return b.createdAt - a.createdAt;
    } else if (activeTab === "popular") {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else if (activeTab === "solved") {
      return b.isSolved ? 1 : -1;
    } else if (activeTab === "unanswered") {
      return a.replies === 0 ? -1 : 1;
    }
    return 0;
  });

  // Pagination
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedDiscussions = sortedDiscussions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedDiscussions.length / itemsPerPage);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Expert": return "bg-primary";
      case "Mentor": return "bg-accent";
      case "Helper": return "bg-secondary";
      default: return "bg-muted";
    }
  };

  // Responsive layout
  if (isDetailOpen && selectedDiscussion) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={closeDiscussionDetail}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Discussions
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="flex flex-col items-center space-y-2 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleVote(selectedDiscussion.id, 'upvote')}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </Button>
                  <span className="text-lg font-bold">
                    {selectedDiscussion.upvotes - selectedDiscussion.downvotes}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleVote(selectedDiscussion.id, 'downvote')}
                  >
                    <ArrowDown className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {selectedDiscussion.isPinned && (
                        <Badge variant="default" className="flex items-center">
                          <Pin className="w-4 h-4 mr-1" /> Pinned
                        </Badge>
                      )}
                      {selectedDiscussion.isSolved && (
                        <Badge variant="success" className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Solved
                        </Badge>
                      )}
                      <h1 className="text-2xl font-bold">{selectedDiscussion.title}</h1>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700">{selectedDiscussion.content}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDiscussion.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {selectedDiscussion.authorAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedDiscussion.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(selectedDiscussion.createdAt, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {selectedDiscussion.replies} replies
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {selectedDiscussion.views} views
                      </div>
                      <Badge variant="outline" className="text-sm capitalize">
                        {selectedDiscussion.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            
            {/* Comment form */}
            <div className="mb-6">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-primary text-white">CU</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    placeholder="Add your comment..."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none min-h-[100px]"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button onClick={addComment}>
                      <Send className="w-4 h-4 mr-2" /> Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments list */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleCommentVote(comment.id)}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">{comment.upvotes}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-muted">
                                {comment.authorAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* New Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-lg w-full max-w-md border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">New Discussion</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
              />
              
              <textarea
                placeholder="Content"
                className="w-full p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-primary focus:outline-none"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({...newDiscussion, content: e.target.value})}
              />
              
              <Input
                placeholder="Tags (comma separated)"
                value={newDiscussion.tags}
                onChange={(e) => setNewDiscussion({...newDiscussion, tags: e.target.value})}
              />
              
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={newDiscussion.category}
                onChange={(e) => setNewDiscussion({...newDiscussion, category: e.target.value})}
              >
                <option value="general">General</option>
                <option value="programming">Programming</option>
                <option value="mathematics">Mathematics</option>
                <option value="help">Help & Support</option>
                <option value="projects">Projects</option>
              </select>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createDiscussion}>
                  Create Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary mb-2">
                Discussion Forum
              </h1>
              <p className="text-muted-foreground">
                Ask questions, share knowledge, and connect with your peers
              </p>
            </div>
            <Button 
              className="bg-gradient-primary hover:opacity-90 transition-opacity w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Hidden on mobile when not expanded */}
          {!isMobile && (
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
          )}

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Search and Filters */}
            {isMobile && (
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                    All
                  </TabsTrigger>
                  {categories.slice(1).map(cat => (
                    <TabsTrigger 
                      key={cat.id} 
                      value={cat.id} 
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name.split(" ")[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="solved">Solved</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : paginatedDiscussions.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No discussions found</h3>
                      <p className="text-muted-foreground">
                        Try changing your search or create a new discussion
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {paginatedDiscussions.map((discussion) => (
                      <Card 
                        key={discussion.id} 
                        className="hover:shadow-soft transition-all duration-200 cursor-pointer"
                        onClick={() => openDiscussionDetail(discussion)}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                            <div className="flex flex-row md:flex-col items-center justify-center md:justify-start space-x-4 md:space-x-0 md:space-y-2 flex-shrink-0">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(discussion.id, 'upvote');
                                }}
                              >
                                <ArrowUp className="w-4 h-4" />
                              </Button>
                              <span className="text-sm font-medium">
                                {discussion.upvotes - discussion.downvotes}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVote(discussion.id, 'downvote');
                                }}
                              >
                                <ArrowDown className="w-4 h-4" />
                              </Button>
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
                                  <h3 className="text-base md:text-lg font-semibold hover:text-primary">
                                    {discussion.title}
                                  </h3>
                                </div>
                              </div>

                              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                {discussion.content}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {discussion.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className="text-xs bg-gradient-primary text-white">
                                        {discussion.authorAvatar}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:inline">{discussion.author}</span>
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
                                    <span className="hidden sm:inline">{discussion.lastActivity}</span>
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

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6">
                      <Button 
                        variant="outline" 
                        disabled={page === 1}
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                      </div>
                      <Button 
                        variant="outline" 
                        disabled={page >= totalPages}
                        onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                      >
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </>
                )}
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