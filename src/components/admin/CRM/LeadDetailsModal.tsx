import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Mail, Phone, MessageSquare, Tag, StickyNote, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadDetailsModalProps {
    lead: any;
    onClose: () => void;
    onUpdate: () => void;
}

export default function LeadDetailsModal({ lead, onClose, onUpdate }: LeadDetailsModalProps) {
    const [formData, setFormData] = useState({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        whatsapp: lead.whatsapp || '',
        status: lead.status || '',
        notes: lead.notes || '',
        interest: lead.interest || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error('Error updating lead:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteLead = async () => {
        if (!confirm('Tem certeza que deseja excluir este lead?')) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-brand-red/10 border border-brand-red/20 rounded-xl flex items-center justify-center text-brand-red font-bold">
                            {formData.name[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Detalhes do Lead</h2>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                {lead.origin || 'Direto'} • Criado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={deleteLead} className="rounded-full text-gray-500 hover:text-red-500 hover:bg-red-500/10">
                            <Trash2 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em] mb-4">Informações de Contato</h3>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Telefone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                        <input 
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp</label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                        <input 
                                            type="tel"
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pipeline Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em] mb-4">Vendas e Pipeline</h3>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status no Pipeline</label>
                                <select 
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all text-sm appearance-none"
                                >
                                    <option value="NOVO_LEAD">Novo Lead</option>
                                    <option value="CONTATO_INICIADO">Contato Iniciado</option>
                                    <option value="QUALIFICADO">Qualificado</option>
                                    <option value="PROPOSTA_ENVIADA">Proposta Enviada</option>
                                    <option value="NEGOCIACAO">Negociação</option>
                                    <option value="FECHADO">Fechado (Venda)</option>
                                    <option value="PERDIDO">Perdido</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Interesse Principal</label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="text"
                                        placeholder="Ex: Curso de Mecânica Básica"
                                        value={formData.interest}
                                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes Section - Full Width */}
                        <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/5">
                            <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em]">Anotações de Fechamento</h3>
                            <div className="relative">
                                <StickyNote className="absolute left-3 top-4 size-4 text-gray-600" />
                                <textarea 
                                    rows={4}
                                    placeholder="Escreva aqui detalhes da negociação, observações importantes ou próximos passos..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all text-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            className="flex-1 border-white/5 text-gray-500 rounded-xl h-12"
                        >
                            Fechar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="flex-[2] bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-xl h-12 gap-2"
                        >
                            {loading ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
