import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Users, 
    ChevronLeft,
    CheckCircle2,
    ArrowRight,
    Trophy
} from 'lucide-react';
import { Header } from '@/components/ui/header-2';
import LeadForm from '@/components/LeadForm';
import CourseQuiz from '@/components/CourseQuiz';
import { Button } from '@/components/ui/button';

export default function CourseLandingPage() {
    const { slug } = useParams();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [funnelStep, setFunnelStep] = useState<'info' | 'form' | 'quiz' | 'finished'>('info');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/api/courses/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setCourse(data);
                }
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex items-center justify-center">
                <div className="size-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-black text-white mb-4">Curso não encontrado</h1>
                <Link to="/">
                    <Button variant="outline">Voltar para Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-brand-dark min-h-screen text-gray-100 selection:bg-brand-red selection:text-white pb-20">
            <Header />
            
            <div className="container mx-auto px-4 pt-32">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 transition-colors uppercase text-[10px] font-black tracking-widest group">
                    <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Voltar
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left side: Course Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-12"
                    >
                        <div>
                            <span className="text-brand-red font-black uppercase tracking-[0.3em] text-xs mb-4 block">Treinamento Profissional</span>
                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                                {course.name}
                            </h1>
                            <p className="text-xl text-gray-400 leading-relaxed font-light">
                                {course.description || "Domine as técnicas avançadas de mecânica e diagnóstico com o padrão de excelência da Pro Riders."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: Calendar, label: "Data", val: "15/02/2026" },
                                { icon: Clock, label: "Duração", val: "16 Horas" },
                                { icon: MapPin, label: "Local", val: "São Paulo, SP" },
                                { icon: Users, label: "Vagas", val: "Apenas 12" }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl">
                                    <item.icon className="size-5 text-brand-red mb-3" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                                    <p className="text-lg font-black text-white">{item.val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-white uppercase tracking-widest text-sm">O que você vai aprender:</h3>
                            <div className="space-y-3">
                                {[
                                    "Diagnóstico avançado de falhas",
                                    "Manutenção preventiva de motor Boxer",
                                    "Configuração de suspensão ESA",
                                    "Metodologia Pro Riders de oficina"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="size-5 text-brand-red" />
                                        <span className="text-gray-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side: Interactive Funnel */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#0a0a0a] border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-red to-transparent opacity-30" />
                        
                        <AnimatePresence mode="wait">
                            {funnelStep === 'info' && (
                                <motion.div 
                                    key="info"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-8"
                                >
                                    <div className="size-20 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto">
                                        <Trophy className="size-10 text-brand-red" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-bold text-white">Inicie sua Transformação</h2>
                                        <p className="text-gray-400">Preencha seus dados para verificar disponibilidade de vaga e acessar o quiz de qualificação.</p>
                                    </div>
                                    <Button 
                                        onClick={() => setFunnelStep('form')}
                                        className="w-full py-8 text-xl font-bold uppercase tracking-widest bg-brand-red hover:bg-red-700 h-16"
                                    >
                                        Iniciar Inscrição <ArrowRight className="ml-2 size-5" />
                                    </Button>
                                </motion.div>
                            )}

                            {funnelStep === 'form' && (
                                <motion.div 
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-8 text-center">
                                        <h2 className="text-2xl font-bold text-white mb-2">Dados de Contato</h2>
                                        <p className="text-sm text-gray-500">Como podemos falar com você?</p>
                                    </div>
                                    <LeadForm 
                                        interest={course.name} 
                                        origin={`LP ${course.name}`} 
                                        onSuccess={() => setFunnelStep('quiz')}
                                    />
                                </motion.div>
                            )}

                            {funnelStep === 'quiz' && (
                                <motion.div 
                                    key="quiz"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <CourseQuiz onComplete={() => setFunnelStep('finished')} />
                                </motion.div>
                            )}

                            {funnelStep === 'finished' && (
                                <motion.div 
                                    key="finished"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-8 py-8"
                                >
                                    <div className="size-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                                        <CheckCircle2 className="size-12 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-white uppercase italic">Elite Confirmada!</h2>
                                        <p className="text-gray-400 text-lg">Recebemos suas respostas. Nosso time técnico entrará em contato via WhatsApp em breve para a confirmação final da sua vaga.</p>
                                    </div>
                                    <Link to="/">
                                        <Button variant="outline" className="mt-8 border-white/10 text-gray-500 hover:text-white">
                                            Voltar para Início
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
