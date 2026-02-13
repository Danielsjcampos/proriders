import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

export interface LeadFormProps {
    interest?: string;
    origin?: string;
    courseDateId?: string;
    onSuccess?: () => void;
}

// LeadForm Component for capturing course interest leads
export default function LeadForm({ interest = 'Geral', origin = 'Site', courseDateId, onSuccess }: LeadFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    interest,
                    origin,
                    courseDateId,
                }),
            });

            if (response.ok) {
                setStatus('success');
                if (onSuccess) onSuccess();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 p-8 rounded-2xl text-center"
            >
                <div className="size-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="size-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Solicitação Enviada!</h3>
                <p className="text-gray-400">Em breve entraremos em contato para os próximos passos.</p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Nome Completo</label>
                <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red transition-all"
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">E-mail</label>
                    <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red transition-all"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">WhatsApp</label>
                    <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:border-brand-red transition-all"
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-6 text-lg font-bold gap-2 bg-brand-red hover:bg-red-700"
            >
                {status === 'loading' ? 'Processando...' : (
                    <>
                        Quero ser contatado <Send className="size-4" />
                    </>
                )}
            </Button>
            
            {status === 'error' && (
                <p className="text-center text-red-500 text-xs font-bold">Ocorreu um erro. Tente novamente.</p>
            )}
        </form>
    );
}
