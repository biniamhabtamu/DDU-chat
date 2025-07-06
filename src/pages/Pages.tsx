import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  Users, 
  BookOpen,
  Megaphone,
  Trophy,
  Map,
  Rocket
} from "lucide-react";

const Pages = () => {
  const pageCategories = [
    {
      title: "Announcements",
      description: "University updates and important notices",
      icon: Megaphone,
      color: "text-primary",
      items: ["Exam Schedule Updates", "Holiday Announcements", "Registration Deadlines"]
    },
    {
      title: "Student Projects",
      description: "Showcase and collaborate on projects",
      icon: Trophy,
      color: "text-secondary",
      items: ["Web Development Projects", "Mobile Apps", "Research Papers"]
    },
    {
      title: "Learning Roadmaps",
      description: "Step-by-step programming guides",
      icon: Map,
      color: "text-accent",
      items: ["Frontend Development", "Backend Development", "Data Science"]
    },
    {
      title: "Events & Activities",
      description: "University events and student activities",
      icon: Calendar,
      color: "text-success",
      items: ["Tech Talks", "Coding Competitions", "Study Groups"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Academic Pages
          </h1>
          <p className="text-muted-foreground">
            Access announcements, projects, roadmaps, and university activities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pageCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-primary">
                    <Rocket className="w-4 h-4 mr-2" />
                    Explore {category.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pages;