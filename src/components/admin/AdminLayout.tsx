import React from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Users, 
    Wrench, 
    GraduationCap, 
    DollarSign, 
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'CRM Leads', path: '/admin/crm' },
        { icon: GraduationCap, label: 'Cursos (LMS)', path: '/admin/courses' },
        { icon: Wrench, label: 'Oficina (OS)', path: '/admin/workshop' },
        { icon: DollarSign, label: 'Financeiro', path: '/admin/financial' },
        { icon: Settings, label: 'Configurações', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex overflow-hidden selection:bg-brand-red selection:text-white">
            {/* Sidebar */}
            <aside 
                className={cn(
                    "fixed md:relative z-40 h-full bg-[#111] border-r border-white/5 transition-all duration-300 flex flex-col",
                    isSidebarOpen ? "w-64" : "w-0 md:w-20 overflow-hidden"
                )}
            >
                {/* Logo Area */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <img 
                        src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png" 
                        alt="Logo" 
                        className={cn("h-8 object-contain transition-all", !isSidebarOpen && "md:scale-0")}
                    />
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X className="size-5" />
                    </Button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-6 px-3 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                                location.pathname === item.path 
                                    ? "bg-brand-red text-white" 
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("size-5", location.pathname === item.path ? "text-white" : "group-hover:text-brand-red transition-colors")} />
                            <span className={cn("font-medium transition-all", !isSidebarOpen && "md:opacity-0")}>
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Footer User */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <div className={cn("flex items-center gap-3 px-2", !isSidebarOpen && "md:justify-center")}>
                        <div className="size-10 rounded-full bg-brand-red flex items-center justify-center font-bold text-lg">
                            {user?.name?.[0] || 'A'}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="font-bold truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                            </div>
                        )}
                    </div>
                    <Button 
                        variant="ghost" 
                        className={cn("w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-400", !isSidebarOpen && "md:justify-center px-0")}
                        onClick={handleLogout}
                    >
                        <LogOut className="size-5" />
                        {isSidebarOpen && <span className="ml-3">Sair</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 bg-[#111]/50 backdrop-blur-md flex items-center justify-between px-6 z-30">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="size-5" />
                        </Button>
                        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-64">
                            <Search className="size-4 text-gray-500" />
                            <input 
                                type="text" 
                                placeholder="Busca rápida..." 
                                className="bg-transparent border-none outline-none text-sm w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="size-5" />
                            <span className="absolute top-2 right-2 size-2 bg-brand-red rounded-full" />
                        </Button>
                    </div>
                </header>

                {/* Page Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
