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
      path: "/dev-tools"
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Connect with fellow students instantly",
      path: "/chat"
    },
    {
      icon: Book,
      title: "Dev-Materials",
      description: "Free textbooks, PDFs, and resources",
      path: "/materials"
    },
    {
      icon: Users,
      title: "Discussion Forum",
      description: "Ask questions, share knowledge",
      path: "/discussion"
    },
    {
      icon: FileText,
      title: "Academic Pages",
      description: "Announcements, projects, and roadmaps",
      path: "/pages"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Firebase authentication & security",
      path: "#"
    }
  ];

  const stats = [
    { label: "Active Students", value: "500+", icon: GraduationCap },
    { label: "Resources Shared", value: "1.2K+", icon: Book },
    { label: "Code Projects", value: "300+", icon: Code },
    { label: "Study Groups", value: "50+", icon: Users }
  ];

  return (
    <div className="min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-tr from-purple-700 via-indigo-700 to-blue-700">
        <div className="absolute inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <Badge className="mb-4 px-4 py-2 bg-white text-purple-700 text-sm shadow-md inline-flex items-center">
            <Zap className="w-4 h-4 mr-2" /> Built for Dire Dawa University Students
          </Badge>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white drop-shadow-xl">
            Welcome to <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 text-transparent bg-clip-text">Dire-Dev</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Your all-in-one platform for academic resources, collaboration, and development tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-700 font-semibold hover:bg-white/90 shadow-lg">
              <Heart className="w-5 h-5 mr-2" /> Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/materials" className="flex items-center">
                <Book className="w-5 h-5 mr-2" /> Explore Resources
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-4 rounded-xl shadow-sm bg-white dark:bg-white/10 backdrop-blur text-foreground animate-fade-in">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-purple-50 to-white dark:from-gray-900 dark:to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Lightbulb className="w-4 h-4 mr-2" /> Platform Features
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need to <span className="text-purple-600">Succeed</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Discover powerful tools designed for Dire Dawa University students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={i}
                  className="group bg-white/60 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feature.path !== "#" ? (
                      <Button variant="ghost" className="text-purple-600 hover:underline" asChild>
                        <Link to={feature.path}>
                          Explore <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    ) : (
                      <p className="text-purple-600 flex items-center font-medium">
                        <Star className="w-4 h-4 mr-2" />
                        Premium Feature
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Academic Journey?</h2>
          <p className="text-xl mb-8">
            Join hundreds of students using Dire-Dev to collaborate, learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-700 font-bold hover:bg-white/90 shadow-lg">
              <GraduationCap className="w-5 h-5 mr-2" /> Join Dire-Dev Today
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/discussion">
                <MessageCircle className="w-5 h-5 mr-2" /> Visit Discussion
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
