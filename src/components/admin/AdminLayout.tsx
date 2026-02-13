import React from 'react';
import { 
    LayoutDashboard, 
    Users, 
    Wrench, 
    GraduationCap, 
    DollarSign, 
    Settings
} from 'lucide-react';
import DashboardLayout from '@/components/ui/dashboard-with-collapsible-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'CRM Leads', path: '/admin/crm' },
        { icon: GraduationCap, label: 'Cursos (LMS)', path: '/admin/courses' },
        { icon: Wrench, label: 'Oficina (OS)', path: '/admin/workshop' },
        { icon: DollarSign, label: 'Financeiro', path: '/admin/financial' },
        { icon: Settings, label: 'Configurações', path: '/admin/settings' },
    ];

    return (
        <DashboardLayout menuItems={menuItems}>
            {children}
        </DashboardLayout>
    );
}
