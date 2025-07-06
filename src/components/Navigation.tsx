import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Sun, Moon, Code, Home, MessageCircle, Book, Users, FileText, LogIn, LogOut } from "lucide-react";
import direDev from "@/assets/dire-dev-logo.png";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Chat", path: "/chat", icon: MessageCircle },
    { name: "Dev-Tools", path: "/dev-tools", icon: Code },
    { name: "Dev-Materials", path: "/materials", icon: Book },
    { name: "Discussion", path: "/discussion", icon: Users },
    { name: "Pages", path: "/pages", icon: FileText },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={direDev} 
              alt="Dire-Dev Logo" 
              className="h-10 w-10 rounded-lg shadow-soft group-hover:shadow-glow transition-all duration-300"
            />
            <span className="text-xl font-bold text-gradient-primary">
              Dire-Dev
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary active"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth & Theme Controls */}
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.photoURL || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-foreground">
                  {currentUser.displayName || 'Student'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild variant="default" size="sm" className="hidden md:flex">
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-muted/50 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/50 backdrop-blur-sm rounded-lg mt-2 border shadow-medium animate-fade-in">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md flex items-center space-x-3 transition-all duration-300 ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Actions */}
              <div className="border-t pt-2 mt-2">
                {currentUser ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.photoURL || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">
                        {currentUser.displayName || 'Student'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start px-3"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login / Sign Up</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;