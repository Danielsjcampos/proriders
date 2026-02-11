import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    Users, 
    GraduationCap, 
    Wrench,
    ArrowUpRight,
    Calendar,
    MessageSquare
} from 'lucide-react';

const stats = [
    { label: 'Leads do Dia', value: '12', trend: '+20%', icon: Users, color: 'text-blue-500' },
    { label: 'Taxa de Conversão', value: '18.5%', trend: '+2%', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Cursos Ativos', value: '4', trend: 'Estável', icon: GraduationCap, color: 'text-brand-red' },
    { label: 'Ordens de Serviço', value: '28', trend: '+5', icon: Wrench, color: 'text-orange-500' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider">Dashboard Executivo</h1>
                <p className="text-gray-500 mt-1">Visão geral do desempenho da Pro Riders em tempo real.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#111] p-6 rounded-2xl border border-white/5 hover:border-brand-red/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={stat.color}>
                                <stat.icon className="size-6" />
                            </div>
                            <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                                {stat.trend} <ArrowUpRight className="size-3" />
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chart Placeholder */}
                <div className="lg:col-span-2 bg-[#111] p-6 rounded-2xl border border-white/5 h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold uppercase tracking-wider">Desempenho de Vendas</h3>
                        <select className="bg-white/5 border border-white/10 rounded-md text-xs p-1 px-2 outline-none">
                            <option>Últimos 7 dias</option>
                            <option>Últimos 30 dias</option>
                        </select>
                    </div>
                    <div className="flex-1 border-t border-dashed border-white/5 flex items-center justify-center relative">
                        {/* Fake Chart Lines */}
                        <div className="w-full h-1/2 flex items-end gap-2 px-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.random() * 80 + 20}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex-1 bg-brand-red/20 border-t-2 border-brand-red rounded-t-sm"
                                />
                            ))}
                        </div>
                        <p className="absolute text-xs text-gray-700 font-bold uppercase tracking-widest">Gráfico em tempo real</p>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Alerta de Cursos */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Calendar className="size-4 text-brand-red" /> Próximos Cursos
                        </h3>
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="text-center bg-brand-red/10 px-2 py-1 rounded">
                                        <p className="text-xs font-bold text-brand-red">Fev</p>
                                        <p className="text-lg font-black text-white leading-none">{15 + i}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white line-clamp-1">Mecânica Básica GS</p>
                                        <p className="text-xs text-gray-500">4 vagas restantes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Últimos Leads */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MessageSquare className="size-4 text-brand-red" /> Novos Leads
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0">
                                    <span className="text-white font-medium">Carlos Silva</span>
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">WhatsApp</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
