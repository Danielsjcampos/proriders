import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, GraduationCap, Trash2, Plus, Calendar, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/ImageUpload';

interface CourseTemplateModalProps {
    existingCourse?: any;
    initialData?: any;
    onClose: () => void;
    onSave: () => void;
}

export default function CourseTemplateModal({ existingCourse, initialData, onClose, onSave }: CourseTemplateModalProps) {
    const baseData = existingCourse || initialData;

    const [formData, setFormData] = useState({
        name: baseData?.name || '',
        slug: baseData?.slug ? (initialData ? `${baseData.slug}-copy` : baseData.slug) : '',
        description: baseData?.description || '',
        content: baseData?.content || '',
        type: baseData?.type || 'CURSO',
        status: baseData?.status || 'PUBLICADO',
        instructorId: baseData?.instructorId || '',
        image: baseData?.image || '',
        certificateLayout: baseData?.certificateLayout || '',
        badgeLayout: baseData?.badgeLayout || '',
        learningOutcomes: baseData?.learningOutcomes || [],
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
    const [instructors, setInstructors] = useState<any[]>([]);

    useEffect(() => {
        // Fetch users who can be instructors (admins or instructors)
        const fetchInstructors = async () => {
            try {
                const response = await fetch('/api/admin/users?role=ADMIN,INSTRUCTOR');
                if (response.ok) {
                    const data = await response.json();
                    setInstructors(data);
                }
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };
        fetchInstructors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = existingCourse ? `/api/courses/${existingCourse.id}` : '/api/courses';
            const method = existingCourse ? 'PATCH' : 'POST';
            
            // Auto-generate slug if empty
            if (!formData.slug && formData.name) {
                formData.slug = formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSave();
                onClose();
            }
        } catch (error) {
            console.error('Error saving course template:', error);
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
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-red/20 rounded-xl text-brand-red">
                            <GraduationCap size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {existingCourse ? 'Editar Modelo de Curso' : (initialData ? 'Duplicar Modelo' : 'Criar Novo Modelo')}
                            </h2>
                            <p className="text-xs text-gray-500">Defina os parâmetros base para este curso.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={20} />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Título do Evento / Curso</label>
                            <input 
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                placeholder="ex: CURSO SUSPENSÃO W-TECH"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo de Evento</label>
                            <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                                {['CURSO', 'EVENTO', 'TRACK DAY'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: t })}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                            formData.type === t ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'
                                        }`}
                                    >
                                        {t === 'TRACK DAY' ? 'Track Day' : t.charAt(0) + t.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL amigável (Slug)</label>
                            <input 
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all"
                                placeholder="ex: curso-suspensao-wtech-sp"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all appearance-none"
                            >
                                <option value="PUBLICADO">Publicado (Visível)</option>
                                <option value="RASCUNHO">Rascunho (Interno)</option>
                                <option value="OCULTO">Oculto (Site Oculto)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Responsável / Instrutor</label>
                        <select
                            value={formData.instructorId}
                            onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-brand-red transition-all appearance-none"
                        >
                            <option value="">Selecione um instrutor</option>
                            {instructors.map(inst => (
                                <option key={inst.id} value={inst.id}>{inst.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* CRONOGRAMA SECTION (MOVED UP) */}
                    <div className="space-y-6 bg-white/[0.02] p-8 rounded-[32px] border border-white/5">
                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-red/10 rounded-xl">
                                    <Calendar className="text-brand-red" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-widest">Cronograma Padrão</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cronograma base que será herdado pelas novas turmas</p>
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
                                            placeholder="Título do cronograma"
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

                                    {/* Topics inside Day */}
                                    <div className="space-y-3 pl-6 border-l-2 border-brand-red/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tópicos</label>
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
                                                        placeholder="Ex: Revisão..."
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descrição Geral / Resumo</label>
                        <textarea 
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-brand-red transition-all custom-scrollbar font-mono text-sm"
                            placeholder="Resumo do curso..."
                        />
                    </div>

                    {/* Learning Outcomes */}
                    <div className="space-y-3">
                         <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">O que você vai aprender</label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData({ ...formData, learningOutcomes: [...formData.learningOutcomes, ''] })}
                                className="h-6 w-6 p-0 rounded-full bg-white/5 hover:bg-white/10"
                            >
                                <Plus size={14} className="text-brand-red" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {formData.learningOutcomes.map((item: any, index: number) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        value={item}
                                        onChange={(e) => {
                                            const newOutcomes = [...formData.learningOutcomes];
                                            newOutcomes[index] = e.target.value;
                                            setFormData({ ...formData, learningOutcomes: newOutcomes });
                                        }}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-brand-red"
                                        placeholder="Tópico de aprendizado..."
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            const newOutcomes = formData.learningOutcomes.filter((_: any, i: number) => i !== index);
                                            setFormData({ ...formData, learningOutcomes: newOutcomes });
                                        }}
                                        className="h-10 w-10 text-gray-500 hover:text-red-500"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                            {formData.learningOutcomes.length === 0 && (
                                <p className="text-xs text-gray-600 italic ml-1">Nenhum tópico adicionado.</p>
                            )}
                        </div>
                    </div>



                    {/* Layouts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <ImageUpload 
                                label="Imagem/Layout do Certificado"
                                value={formData.certificateLayout}
                                onChange={(url) => setFormData({ ...formData, certificateLayout: url })}
                            />
                        </div>
                        <div className="space-y-2">
                            <ImageUpload 
                                label="Imagem/Layout do Crachá"
                                value={formData.badgeLayout}
                                onChange={(url) => setFormData({ ...formData, badgeLayout: url })}
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <ImageUpload 
                            label="Imagem de Capa (Curso)"
                            value={formData.image}
                            onChange={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>

                    {/* Footer Actions */}
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
                            className="flex-[2] bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-xl py-6 gap-2"
                        >
                            {loading ? 'Processando...' : (
                                <>
                                    <Save size={18} />
                                    {existingCourse ? 'Atualizar Modelo' : 'Criar Modelo'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
