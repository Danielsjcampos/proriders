import { motion } from 'framer-motion';
import { 
    Plus,
    DollarSign, 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    Download,
    PieChart,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useState, useEffect } from 'react';

export default function FinancialDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const [statsRes, txRes] = await Promise.all([
                    fetch('/api/financial/stats'),
                    fetch('/api/financial/transactions')
                ]);
                if (statsRes.ok && txRes.ok) {
                    setStats(await statsRes.json());
                    setTransactions(await txRes.json());
                }
            } catch (error) {
                console.error('Error fetching finance:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFinance();
    }, []);

    const formatBRL = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">Gestão Financeira</h1>
                    <p className="text-gray-500">Controle total de faturamento, despesas e fluxo de caixa.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 border-white/10">
                        <Download className="size-4" /> Exportar PDF
                    </Button>
                    <Button className="gap-2 bg-brand-red hover:bg-red-700">
                        <Plus className="size-4" /> Nova Transação
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Faturamento Total', value: formatBRL(stats?.revenue || 0), trend: '+12%', icon: DollarSign, color: 'text-green-500' },
                    { label: 'Contas a Pagar', value: formatBRL(stats?.expenses || 0), trend: '-5%', icon: ArrowDownRight, color: 'text-red-500' },
                    { label: 'Lucro Líquido', value: formatBRL(stats?.balance || 0), trend: '+18%', icon: TrendingUp, color: 'text-brand-red' },
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#111] p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                <stat.icon className="size-5" />
                            </div>
                            <span className={cn("text-xs font-bold flex items-center gap-1", stat.trend.includes('+') ? "text-green-500" : "text-red-500")}>
                                {stat.trend} <ArrowUpRight className="size-3" />
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">{stat.value}</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
                                <BarChart3 className="size-4 text-brand-red" /> Fluxo de Caixa Mensal
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-brand-red">Faturamento</Button>
                                <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold text-gray-600">Despesas</Button>
                            </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: `${20 + (i * 15)}%` }}
                                        className="w-full bg-brand-red/10 border-t-2 border-brand-red rounded-t-sm"
                                    />
                                    <span className="text-[9px] text-gray-600 uppercase font-black">Mês {i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold uppercase tracking-wider">Últimas Movimentações</h3>
                            <Button variant="ghost" size="sm" className="text-xs text-gray-500">Ver Tudo</Button>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="py-10 text-center text-gray-500 animate-pulse uppercase text-[10px] font-bold tracking-widest italic">Carregando transações...</div>
                            ) : transactions.length === 0 ? (
                                <div className="py-10 text-center text-gray-600 uppercase text-[10px] font-bold tracking-widest italic border border-dashed border-white/5 rounded-xl">Sem movimentações recentes.</div>
                            ) : transactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "size-10 rounded-full flex items-center justify-center",
                                            tx.type === 'RECEITA' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                        )}>
                                            {tx.type === 'RECEITA' ? <ArrowUpRight className="size-5" /> : <ArrowDownRight className="size-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-brand-red transition-colors">{tx.description}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{tx.category} • {new Date(tx.date).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "font-black text-sm",
                                        tx.type === 'RECEITA' ? "text-white" : "text-red-500"
                                    )}>
                                        {tx.type === 'RECEITA' ? '+' : '-'} {formatBRL(Number(tx.amount))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Mix & Alerts */}
                <div className="space-y-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 h-[350px] flex flex-col">
                        <h3 className="font-bold uppercase tracking-wider mb-8 flex items-center gap-2">
                            <PieChart className="size-4 text-brand-red" /> Origem da Receita
                        </h3>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="size-40 rounded-full border-8 border-brand-red border-r-transparent border-b-gray-800 rotate-45 relative">
                                <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                                    <div className="text-center">
                                        <p className="text-xs font-bold text-gray-500">Cursos</p>
                                        <p className="text-xl font-black text-white">65%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 pt-6">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-bold uppercase">Cursos Técnicos</span>
                                <span className="text-white font-black">65%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-bold uppercase">Manutenção Oficina</span>
                                <span className="text-white font-black">25%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-bold uppercase">Peças e ACessórios</span>
                                <span className="text-white font-black">10%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-red p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                            <DollarSign className="size-24" />
                        </div>
                        <h3 className="text-white font-black uppercase tracking-wider mb-2 relative z-10">Meta Mensal</h3>
                        <p className="text-white/70 text-sm mb-6 relative z-10">Você atingiu 85% do objetivo de faturamento para Fevereiro.</p>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden relative z-10">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                className="h-full bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
