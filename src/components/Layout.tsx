import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GraduationCap, Users, UserSquare2, BookOpen, School, MessageSquare, Bell, Search, Menu, X as CloseIcon, Sparkles, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Overview", path: "/", icon: BookOpen },
    { name: "Curriculum Gen", path: "/generator", icon: Sparkles },
    { name: "Resources", path: "/resources", icon: Database },
    { name: "Schools", path: "/schools", icon: School },
    { name: "Student/Parent", path: "/student", icon: Users },
    { name: "Teacher/Lector", path: "/teacher", icon: UserSquare2 },
    { name: "Coordinator", path: "/coordinator", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg overflow-x-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <span className="font-bold text-lg text-text-dark tracking-tight">EDUCORE</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-bg border border-border text-text-muted"
        >
          {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col z-20 h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
            E
          </div>
          <span className="font-bold text-xl text-text-dark tracking-tight">EDUCORE</span>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium relative",
                  isActive
                    ? "text-white"
                    : "text-text-muted hover:bg-bg hover:text-text-dark"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary rounded-2xl shadow-md shadow-primary/20"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 relative z-10", isActive ? "text-white" : "text-text-muted")} />
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile Snippet */}
        <div className="p-4 m-4 rounded-2xl bg-bg border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-dark truncate">John Doe</p>
            <p className="text-xs text-text-muted truncate">Admin</p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-card z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                    E
                  </div>
                  <span className="font-bold text-lg text-text-dark tracking-tight">EDUCORE</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-muted">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 font-bold",
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-text-muted hover:bg-bg hover:text-text-dark"
                      )}
                    >
                      <item.icon className={cn("w-6 h-6", isActive ? "text-white" : "text-text-muted")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-border">
                <div className="p-4 rounded-2xl bg-bg border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold">
                    JD
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-dark truncate">John Doe</p>
                    <p className="text-xs text-text-muted truncate">Admin</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Desktop Only Search */}
        <header className="h-20 bg-card border-b border-border px-8 hidden md:flex items-center justify-between shrink-0 z-10">
          <div className="relative w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search students, classes, or subjects..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-bg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2.5 rounded-xl border border-border text-text-muted hover:bg-bg hover:text-text-dark transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-card"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 md:p-10 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
