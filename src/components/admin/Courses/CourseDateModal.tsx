import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, DollarSign, Navigation, CreditCard, User, PlayCircle, Trash2, Plus, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '../../ui/ImageUpload';

interface CourseDateModalProps {
    courseId: string;
    existingDate?: any;
    initialData?: any;
    onClose: () => void;
    onSave: () => void;
}

export default function CourseDateModal({ courseId, existingDate, initialData, onClose, onSave }: CourseDateModalProps) {
    const baseData = existingDate || initialData;
    
    const [formData, setFormData] = useState({
        startDate: baseData?.startDate?.split('T')[0] || '',
        endDate: baseData?.endDate?.split('T')[0] || '',
        timeStart: baseData?.timeStart || '08:00',
        timeEnd: baseData?.timeEnd || '18:00',
        
        cep: baseData?.cep || '',
        address: baseData?.address || '',
        number: baseData?.number || '',
        neighborhood: baseData?.neighborhood || '',
        city: baseData?.city || '',
        state: baseData?.state || '',
        location: baseData?.location || '',
        latitude: baseData?.latitude || '',
        longitude: baseData?.longitude || '',
        mapUrl: baseData?.mapUrl || '',
        
        modality: baseData?.modality || 'Presencial',
        billingType: baseData?.billingType || 'NACIONAL',
        instructorName: baseData?.instructorName || '',
        instructorImage: baseData?.instructorImage || '',
        instructorBio: baseData?.instructorBio || '',
        coverImage: baseData?.coverImage || '',
        videoUrl: baseData?.videoUrl || '',
        
        price: baseData?.price || '',
        priceRecycling: baseData?.priceRecycling || '',
        maxStudents: baseData?.maxStudents || 12,
        slug: baseData?.slug ? (initialData ? `${baseData.slug}-copy` : baseData.slug) : '',
        active: baseData?.active ?? true,
        schedule: baseData?.schedule || [
            {
                day: 'SEXTA-FEIRA',
                title: 'DIAGNÓSTICO E DESMONTAGEM',
                topics: [
                    'Introdução ao recebimento da moto',
                    'Aplicação do Checklist de Recebimento',
                    'Lista da Manutenção Programada',
                    'TEXA - Diagnóstico Global',
                    'Aferição e Diagnóstico para orçamento corretivo',
                    'DESMONTAGEM DA MOTO: Injeção, Admissão, Cardan, Embreagem, Válvulas e Rodas'
                ]
            },
            {
                day: 'SÁBADO',
                title: 'PROCESSO DE REVISÃO (PARTE I)',
                topics: [
                    'Montagem do Sistema de Embreagem',
                    'Troca do Fluído Acionador de Embreagem',
                    'Montagem do Sistema de Transmissão (Cardan, Balança e Diferencial)',
                    'Revisão e Montagem das Rodas',
                    'Enquadramento de Comando e Folgas no Sistema',
                    'Sistema de Arrefecimento'
                ]
            },
            {
                day: 'DOMINGO',
                title: 'PROCESSO DE REVISÃO (PARTE II)',
                topics: [
                    'Montagem do Sistema de Injeção',
                    'Revisão do Sistema de Freios e ABS',
                    'TEXA - Atualização de Tempo de Serviço e Reset',
                    'Montagem das Carenagens e Protetores',
                    'Passagem no Dinamômetro',
                    'Ajustes Ergonômicos Personalizados'
                ]
            }
        ]
    });
    
    const [loading, setLoading] = useState(false);

    // Auto-fetch address from CEP (simple version)
    const handleCepBlur = async () => {
        if (formData.cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
                if (response.ok) {
                    const data = await response.json();
                    if (!data.erro) {
                        setFormData(prev => ({
                            ...prev,
                            address: data.logradouro,
                            neighborhood: data.bairro,
                            city: data.localidade,
                            state: data.uf,
                            location: `${data.localidade} - ${data.uf}`
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching CEP:', error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = existingDate ? `/api/course-dates/${existingDate.id}` : '/api/course-dates';
            const method = existingDate ? 'PATCH' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, courseId })
            });

            if (response.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error('Error saving course date:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-red/20 rounded-xl text-brand-red">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {existingDate ? 'Editar Turma' : (initialData ? 'Duplicar Turma' : 'Agendar Nova Turma')}
                            </h2>
                            <p className="text-xs text-gray-500">Configure os detalhes da instância deste curso.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={20} />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Header Info (for visibility) */}
                    <div className="bg-brand-red/5 border border-brand-red/20 rounded-[24px] p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-brand-red uppercase tracking-widest mb-1">Configurando</p>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{formData.slug || 'Nova Turma'}</h3>
                        </div>
                        <div className="p-3 bg-brand-red/10 rounded-2xl">
                            <ClipboardList className="text-brand-red" size={24} />
                        </div>
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-[24px] border border-white/5">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={14} className="text-brand-red" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Datas do Evento</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Data Início</label>
                                    <input 
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Data Fim (Opcional)</label>
                                    <input 
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <PlayCircle size={14} className="text-brand-red" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horários</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Início</label>
                                    <input 
                                        type="time"
                                        required
                                        value={formData.timeStart}
                                        onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fim</label>
                                    <input 
                                        type="time"
                                        required
                                        value={formData.timeEnd}
                                        onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CRONOGRAMA SECTION (MOVED TO TOP) */}
                    <div className="space-y-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-red/10 rounded-xl">
                                    <ClipboardList className="text-brand-red" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-widest">Cronograma Detalhado</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Defina as atividades diárias do treinamento</p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setFormData({
                                        ...formData,
                                        schedule: [...formData.schedule, { day: '', title: '', topics: [''] }]
                                    });
                                }}
                                className="text-[10px] font-black uppercase tracking-tighter border-brand-red/20 text-brand-red hover:bg-brand-red hover:text-white rounded-full px-4 h-9 gap-1"
                            >
                                <Plus size={14} /> Adicionar Dia
                            </Button>
                        </div>

                        <div className="grid gap-6">
                            {formData.schedule.map((dayItem: any, dayIndex: number) => (
                                <div key={dayIndex} className="bg-black/40 border border-white/10 rounded-2xl p-6 relative group transition-all hover:border-brand-red/30">
                                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-3xl font-black text-white/10 group-hover:text-brand-red/20 transition-colors tracking-tighter">{String(dayIndex + 1).padStart(2, '0')}</span>
                                            <input
                                                value={dayItem.day}
                                                onChange={(e) => {
                                                    const newSchedule = [...formData.schedule];
                                                    newSchedule[dayIndex].day = e.target.value;
                                                    setFormData({ ...formData, schedule: newSchedule });
                                                }}
                                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white outline-none focus:border-brand-red font-black uppercase w-32 tracking-wider"
                                                placeholder="SÁBADO"
                                            />
                                        </div>
                                        <input
                                            value={dayItem.title}
                                            onChange={(e) => {
                                                const newSchedule = [...formData.schedule];
                                                newSchedule[dayIndex].title = e.target.value;
                                                setFormData({ ...formData, schedule: newSchedule });
                                            }}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white outline-none focus:border-brand-red font-bold uppercase tracking-wide"
                                            placeholder="Título do cronograma para este dia"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const newSchedule = formData.schedule.filter((_: any, i: number) => i !== dayIndex);
                                                setFormData({ ...formData, schedule: newSchedule });
                                            }}
                                            className="h-9 w-9 text-gray-600 hover:bg-red-500/10 hover:text-red-500 rounded-xl shrink-0"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>

                                    {/* Topics list */}
                                    <div className="space-y-3 pl-6 border-l-2 border-brand-red/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tópicos / Assuntos</label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const newSchedule = [...formData.schedule];
                                                    if (!newSchedule[dayIndex].topics) newSchedule[dayIndex].topics = [];
                                                    newSchedule[dayIndex].topics.push('');
                                                    setFormData({ ...formData, schedule: newSchedule });
                                                }}
                                                className="h-6 w-6 p-0 rounded-full bg-white/5 hover:bg-brand-red/20 hover:text-brand-red transition-colors"
                                            >
                                                <Plus size={14} />
                                            </Button>
                                        </div>
                                        <div className="grid gap-2">
                                            {dayItem.topics?.map((topic: string, topicIndex: number) => (
                                                <div key={topicIndex} className="flex gap-2">
                                                    <input
                                                        value={topic}
                                                        onChange={(e) => {
                                                            const newSchedule = [...formData.schedule];
                                                            newSchedule[dayIndex].topics[topicIndex] = e.target.value;
                                                            setFormData({ ...formData, schedule: newSchedule });
                                                        }}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-xs text-gray-400 outline-none focus:border-brand-red focus:text-white transition-all"
                                                        placeholder="Ex: Revisão de Válvulas..."
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            const newSchedule = [...formData.schedule];
                                                            newSchedule[dayIndex].topics = newSchedule[dayIndex].topics.filter((_: any, i: number) => i !== topicIndex);
                                                            setFormData({ ...formData, schedule: newSchedule });
                                                        }}
                                                        className="h-8 w-8 text-gray-700 hover:text-red-500 rounded-lg"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                            {(!dayItem.topics || dayItem.topics.length === 0) && (
                                                <p className="text-[10px] text-gray-600 italic">Nenhum tópico adicionado.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {formData.schedule.length === 0 && (
                            <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-10 text-center">
                                <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Nenhum cronograma definido</p>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setFormData({ ...formData, schedule: [{ day: '', title: '', topics: [''] }] })}
                                    className="mt-4 text-brand-red text-[10px] font-black uppercase tracking-widest underline decoration-brand-red/30 underline-offset-4"
                                >
                                    Iniciar Novo Cronograma
                                </Button>
                            </div>
                        )}
                    </div>


                    {/* Address Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Navigation size={14} className="text-brand-red" />
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Localização e Endereço</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">CEP</label>
                                <input 
                                    type="text"
                                    placeholder="00000000"
                                    value={formData.cep}
                                    onBlur={handleCepBlur}
                                    onChange={(e) => setFormData({ ...formData, cep: e.target.value.replace(/\D/g, '') })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Endereço (Rua/Av)</label>
                                <input 
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Número</label>
                                <input 
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bairro</label>
                                <input 
                                    type="text"
                                    value={formData.neighborhood}
                                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Cidade</label>
                                <input 
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Estado</label>
                                <input 
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                    maxLength={2}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Local (Exibido no Cabeçalho)</label>
                            <input 
                                type="text"
                                required
                                placeholder="ex: São José do Rio Preto - SP"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Latitude</label>
                                <input 
                                    type="text"
                                    value={formData.latitude}
                                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Longitude</label>
                                <input 
                                    type="text"
                                    value={formData.longitude}
                                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modality & Instructor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Modalidade</label>
                            <select
                                value={formData.modality}
                                onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all appearance-none"
                            >
                                <option value="Presencial">Presencial</option>
                                <option value="Online">Online</option>
                                <option value="Híbrido">Híbrido</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Instrutor Específico</label>
                            <input 
                                type="text"
                                value={formData.instructorName}
                                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                placeholder="Nome do Instrutor"
                            />
                        </div>
                    </div>
                    
                    {/* Detailed Instructor & Media Section */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <User size={14} className="text-brand-red" />
                            <h3 className="text-xs font-black text-white uppercase tracking-wider">Mídia e Detalhes do Instrutor</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <ImageUpload 
                                    label="Foto do Instrutor"
                                    value={formData.instructorImage}
                                    onChange={(url: string) => setFormData({ ...formData, instructorImage: url })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL do Vídeo (YouTube/Vimeo)</label>
                                <div className="relative">
                                    <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                    <input 
                                        type="text"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Biografia do Instrutor</label>
                            <textarea 
                                rows={3}
                                value={formData.instructorBio}
                                onChange={(e) => setFormData({ ...formData, instructorBio: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all resize-none"
                                placeholder="Breve descrição sobre a experiência do instrutor..."
                            />
                        </div>

                        <div className="space-y-2">
                            <ImageUpload 
                                label="Imagem de Capa (Turma)"
                                value={formData.coverImage}
                                onChange={(url: string) => setFormData({ ...formData, coverImage: url })}
                            />
                        </div>

                    </div>



                    {/* Billing & Capacity Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo de Faturamento</label>
                            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                {['NACIONAL', 'INTERNACIONAL'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, billingType: t })}
                                        className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                            formData.billingType === t ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {t === 'NACIONAL' ? 'BR Nacional' : 'Internacional'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Vagas / Cotas</label>
                            <input 
                                type="number"
                                required
                                value={formData.maxStudents}
                                onChange={(e) => setFormData({ ...formData, maxStudents: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL amigável (Slug)</label>
                            <input 
                                type="text"
                                required
                                placeholder="mecanica-gs-sp-maio"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Valor do Curso (R$)</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                <input 
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Reciclagem (R$)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                                <input 
                                    type="number"
                                    step="0.01"
                                    value={formData.priceRecycling}
                                    onChange={(e) => setFormData({ ...formData, priceRecycling: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>
                        </div>
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
                            {loading ? 'Salvando...' : (existingDate ? 'Atualizar Turma' : 'Salvar Turma')}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
