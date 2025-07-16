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
  Heart,
  Trophy,
  Group
} from "lucide-react";
import heroImage from "@/assets/hero-university.jpg";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
    },
    {
      icon: Group,
      title: "Student Clubs",
      description: "Find and join campus clubs & organizations",
      path: "/clubs"
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Earn certificates and showcase milestones",
      path: "/achievements"
    }
  ];

  const stats = [
    { label: "Active Students", value: "500+", icon: GraduationCap },
    { label: "Resources Shared", value: "1.2K+", icon: Book },
    { label: "Code Projects", value: "300+", icon: Code },
    { label: "Study Groups", value: "50+", icon: Users }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10],
      transition: {
        y: {
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          
          {/* Floating circles animation */}
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-white/10 ${i % 2 === 0 ? 'blur-sm' : 'blur-md'}`}
              style={{
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div 
          className="relative max-w-6xl mx-auto text-center z-10"
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <Badge 
              variant="secondary" 
              className="mb-6 px-4 py-2 bg-white/90 text-primary font-semibold shadow-lg hover:bg-white transition-all"
            >
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Built for Dire Dawa University Students
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            variants={itemVariants}
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Dire-Dev
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Your all-in-one platform for academic resources, collaboration, and development tools.
            Connect, learn, and build amazing projects together.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <Heart className="w-5 h-5 mr-2 animate-beat" />
              Get Started Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/80 text-primary hover:bg-white/20 hover:border-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1" 
              asChild
            >
              <Link to="/materials">
                <Book className="w-5 h-5 mr-2" />
                Explore Resources
              </Link>
            </Button>
          </motion.div>

          {/* Floating student avatars */}
          <motion.div 
            className="flex justify-center mt-16 gap-6"
            variants={floatingVariants}
            animate="float"
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg"
                style={{
                  zIndex: 10 - i,
                  marginLeft: i > 1 ? `-${i * 8}px` : 0,
                  animationDelay: `${i * 0.2}s`
                }}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            ))}
          </motion.div>

          {/* Stats preview */}
          <motion.div 
            className="mt-16 bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto border border-white/20 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.slice(0, 4).map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={i}
                    className="p-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{
                y: [0, 4]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                className="p-4 rounded-xl shadow-md bg-white dark:bg-white/10 text-foreground hover:scale-105 transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-purple-50 to-white dark:from-gray-900 dark:to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4">
                <Lightbulb className="w-4 h-4 mr-2" /> Platform Features
              </Badge>
            </motion.div>
            <motion.h2 
              className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Everything You Need to <span className="text-purple-600">Succeed</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Discover powerful tools tailored for Dire Dawa University students.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                >
                  <Card
                    className="group bg-white/60 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition"
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition">
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-700 text-white text-center">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Academic Journey?</h2>
          <p className="text-xl mb-8">
            Join hundreds of students using Dire-Dev to collaborate, learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-strong hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <GraduationCap className="w-5 h-5 mr-2" />
              Join Dire-Dev Today
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10 hover:shadow-lg transition-all transform hover:-translate-y-1" 
              asChild
            >
              <Link to="/discussion">
                <MessageCircle className="w-5 h-5 mr-2" /> Visit Discussion
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;