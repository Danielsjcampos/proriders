import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    MapPin, 
    CheckCircle2, 
    User, 
    Award, 
    CreditCard, 
    ChevronRight,
    Star,
    Shield,
    Trophy,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header-2';
import LeadForm from '@/components/LeadForm';
import CourseQuiz from '@/components/CourseQuiz';

export default function CourseLandingPage() {
    const { slug } = useParams();
    const [courseDate, setCourseDate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [funnelStep, setFunnelStep] = useState<'form' | 'quiz' | 'finished'>('form');

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseDate = async () => {
            try {
                console.log('Fetching slug:', slug);
                const response = await fetch(`/api/public/course-dates/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Data received:', data);
                    setCourseDate(data);
                } else {
                    const err = await response.text();
                    console.error('Fetch error:', err);
                    setErrorMsg(`Erro ${response.status}: ${response.status === 404 ? 'Turma não encontrada' : err}`);
                }
            } catch (error: any) {
                console.error('Error fetching course:', error);
                setErrorMsg(error.message || 'Erro de conexão');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchCourseDate();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="size-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!courseDate) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 text-center">
                <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">Turma não encontrada</h1>
                <p className="text-gray-500 mb-8">{errorMsg || 'Verifique o endereço digitado.'}</p>
                <div className="bg-white/5 p-4 rounded-lg text-left text-xs font-mono mb-8 max-w-md w-full overflow-auto">
                    <p className="font-bold mb-2">Debug Info:</p>
                    <p>Slug: {slug}</p>
                    <p>Error: {errorMsg}</p>
                </div>
                <Link to="/">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white hover:text-black uppercase font-bold tracking-widest">
                        Voltar para Home
                    </Button>
                </Link>
            </div>
        );
    }

    const { course } = courseDate;
    const startDate = new Date(courseDate.startDate);
    const endDate = courseDate.endDate ? new Date(courseDate.endDate) : null;
    const spotsLeft = Math.max(0, courseDate.maxStudents - courseDate.enrolledCount);

    const scrollToRegistration = () => {
        const el = document.getElementById('registration-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-red/30 selection:text-white">
            <Header />

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black/90 backdrop-blur border-t border-white/10 md:hidden flex items-center justify-between gap-4">
                <div className="text-xs">
                    <p className="font-bold text-white">Investimento</p>
                    <p className="text-brand-red font-black text-lg">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(courseDate.price))}
                    </p>
                </div>
                <Button 
                    onClick={scrollToRegistration}
                    className="bg-brand-red hover:bg-red-700 text-white uppercase font-black tracking-widest text-xs px-6 py-0 h-10 w-auto rounded-full shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                    Inscrever-se
                </Button>
            </div>

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={courseDate.coverImage || course.image || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070"} 
                        alt={course.name}
                        className="w-full h-full object-cover opacity-50 scale-105 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-70" />
                </div>

                <div className="container mx-auto px-4 z-10 relative flex flex-col items-center justify-center h-full pb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto text-center space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 backdrop-blur-md text-brand-red text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
                            <Star size={10} className="fill-current" />
                            Curso Oficial Pro Riders
                            <Star size={10} className="fill-current" />
                        </div>
                        
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                            {course.name}
                        </h1>
                        
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md">
                            {course.description || "Domine sua moto e eleve sua pilotagem ao nível profissional com técnicas avançadas e instrutores de elite."}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400">
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:border-brand-red/50 transition-colors">
                                <Calendar size={16} className="text-brand-red" />
                                {startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:border-brand-red/50 transition-colors">
                                <MapPin size={16} className="text-brand-red" />
                                {courseDate.location}
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 hover:border-brand-red/50 transition-colors">
                                <Users size={16} className="text-brand-red" />
                                {spotsLeft > 0 ? `${spotsLeft} Vagas Restantes` : 'Vagas Esgotadas'}
                            </div>
                        </div>

                        <div className="pt-8">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={scrollToRegistration}
                                className="group relative inline-flex items-center gap-4 bg-brand-red hover:bg-red-700 text-white text-base sm:text-xl font-black uppercase tracking-wider px-12 py-6 rounded-full overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all cursor-pointer"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                                Garantir Minha Vaga
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                <Shield size={10} /> 30 dias de garantia incondicional
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block text-center">Saiba Mais</span>
                    <ChevronRight className="rotate-90 text-gray-500" />
                </div>
            </header>

            {/* Video Section */}
            {courseDate.videoUrl && (
                <section className="py-20 bg-black relative border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-white/10 flex-1" />
                            <h2 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em]">Preview Exclusivo</h2>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>
                        <div className="max-w-6xl mx-auto rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a] relative group">
                            <div className="aspect-video relative">
                                <iframe 
                                    src={courseDate.videoUrl.includes('watch?v=') ? courseDate.videoUrl.replace('watch?v=', 'embed/') : courseDate.videoUrl} 
                                    className="w-full h-full" 
                                    allowFullScreen 
                                    title="Course Preview"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Grid */}
            <section className="py-20 bg-[#050505] relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                        
                        {/* Left Column: Content (7/12) */}
                        <div className="lg:col-span-7 space-y-20">
                            
                            {/* Syllabus/Content */}
                            <div>
                                <h3 className="text-brand-red font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                    <Trophy size={16} /> O Que Você Vai Dominar
                                </h3>
                                <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight mb-8">
                                    Conteúdo Programático
                                </h2>
                                <div className="prose prose-invert prose-lg max-w-none text-gray-300 bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl">
                                    <div dangerouslySetInnerHTML={{ __html: course.content || course.description }} />
                                </div>

                                {/* Schedule Section */}
                                {(() => {
                                    const scheduleData = (courseDate.schedule && Array.isArray(courseDate.schedule) && courseDate.schedule.length > 0) 
                                        ? courseDate.schedule 
                                        : (course.schedule && Array.isArray(course.schedule) && course.schedule.length > 0) 
                                            ? course.schedule 
                                            : null;
                                    if (!scheduleData) return null;
                                    return (
                                    <div className="mt-12 pt-12 border-t border-white/5">
                                        <h3 className="text-brand-red font-black uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                                            <Calendar size={16} /> Cronograma Detalhado
                                        </h3>
                                        <div className="grid gap-6">
                                            {scheduleData.map((dayItem: any, index: number) => {
                                                const isGold = index === 2;
                                                const isRed = index === 0;
                                                
                                                const borderClass = isGold ? "border-yellow-500/30 hover:border-yellow-500" : isRed ? "border-brand-red/30 hover:border-brand-red" : "border-white/5 hover:border-white/20";
                                                const bgClass = isGold ? "bg-yellow-500/5" : isRed ? "bg-brand-red/5" : "bg-white/5";
                                                const textClass = isGold ? "text-yellow-500" : isRed ? "text-brand-red" : "text-white";
                                                const bulletColor = isGold ? "bg-yellow-500" : "bg-brand-red";
                                                
                                                return (
                                                <div key={index} className={`${bgClass} border ${borderClass} p-6 rounded-2xl transition-all`}>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className={`text-2xl font-black ${textClass} opacity-80`}>{String(index + 1).padStart(2, '0')}</span>
                                                        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${isGold ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' : isRed ? 'border-brand-red/30 text-brand-red bg-brand-red/10' : 'border-white/10 text-gray-400 bg-white/5'}`}>
                                                            {dayItem.day}
                                                        </div>
                                                    </div>
                                                    <h4 className="text-xl font-bold text-white mb-4">{dayItem.title}</h4>
                                                    <ul className="space-y-3">
                                                        {dayItem.topics?.map((topic: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3 group/item">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${bulletColor} mt-2 shrink-0 group-hover/item:scale-150 transition-transform`}></div>
                                                                <span className="text-gray-400 text-sm leading-tight group-hover/item:text-gray-300 transition-colors">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    );
                                })()}
                            </div>

                            {/* Instructor Bio */}
                            {courseDate.instructorName && (
                                <div>
                                    <h3 className="text-brand-red font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                        <User size={16} /> Seu Mentor
                                    </h3>
                                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden relative group">
                                         <div className="absolute top-0 right-0 p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <div className="bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">Instrutor Oficial</div>
                                         </div>
                                        <div className="md:flex">
                                            <div className="md:w-1/3 relative min-h-[300px]">
                                                <img 
                                                    src={courseDate.instructorImage || "https://ui-avatars.com/api/?name=" + courseDate.instructorName} 
                                                    alt={courseDate.instructorName}
                                                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent md:bg-gradient-to-r" />
                                            </div>
                                            <div className="p-8 md:p-10 md:w-2/3 flex flex-col justify-center">
                                                <h4 className="text-3xl font-black text-white mb-2 uppercase italic">{courseDate.instructorName}</h4>
                                                <div className="w-12 h-1 bg-brand-red mb-6" />
                                                <p className="text-gray-400 leading-relaxed text-sm">
                                                    {courseDate.instructorBio || "Instrutor certificado Pro Riders com anos de experiência em pilotagem de alta performance. Especialista em técnicas de segurança e controle da motocicleta."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Location */}
                            {courseDate.address && (
                                <div>
                                    <h3 className="text-brand-red font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                        <MapPin size={16} /> Onde Será
                                    </h3>
                                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[32px] overflow-hidden">
                                        {courseDate.mapUrl ? (
                                            <div className="relative h-[400px] border-b border-white/5">
                                                 <iframe 
                                                    src={courseDate.mapUrl} 
                                                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                                                    loading="lazy" 
                                                    title="Localização do Curso"
                                                />
                                            </div>
                                        ) : null}
                                        <div className="p-8 flex items-start gap-4">
                                            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                                <MapPin className="text-brand-red" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-2">{courseDate.location}</h4>
                                                <p className="text-gray-400">{courseDate.address}, {courseDate.number}</p>
                                                <p className="text-gray-400">{courseDate.neighborhood} - {courseDate.city}/{courseDate.state}</p>
                                                <p className="text-gray-500 text-sm mt-2">CEP: {courseDate.cep}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Registration (5/12) */}
                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-24" id="registration-section">
                                <div className="bg-[#0f0f0f] border border-white/10 rounded-[32px] p-2 shadow-2xl overflow-hidden ring-1 ring-white/5">
                                    <div className="bg-[#1a1a1a] rounded-[24px] overflow-hidden">
                                        
                                        {funnelStep === 'finished' ? (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-12 px-8"
                                            >
                                                <div className="size-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                                                    <CheckCircle2 className="size-12 text-white" />
                                                </div>
                                                <h3 className="text-3xl font-black text-white uppercase italic mb-4">Inscrição Recebida!</h3>
                                                <p className="text-gray-400 mb-8 leading-relaxed">
                                                    Parabéns por dar esse passo na sua pilotagem. Nossa equipe entrará em contato via WhatsApp para confirmar sua vaga e passar os próximos passos.
                                                </p>
                                                <Link to="/">
                                                    <Button variant="outline" className="border-white/10 text-gray-400 hover:text-white w-full py-6 rounded-xl">Voltar ao Início</Button>
                                                </Link>
                                            </motion.div>
                                        ) : (
                                            <>
                                                <div className="bg-black/40 p-8 border-b border-white/5">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <p className="text-brand-red font-black uppercase tracking-widest text-[10px] mb-1">Oferta Exclusiva</p>
                                                            <h3 className="text-2xl font-black text-white uppercase italic">Garanta sua Vaga</h3>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-gray-500 line-through mb-0.5">R$ {Number(courseDate.price) * 1.2}</p>
                                                            <p className="text-3xl font-black text-white leading-none">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(courseDate.price))}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-white/5 p-3 rounded-lg">
                                                        <span className="flex items-center gap-2"><CreditCard size={12} /> Até 12x no cartão</span>
                                                        <span className="flex items-center gap-2"><Shield size={12} /> Compra Segura</span>
                                                    </div>
                                                </div>

                                                <div className="p-8">
                                                    <AnimatePresence mode="wait">
                                                        {funnelStep === 'form' && (
                                                            <motion.div
                                                                key="form"
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -20 }}
                                                            >
                                                                <div className="mb-6">
                                                                    <p className="text-sm text-gray-400 text-center mb-4">Preencha para iniciar sua inscrição:</p>
                                                                    <LeadForm 
                                                                        interest={`${course.name} - ${courseDate.location}`} 
                                                                        origin={`LP ${courseDate.slug}`} 
                                                                        courseDateId={courseDate.id}
                                                                        onSuccess={() => setFunnelStep('quiz')}
                                                                    />
                                                                </div>
                                                            </motion.div>
                                                        )}

                                                        {funnelStep === 'quiz' && (
                                                            <motion.div
                                                                key="quiz"
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -20 }}
                                                            >
                                                                <div className="mb-6 text-center">
                                                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 text-brand-red text-[10px] uppercase tracking-widest font-black mb-4">
                                                                        Etapa 2 de 2
                                                                    </div>
                                                                    <h4 className="text-xl font-bold text-white mb-1">Perfil do Piloto</h4>
                                                                    <p className="text-xs text-gray-500">Personalize sua experiência no curso</p>
                                                                </div>
                                                                <CourseQuiz onComplete={() => setFunnelStep('finished')} />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="p-4 bg-[#0a0a0a] border-t border-white/5">
                                        <div className="flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                            {/* Fake Trust Badges */}
                                            <div className="h-6 w-12 bg-white/10 rounded"></div>
                                            <div className="h-6 w-12 bg-white/10 rounded"></div>
                                            <div className="h-6 w-12 bg-white/10 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Benefits List below form */}
                                <div className="mt-8 grid grid-cols-1 gap-4">
                                    <div className="bg-[#0f0f0f] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Certificado Oficial</h5>
                                            <p className="text-[10px] text-gray-500">Reconhecido em todo território nacional</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#0f0f0f] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red shrink-0">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Networking Elite</h5>
                                            <p className="text-[10px] text-gray-500">Conecte-se com pilotos experientes</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
