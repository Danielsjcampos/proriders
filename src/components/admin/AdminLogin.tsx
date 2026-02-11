import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function AdminLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // TODO: Real API call
        // For now, mock based on the seeder
        if (email === 'admin@proriders.com.br' && password === 'admin123') {
            await new Promise(r => setTimeout(r, 1000));
            login('mock-jwt-token', {
                id: '1',
                email: 'admin@proriders.com.br',
                name: 'Admin Pro Riders',
                role: 'ADMIN'
            });
            navigate('/admin');
        } else {
            setError('Credenciais inválidas');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-red/5 blur-[120px] rounded-full" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <img 
                        src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png" 
                        alt="Logo" 
                        className="h-16 mx-auto mb-6 object-contain"
                    />
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">
                        Master Management
                    </h1>
                    <p className="text-gray-500 mt-2">Bem-vindo à central de comando da Pro Riders.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-brand-red transition-all"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Senha</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-brand-red transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 text-base font-bold uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
                        {!isLoading && <LogIn className="ml-2 size-5" />}
                    </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-600">
                        Acesso exclusivo para equipe Pro Riders.<br />
                        © 2026 Pro Riders Master.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
