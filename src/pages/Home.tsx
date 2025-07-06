import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Code, 
  MessageCircle, 
  Book, 
  Users, 
  FileText, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  GraduationCap,
  Lightbulb,
  Heart
} from "lucide-react";
import heroImage from "@/assets/hero-university.jpg";

const Home = () => {
  const features = [
    {
      icon: Code,
      title: "Dev-Tools",
      description: "Code editor, todo lists, and markdown notes",
      path: "/dev-tools",
      color: "text-primary"
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Connect with fellow students instantly",
      path: "/chat",
      color: "text-secondary"
    },
    {
      icon: Book,
      title: "Dev-Materials",
      description: "Free textbooks, PDFs, and resources",
      path: "/materials",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Discussion Forum",
      description: "Ask questions, share knowledge",
      path: "/discussion",
      color: "text-success"
    },
    {
      icon: FileText,
      title: "Academic Pages",
      description: "Announcements, projects, and roadmaps",
      path: "/pages",
      color: "text-warning"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Firebase authentication & security",
      path: "#",
      color: "text-primary"
    }
  ];

  const stats = [
    { label: "Active Students", value: "500+", icon: GraduationCap },
    { label: "Resources Shared", value: "1.2K+", icon: Book },
    { label: "Code Projects", value: "300+", icon: Code },
    { label: "Study Groups", value: "50+", icon: Users }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Built for Dire Dawa University Students
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Welcome to{" "}
              <span className="text-gradient-primary">Dire-Dev</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your all-in-one platform for academic resources, collaboration, and development tools. 
              Connect, learn, and build amazing projects together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
                <Heart className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/materials">
                  <Book className="w-5 h-5 mr-2" />
                  Explore Resources
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center animate-slide-up">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-medium">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="text-gradient-hero">Succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover powerful tools and resources designed specifically for Dire Dawa University students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0"
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feature.path !== "#" ? (
                      <Button variant="ghost" className="p-0 h-auto text-primary group-hover:translate-x-1 transition-transform" asChild>
                        <Link to={feature.path}>
                          Explore <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex items-center text-primary">
                        <Star className="w-4 h-4 mr-2" />
                        <span className="font-medium">Premium Feature</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Academic Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of Dire Dawa University students who are already using Dire-Dev to enhance their learning experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
              <GraduationCap className="w-5 h-5 mr-2" />
              Join Dire-Dev Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/discussion">
                <MessageCircle className="w-5 h-5 mr-2" />
                Visit Discussion
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;