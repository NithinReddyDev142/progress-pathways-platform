
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLms } from "@/contexts/LmsContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Book, BookOpen, Home, LogOut, User, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout, role } = useAuth();
  const { unreadNotificationsCount } = useLms();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const NavItem = ({ 
    icon: Icon, 
    label, 
    path, 
    badge 
  }: { 
    icon: React.ElementType; 
    label: string; 
    path: string; 
    badge?: number 
  }) => (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2"
      onClick={() => navigate(path)}
    >
      <Icon className="h-4 w-4" />
      {sidebarOpen && (
        <span className="flex-1 text-left">{label}</span>
      )}
      {badge && badge > 0 && (
        <Badge variant="destructive" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white shadow-lg transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="px-4 py-6 flex justify-between items-center">
          {sidebarOpen && (
            <div className="font-bold text-xl text-lms-indigo">EduLearn</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? (
              <span className="text-gray-400">&larr;</span>
            ) : (
              <span className="text-gray-400">&rarr;</span>
            )}
          </Button>
        </div>

        <Separator />

        {/* User info */}
        <div className="p-4 flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback>
              {user?.username ? getInitials(user.username) : "U"}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={Home} label="Dashboard" path="/" />

          {/* Admin Nav Items */}
          {role === "admin" && (
            <>
              <NavItem icon={Users} label="Manage Users" path="/admin/users" />
              <NavItem icon={BookOpen} label="All Courses" path="/admin/courses" />
            </>
          )}

          {/* Teacher Nav Items */}
          {role === "teacher" && (
            <>
              <NavItem icon={Book} label="My Courses" path="/teacher/courses" />
              <NavItem icon={Users} label="Students" path="/teacher/students" />
            </>
          )}

          {/* Student Nav Items */}
          {role === "student" && (
            <>
              <NavItem icon={BookOpen} label="Browse Courses" path="/courses" />
              <NavItem icon={Book} label="My Learning" path="/student/courses" />
            </>
          )}

          {/* Common Nav Items */}
          <NavItem 
            icon={Bell} 
            label="Notifications" 
            path="/notifications" 
            badge={unreadNotificationsCount} 
          />
          <NavItem icon={User} label="Profile" path="/profile" />
        </nav>

        {/* Logout button */}
        <div className="p-4">
          <Button
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
