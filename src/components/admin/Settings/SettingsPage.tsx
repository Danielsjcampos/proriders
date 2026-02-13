
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
    Settings as SettingsIcon, 
    CreditCard, 
    Share2, 
    Search, 
    Database, 
    Save, 
    RotateCcw, 
    Download,
    History
} from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

interface SettingsData {
    id: string;
    companyName: string;
    logo: string;
    icon: string;
    brandColor: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    stripePublicKey: string;
    stripeSecretKey: string;
    asaasApiKey: string;
    aiProvider: string;
    aiApiKey: string;
    metaPixelId: string;
    googleAnalyticsId: string;
    googleTagManagerId: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    updatedAt: string;
}

interface ActivityLog {
    id: string;
    action: string;
    details: string;
    entityType: string;
    createdAt: string;
    user?: { name: string };
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('geral');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<SettingsData | null>(null);
    const [history, setHistory] = useState<ActivityLog[]>([]);
    const [resetConfirm, setResetConfirm] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/settings/history');
            const data = await res.json();
            setHistory(data);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
    };

    // Fetch history when tab changes to 'sistema'
    useEffect(() => {
        if (activeTab === 'sistema') {
            fetchHistory();
        }
    }, [activeTab]);

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Configurações salvas com sucesso!');
            } else {
                alert('Erro ao salvar configurações.');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro de conexão ao salvar.');
        } finally {
            setSaving(false);
        }
    };

    const handleBackup = async () => {
        if (!confirm('Deseja iniciar o backup agora?')) return;
        try {
            const res = await fetch('/api/settings/backup', { method: 'POST' });
            if (res.ok) {
                alert('Backup realizado com sucesso!');
                fetchHistory();
            } else {
                alert('Erro ao realizar backup.');
            }
        } catch (error) {
            console.error('Erro no backup:', error);
        }
    };

    const handleReset = async () => {
        if (resetConfirm !== 'CONFIRMO_RESET_TOTAL') {
            alert('Confirmação incorreta. Digite "CONFIRMO_RESET_TOTAL" para prosseguir.');
            return;
        }
        if (!confirm('ATENÇÃO: Isso apagará dados do sistema. Tem certeza absoluta?')) return;
        
        try {
            const res = await fetch('/api/settings/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmation: resetConfirm })
            });
            if (res.ok) {
                alert('Reset solicitado com sucesso.');
                fetchHistory();
                setResetConfirm('');
            } else {
                alert('Erro ao solicitar reset.');
            }
        } catch (error) {
            console.error('Erro no reset:', error);
        }
    };

    if (loading) return <div className="p-8 text-white">Carregando configurações...</div>;
    if (!settings) return <div className="p-8 text-white">Erro ao carregar configurações.</div>;

    const tabs = [
        { id: 'geral', label: 'Geral', icon: SettingsIcon },
        { id: 'contato', label: 'Contato', icon: Share2 },
        { id: 'pagamento', label: 'Pagamento', icon: CreditCard },
        { id: 'integracoes', label: 'Integrações', icon: Share2 },
        { id: 'seo', label: 'SEO', icon: Search },
        { id: 'sistema', label: 'Sistema', icon: Database },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">Configurações do Sistema</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                activeTab === tab.id 
                                ? 'bg-brand-red text-white font-bold' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 bg-[#111] border border-white/10 rounded-2xl p-8">
                    {/* GERAL */}
                    {activeTab === 'geral' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Informações Gerais</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Nome da Empresa</label>
                                    <input 
                                        value={settings.companyName || ''}
                                        onChange={e => setSettings({...settings, companyName: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <ImageUpload 
                                            label="Logo URL"
                                            value={settings.logo || ''}
                                            onChange={(url) => setSettings({...settings, logo: url})}
                                        />
                                    </div>
                                    <div>
                                        <ImageUpload 
                                            label="Ícone (Favicon)"
                                            value={settings.icon || ''}
                                            onChange={(url) => setSettings({...settings, icon: url})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Cor da Marca (Hex)</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="color"
                                            value={settings.brandColor || '#710409'}
                                            onChange={e => setSettings({...settings, brandColor: e.target.value})}
                                            className="h-12 w-12 rounded bg-transparent border border-white/10 cursor-pointer"
                                        />
                                        <input 
                                            value={settings.brandColor || ''}
                                            onChange={e => setSettings({...settings, brandColor: e.target.value})}
                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTATO */}
                    {activeTab === 'contato' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Informações de Contato</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Endereço Completo</label>
                                    <input 
                                        value={settings.address || ''}
                                        onChange={e => setSettings({...settings, address: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Telefone</label>
                                        <input 
                                            value={settings.phone || ''}
                                            onChange={e => setSettings({...settings, phone: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">WhatsApp (Link ou Número)</label>
                                        <input 
                                            value={settings.whatsapp || ''}
                                            onChange={e => setSettings({...settings, whatsapp: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">E-mail de Contato</label>
                                    <input 
                                        value={settings.email || ''}
                                        onChange={e => setSettings({...settings, email: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAGAMENTO */}
                    {activeTab === 'pagamento' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Configurações de Pagamento</h2>
                            
                            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={20} /> Stripe</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Chave Pública (Publishable Key)</label>
                                        <input 
                                            value={settings.stripePublicKey || ''}
                                            onChange={e => setSettings({...settings, stripePublicKey: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                            placeholder="pk_test_..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Chave Secreta (Secret Key)</label>
                                        <input 
                                            type="password"
                                            value={settings.stripeSecretKey || ''}
                                            onChange={e => setSettings({...settings, stripeSecretKey: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                            placeholder="sk_test_..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CreditCard size={20} /> Asaas</h3>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">API Key</label>
                                    <input 
                                        type="password"
                                        value={settings.asaasApiKey || ''}
                                        onChange={e => setSettings({...settings, asaasApiKey: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                        placeholder="$aact_..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INTEGRAÇÕES */}
                    {activeTab === 'integracoes' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Integrações de Terceiros</h2>
                            
                            {/* AI */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-300">Inteligência Artificial (IA)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Provedor de IA</label>
                                        <select 
                                            value={settings.aiProvider || 'openai'}
                                            onChange={e => setSettings({...settings, aiProvider: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                        >
                                            <option value="openai">OpenAI (GPT-4)</option>
                                            <option value="gemini">Google Gemini</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">API Key da IA</label>
                                        <input 
                                            type="password"
                                            value={settings.aiApiKey || ''}
                                            onChange={e => setSettings({...settings, aiApiKey: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                            placeholder="sk-..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Tracking */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-300">Tracking & Analytics</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Google Analytics ID (GA4)</label>
                                        <input 
                                            value={settings.googleAnalyticsId || ''}
                                            onChange={e => setSettings({...settings, googleAnalyticsId: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                            placeholder="G-..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Google Tag Manager ID</label>
                                        <input 
                                            value={settings.googleTagManagerId || ''}
                                            onChange={e => setSettings({...settings, googleTagManagerId: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                            placeholder="GTM-..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Meta Pixel ID (Facebook)</label>
                                        <input 
                                            value={settings.metaPixelId || ''}
                                            onChange={e => setSettings({...settings, metaPixelId: e.target.value})}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-brand-red outline-none"
                                            placeholder="1234567890..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO */}
                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Otimização para Motores de Busca (SEO)</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Título Global (Padrão)</label>
                                    <input 
                                        value={settings.seoTitle || ''}
                                        onChange={e => setSettings({...settings, seoTitle: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                        placeholder="Ex: Pro Riders - Escola de Pilotagem"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Descrição Global (Meta Description)</label>
                                    <textarea 
                                        rows={3}
                                        value={settings.seoDescription || ''}
                                        onChange={e => setSettings({...settings, seoDescription: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                        placeholder="Breve descrição do site para o Google..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-gray-500 font-bold mb-2">Palavras-chave (Keywords)</label>
                                    <textarea 
                                        rows={2}
                                        value={settings.seoKeywords || ''}
                                        onChange={e => setSettings({...settings, seoKeywords: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-brand-red outline-none"
                                        placeholder="moto, pilotagem, curso, mecânica..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SISTEMA */}
                    {activeTab === 'sistema' && (
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6 text-red-500">Zona de Perigo & Manutenção</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3 mb-4 text-blue-400">
                                            <Download size={24} />
                                            <h3 className="font-bold">Backup de Dados</h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-6">
                                            Crie uma cópia de segurança instantânea de todos os dados do sistema (banco de dados).
                                        </p>
                                        <Button onClick={handleBackup} variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                            Realizar Backup Agora
                                        </Button>
                                    </div>

                                    <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20">
                                        <div className="flex items-center gap-3 mb-4 text-red-500">
                                            <RotateCcw size={24} />
                                            <h3 className="font-bold">Resetar Sistema</h3>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Apaga dados de leads e inscrições. Ação irreversível. Digite <strong>CONFIRMO_RESET_TOTAL</strong> para habilitar.
                                        </p>
                                        <input 
                                            value={resetConfirm}
                                            onChange={e => setResetConfirm(e.target.value)}
                                            className="w-full bg-black/40 border border-red-500/30 rounded-lg p-2 text-white mb-4 placeholder-gray-600 text-sm"
                                            placeholder="Digite a confirmação..."
                                        />
                                        <Button 
                                            onClick={handleReset} 
                                            disabled={resetConfirm !== 'CONFIRMO_RESET_TOTAL'}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Resetar Tudo
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-6 flex items-center gap-2">
                                    <History size={20} /> Histórico de Atualizações
                                </h2>
                                <div className="bg-black/20 rounded-xl overflow-hidden border border-white/5 max-h-[400px] overflow-y-auto">
                                    {history.length === 0 ? (
                                        <p className="p-8 text-center text-gray-500">Nenhum registro encontrado.</p>
                                    ) : (
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-white/5 text-gray-400 uppercase font-bold text-xs sticky top-0">
                                                <tr>
                                                    <th className="p-4">Data</th>
                                                    <th className="p-4">Ação</th>
                                                    <th className="p-4">Detalhes</th>
                                                    <th className="p-4">Usuário</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-gray-300">
                                                {history.map(log => (
                                                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                                                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                                                        </td>
                                                        <td className="p-4 font-bold text-white">{log.action}</td>
                                                        <td className="p-4">{log.details}</td>
                                                        <td className="p-4 text-xs uppercase tracking-wider">
                                                            {log.user?.name || 'Sistema'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            {activeTab !== 'sistema' && (
                <div className="fixed bottom-0 right-0 left-0 md:left-[280px] bg-[#111] border-t border-white/10 p-4 md:px-8 flex justify-end items-center gap-4 z-40">
                    <p className="text-xs text-gray-500">Última atualização: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'N/A'}</p>
                    <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-brand-red hover:bg-red-700 text-white font-bold px-8 py-6 rounded-xl flex items-center gap-2 shadow-lg"
                    >
                        {saving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
                    </Button>
                </div>
            )}
        </div>
    );
}
