import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GraduationCap, Users, UserSquare2, BookOpen, School, MessageSquare, Bell, Search } from "lucide-react";
import { motion } from "motion/react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: "Overview", path: "/", icon: BookOpen },
    { name: "Schools", path: "/schools", icon: School },
    { name: "Student/Parent", path: "/student", icon: Users },
    { name: "Teacher/Lector", path: "/teacher", icon: UserSquare2 },
    { name: "Coordinator", path: "/coordinator", icon: GraduationCap },
    { name: "Messages", path: "/messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col z-20">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border px-8 flex items-center justify-between shrink-0 z-10">
          <div className="relative w-64 md:w-96 hidden sm:block">
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
        <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
          <div className="max-w-7xl mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
