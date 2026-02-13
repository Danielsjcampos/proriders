import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddEnrollmentModalProps {
    courseDateId: string;
    courseName: string;
    courseDate: string;
    coursePrice: number;
    onClose: () => void;
    onSave: () => void;
}

export default function AddEnrollmentModal({ courseDateId, courseName, courseDate, coursePrice, onClose, onSave }: AddEnrollmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        paymentStatus: 'PENDENTE',
        paymentMethod: 'PIX',
        amountPaid: '',
        totalAmount: coursePrice.toString()
    });
    const [loading, setLoading] = useState(false);

    const remainingBalance = parseFloat(formData.totalAmount || '0') - parseFloat(formData.amountPaid || '0');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/admin/enrollments/manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, courseDateId })
            });

            if (response.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error('Error adding enrollment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h2 className="text-xl font-bold text-white">Inscrever Aluno</h2>
                        <p className="text-xs text-gray-500 uppercase font-black tracking-widest mt-1">
                            {courseName} • {courseDate}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={20} />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                <input 
                                    type="text"
                                    required
                                    placeholder="Nome do aluno"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="email"
                                        required
                                        placeholder="email@exemplo.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="tel"
                                        required
                                        placeholder="(00) 00000-0000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status Pagamento</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <select 
                                        value={formData.paymentStatus}
                                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm appearance-none"
                                    >
                                        <option value="PENDENTE">Pendente</option>
                                        <option value="PAGO">Pago</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Forma de Pagamento</label>
                                <div className="relative">
                                    <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <select 
                                        value={formData.paymentMethod}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm appearance-none"
                                    >
                                        <option value="PIX">PIX</option>
                                        <option value="CARTAO">Cartão</option>
                                        <option value="BOLETO">Boleto</option>
                                        <option value="DINHEIRO">Dinheiro</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Valor Total do Curso (R$)</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={formData.totalAmount}
                                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Valor Pago (Entrada/Total)</label>
                                <div className="relative">
                                    <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.amountPaid}
                                        onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {remainingBalance > 0 && (
                            <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-2xl flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400">Saldo Remanescente:</span>
                                <span className="text-lg font-black text-brand-red">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(remainingBalance)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 border-white/5 text-gray-500 rounded-xl py-6"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="flex-[2] bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-xl py-6"
                        >
                            {loading ? 'Processando...' : 'Confirmar Inscrição'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
