import React from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Wrench, 
    Bike, 
    Clock, 
    CheckCircle2,
    AlertCircle,
    User,
    ChevronRight,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Dialog } from '@/components/ui/dialog';

export default function WorkshopManagement() {
    const [isOSModalOpen, setIsOSModalOpen] = React.useState(false);
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/service-orders');
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleSubmitNewOS = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would call the API POST /api/service-orders
        setIsOSModalOpen(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">Oficina & OS</h1>
                    <p className="text-gray-500">Gestão técnica de ordens de serviço e manutenção especializada.</p>
                </div>
                <Button 
                    onClick={() => setIsOSModalOpen(true)}
                    className="gap-2 bg-brand-red hover:bg-red-700"
                >
                    <Plus className="size-4" /> Abrir Nova OS
                </Button>
            </div>

            {/* Modal de Nova OS */}
            <Dialog 
                isOpen={isOSModalOpen} 
                onClose={() => setIsOSModalOpen(false)}
                title="Abertura de Ordem de Serviço"
                className="max-w-2xl"
            >
                <form onSubmit={handleSubmitNewOS} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Cliente</label>
                            <input type="text" placeholder="Nome do cliente..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Telefone / WhatsApp</label>
                            <input type="text" placeholder="(00) 00000-0000" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Motocicleta (Modelo)</label>
                            <input type="text" placeholder="Ex: R1250 GS Adventure" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Placa</label>
                            <input type="text" placeholder="ABC-1234" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Descrição do Problema / Serviço</label>
                        <textarea rows={3} placeholder="Descreva os sintomas ou serviços solicitados..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Mecânico Responsável</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red appearance-none text-gray-400">
                                <option>Selecione um técnico...</option>
                                <option>João Técnico</option>
                                <option>Ricardo Pro</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Prioridade</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red appearance-none text-gray-400">
                                <option>Normal</option>
                                <option>Alta (Urgente)</option>
                                <option>Retrabalho</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" className="flex-1 py-6" onClick={() => setIsOSModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="flex-1 py-6 bg-brand-red hover:bg-red-700">Registrar Ordem de Serviço</Button>
                    </div>
                </form>
            </Dialog>

            {/* Top Bar: Search & Status Quick Chips */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Buscar por Placa, Cliente ou Modelo..." 
                        className="w-full bg-transparent p-4 pl-11 outline-none text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <Button variant="outline" size="sm" className="bg-brand-red/10 border-brand-red text-brand-red">Todos</Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white">Aguardando</Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white">Execução</Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white">Concluídos</Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-3" /> Mais
                    </Button>
                </div>
            </div>

            {/* OS List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse italic">Carregando ordens de serviço...</div>
                ) : orders.length === 0 ? (
                    <div className="py-20 text-center bg-[#111] border border-dashed border-white/10 rounded-3xl">
                        <Bike className="size-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest italic">Nenhuma ordem de serviço ativa.</p>
                        <Button variant="ghost" className="mt-4 text-brand-red hover:bg-brand-red/10" onClick={() => setIsOSModalOpen(true)}>Abrir Primeira OS</Button>
                    </div>
                ) : orders.map((os, i) => (
                    <motion.div 
                        key={os.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-red/30 transition-all cursor-pointer"
                    >
                        <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
                            {/* Icon & ID */}
                            <div className="flex items-center gap-4 md:w-48 shrink-0">
                                <div className={cn(
                                    "size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                                    os.status === 'Em Execução' ? "bg-brand-red/10 text-brand-red" : 
                                    os.status === 'Aguardando Peça' ? "bg-orange-500/10 text-orange-500" :
                                    "bg-blue-500/10 text-blue-500"
                                )}>
                                    <Wrench className="size-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-600 tracking-tighter uppercase">{os.id}</p>
                                    <h4 className="font-black text-white truncate uppercase">{os.plate}</h4>
                                </div>
                            </div>

                            {/* Client & Bike */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <User className="size-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Cliente</span>
                                    </div>
                                    <p className="text-sm font-bold text-white uppercase">{os.client}</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Bike className="size-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Motocicleta</span>
                                    </div>
                                    <p className="text-sm font-bold text-white uppercase truncate">{os.bike}</p>
                                </div>
                            </div>

                            {/* Status & Deadline */}
                            <div className="md:w-64 flex items-center justify-between md:justify-around gap-4 shrink-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock className="size-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {os.status === 'Em Execução' ? <AlertCircle className="size-3 text-brand-red animate-pulse" /> : <CheckCircle2 className="size-3 text-gray-500" />}
                                        <p className={cn(
                                            "text-xs font-bold uppercase tracking-widest",
                                            os.status === 'Em Execução' ? "text-brand-red" : "text-gray-400"
                                        )}>
                                            {os.status}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="hover:bg-brand-red hover:text-white transition-colors">
                                    <ChevronRight className="size-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Progress Bar (at bottom of card) */}
                        <div className="h-1 bg-white/5 w-full">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: os.status === 'Em Execução' ? '65%' : os.status === 'Aguardando Peça' ? '30%' : '5%' }}
                                className={cn(
                                    "h-full transition-all duration-1000",
                                    os.status === 'Em Execução' ? "bg-brand-red" : 
                                    os.status === 'Aguardando Peça' ? "bg-orange-500" :
                                    "bg-blue-500"
                                )}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
