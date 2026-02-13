import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    MapPin, 
    Clock, 
    Award, 
    CreditCard, 
    ChevronRight,
    Star,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DynamicCourseLP() {
    const { slug } = useParams();
    const [courseDate, setCourseDate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseDate = async () => {
            try {
                const response = await fetch(`/api/public/course-dates/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    setCourseDate(data);
                } else {
                    console.error('Course date not found');
                }
            } catch (error) {
                console.error('Error fetching course:', error);
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
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <h1 className="text-3xl font-bold mb-4">Turma não encontrada</h1>
                <Link to="/">
                    <Button>Voltar para Home</Button>
                </Link>
            </div>
        );
    }

    const { course } = courseDate;
    const startDate = new Date(courseDate.startDate);
    const endDate = courseDate.endDate ? new Date(courseDate.endDate) : null;

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-red/30 selection:text-white">
            {/* Hero Section */}
            <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={courseDate.coverImage || course.image || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2070"} 
                        alt={course.name}
                        className="w-full h-full object-cover opacity-40 scale-105 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
                </div>

                <div className="container mx-auto px-4 z-10 relative pt-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/30 text-brand-red text-xs font-black uppercase tracking-widest mb-6">
                            <Star size={12} className="fill-current" />
                            Curso Oficial Pro Riders
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                                {course.name}
                            </span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                            {course.description || "Domine sua moto e eleve sua pilotagem ao nível profissional com técnicas avançadas e instrutores de elite."}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-400 mb-12">
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <Calendar size={16} className="text-brand-red" />
                                {startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <MapPin size={16} className="text-brand-red" />
                                {courseDate.location}
                            </div>
                        </div>

                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a href="#inscricao" className="inline-flex items-center gap-3 bg-brand-red text-white text-lg font-black uppercase tracking-wider px-10 py-5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all">
                                Garantir Minha Vaga
                                <ChevronRight className="animate-pulse" />
                            </a>
                        </motion.div>
                        
                        <p className="mt-4 text-xs text-gray-500 uppercase tracking-widest">
                            Vagas Limitadas: Restam apenas {courseDate.maxStudents - courseDate.enrolledCount} vagas
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Video Section */}
            {courseDate.videoUrl && (
                <section className="py-20 bg-black relative">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#111]">
                            <div className="aspect-video relative group cursor-pointer">
                                {/* Placeholder logic for creating embed if standard youtube/vimeo, else just iframe */}
                                <iframe 
                                    src={courseDate.videoUrl.replace('watch?v=', 'embed/')} 
                                    className="w-full h-full" 
                                    allowFullScreen 
                                    title="Course Preview"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Info */}
            <section className="py-20 bg-[#050505]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                        
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* What you will learn */}
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-8 border-l-4 border-brand-red pl-4">
                                    Sobre o Curso
                                </h2>
                                <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                    {/* Using HTML content safely */}
                                    <div dangerouslySetInnerHTML={{ __html: course.content || course.description }} />
                                </div>
                            </div>

                            {/* Instructor Bio */}
                            {courseDate.instructorName && (
                                <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                                    <div className="shrink-0">
                                        <div className="size-32 rounded-full border-4 border-brand-red/20 overflow-hidden shadow-2xl">
                                            <img 
                                                src={courseDate.instructorImage || "https://ui-avatars.com/api/?name=" + courseDate.instructorName} 
                                                alt={courseDate.instructorName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-brand-red uppercase tracking-widest mb-2">Seu Instrutor</h3>
                                        <h4 className="text-2xl font-bold text-white mb-4">{courseDate.instructorName}</h4>
                                        <p className="text-gray-400 leading-relaxed text-sm">
                                            {courseDate.instructorBio || "Instrutor certificado Pro Riders com vasta experiência em pilotagem de alta performance e segurança viária."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Location Map */}
                            {courseDate.mapUrl && (
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-8 border-l-4 border-brand-red pl-4">
                                        Localização
                                    </h2>
                                    <div className="aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-500">
                                        <iframe 
                                            src={courseDate.mapUrl} 
                                            className="w-full h-full border-0" 
                                            loading="lazy" 
                                        />
                                    </div>
                                    <div className="mt-4 flex items-start gap-3 text-gray-400">
                                        <MapPin className="shrink-0 text-brand-red" />
                                        <p>{courseDate.address}, {courseDate.number} - {courseDate.neighborhood}, {courseDate.city} - {courseDate.state}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Sticky Sidebar */}
                        <div className="relative">
                            <div className="sticky top-10 space-y-6">
                                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-[50px] pointer-events-none group-hover:bg-brand-red/20 transition-all" />
                                    
                                    <h3 className="text-lg font-black text-white uppercase tracking-wider mb-6">Detalhes do Evento</h3>
                                    
                                    <div className="space-y-6 mb-8">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-brand-red">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Data</p>
                                                <p className="text-white font-bold">{startDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                                {endDate && (
                                                    <p className="text-xs text-gray-500 mt-1">Até {endDate.toLocaleDateString('pt-BR')}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-brand-red">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Horário</p>
                                                <p className="text-white font-bold">{courseDate.timeStart} às {courseDate.timeEnd}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white/5 rounded-xl text-brand-red">
                                                <Award size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Certificado</p>
                                                <p className="text-white font-bold">Incluso</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-6 mb-8">
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Investimento</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm text-gray-400">R$</span>
                                            <span className="text-4xl font-black text-white">{courseDate.price}</span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                                            <CreditCard size={12} />
                                            <span>Em até 12x no cartão</span>
                                        </div>
                                    </div>

                                    <div id="inscricao">
                                        <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-black uppercase tracking-wider py-6 rounded-xl text-lg shadow-lg">
                                            Inscrever-se Agora
                                        </Button>
                                        <p className="mt-4 text-[10px] text-center text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Shield size={10} /> Compra 100% Segura
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
                                    <p className="text-gray-400 text-sm mb-4">Dúvidas? Fale direto com nosso time.</p>
                                    <Button variant="outline" className="w-full border-white/10 hover:bg-white hover:text-black gap-2">
                                        Chat WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
