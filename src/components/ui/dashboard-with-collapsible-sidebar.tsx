import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronsRight,
  LogOut,
  Bell,
  Sun,
  Moon,
  User
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardLayout = ({ children, menuItems, logo, userProfile }: { 
  children: React.ReactNode; 
  menuItems: any[]; 
  logo?: React.ReactNode; 
  userProfile?: any;
}) => {
  const [isDark, setIsDark] = useState(true); // Default to dark for admin as per current design

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100">
        <Sidebar menuItems={menuItems} logo={logo} userProfile={userProfile} />
        <ContentWrapper isDark={isDark} setIsDark={setIsDark} children={children} />
      </div>
    </div>
  );
};

const Sidebar = ({ menuItems, logo }: { menuItems: any[], logo?: React.ReactNode, userProfile?: any }) => {
  const [open, setOpen] = useState(true);
  // Use location for selection
  const location = useLocation();
  const selected = location.pathname;

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-gray-200 dark:border-white/5 bg-white dark:bg-[#111] p-2 shadow-sm flex flex-col z-50`}
    >
      <TitleSection open={open} logo={logo} />

      <div className="space-y-1 mb-8 flex-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <Option
            key={item.path}
            Icon={item.icon}
            title={item.label}
            path={item.path}
            selected={selected}
            open={open}
            notifs={item.notifs}
          />
        ))}
      </div>

      {open && (
        <div className="border-t border-gray-200 dark:border-white/5 pt-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Conta
          </div>
          {/* 
          <Option
            Icon={Settings}
            title="Settings"
            path="/admin/settings"
            selected={selected}
            open={open}
          />
          */}
          <button
              onClick={handleLogout}
              className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-700 dark:hover:text-red-300`}
            >
              <div className="grid h-full w-12 place-content-center">
                <LogOut className="h-4 w-4" />
              </div>
              {open && (
                <span className="text-sm font-medium transition-opacity duration-200 opacity-100">
                  Sair
                </span>
              )}
          </button>
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

const Option = ({ Icon, title, path, selected, open, notifs }: any) => {
  // Check if active (exact match or starts with path for sub-routes, simple logic)
  const isSelected = selected === path || (path !== '/admin' && selected.startsWith(path));
  
  return (
    <Link
      to={path}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-brand-red text-white shadow-sm" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className={`h-4 w-4 ${isSelected ? "text-white" : ""}`} />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600 text-xs text-white font-medium">
          {notifs}
        </span>
      )}
    </Link>
  );
};

const TitleSection = ({ open, logo }: any) => {
  return (
    <div className="mb-6 border-b border-gray-200 dark:border-white/5 pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
        <div className="flex items-center gap-3">
          {logo || <Logo />}
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Pro-Riders
                  </span>
                  <span className="block text-xs text-brand-red font-bold">
                    Admin
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-brand-red to-red-600 shadow-sm">
      <span className="font-bold text-white">PR</span>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: any) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-white/5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-gray-600 dark:text-gray-300 transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Esconder
          </span>
        )}
      </div>
    </button>
  );
};

const ContentWrapper = ({ isDark, setIsDark, children }: any) => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] flex flex-col min-w-0 h-screen overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#111]/50 backdrop-blur-md flex items-center justify-between px-6 z-30 shrink-0">
        <div>
           {/* Breadcrumbs or Title could go here */}
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-brand-red rounded-full"></span>
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <button className="p-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            <User className="h-5 w-5" />
          </button>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
