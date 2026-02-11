import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import CourseCalendar from './CourseCalendar';

const Courses = () => {
    const courses = [
        {
            title: "Curso Online de Revisão Avançada",
            subtitle: "Para pilotos e mecânicos",
            description: "O passo a passo completo da revisão, direto da oficina para sua tela. Aprenda a identificar desgastes e realizar manutenções preventivas.",
            features: ["100% Online e Vitalício", "Conteúdo Prático", "Certificado Pro Riders"],
            image: "https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-Instagram-Post-45-2.png",
            highlight: true
        },
        {
            title: "Mecânica Básica e Ergonomia",
            subtitle: "Para viajantes",
            description: "Descubra como configurar guidão, pedaleiras e manetes para o seu biotipo, além de noções essenciais de manutenção rápida.",
            features: ["Conforto Real", "Pilotagem Segura", "Prevenção de problemas"],
            image: "https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-Instagram-Post-45-3.png",
            highlight: false
        },
        {
            title: "Imersão Presencial",
            subtitle: "Hands-on na Oficina",
            description: "Dois dias intensivos dentro da oficina Pro Riders. Uma experiência única de aprendizado técnico e prática real em motores BMW GS.",
            features: ["Turmas Reduzidas (12 vagas)", "Aprenda fazendo", "Networking"],
            image: "https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-Instagram-Post-45-4.png",
            highlight: false
        }
    ];

    return (
        <section id="courses" className="py-20 bg-gray-100/5">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Domine sua Máquina
                    </h2>
                    <p className="text-gray-400 text-xl">
                        Do básico ao avançado, aprenda com quem vive a mecânica BMW GS na prática.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative bg-brand-dark rounded-2xl overflow-hidden border border-gray-800 hover:border-brand-red/50 transition-all duration-300 flex flex-col h-full hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-red/10"
                        >
                            {/* Image Header */}
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent z-10" />
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="p-8 flex flex-col flex-grow relative z-20 -mt-10">
                                <div className={`text-xs font-bold uppercase tracking-wider mb-2 inline-block px-3 py-1 rounded-full w-fit
                  ${course.highlight ? 'bg-brand-red text-white' : 'bg-gray-800 text-gray-300'}`}>
                                    {course.subtitle}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                                    {course.title}
                                </h3>

                                <p className="text-gray-400 mb-6 flex-grow">
                                    {course.description}
                                </p>

                                <ul className="mb-8 space-y-3">
                                    {course.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckCircle2 size={16} className="text-brand-red min-w-[16px] mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    {index === 0 ? (
                                        <a
                                            href="/curso-revisao-avancada"
                                            className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                                                ${course.highlight
                                                    ? 'bg-brand-red text-white hover:bg-red-700'
                                                    : 'bg-white/5 text-white hover:bg-white hover:text-brand-dark'
                                                }`}
                                        >
                                            Saiba Mais <ArrowRight size={18} />
                                        </a>
                                    ) : index === 1 ? (
                                        <a
                                            href="/curso-mecanica-basica-e-ergonomia"
                                            className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer
                                                ${course.highlight
                                                    ? 'bg-brand-red text-white hover:bg-red-700'
                                                    : 'bg-white/5 text-white hover:bg-white hover:text-brand-dark'
                                                }`}
                                        >
                                            Saiba Mais <ArrowRight size={18} />
                                        </a>
                                    ) : (
                                        <button className={`w-full py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                                              ${course.highlight
                                                ? 'bg-brand-red text-white hover:bg-red-700'
                                                : 'bg-white/5 text-white hover:bg-white hover:text-brand-dark'
                                            }`}>
                                            Saiba Mais <ArrowRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-32">
                    <div className="text-center mb-16">
                        <span className="text-brand-red font-black uppercase tracking-[0.3em] text-xs mb-4 block">Próximos Treinamentos</span>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Calendário de <span className="text-brand-red">Imersões</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Vagas limitadas para garantir a qualidade do aprendizado técnico 100% focado em resultados.</p>
                    </div>
                    <CourseCalendar />
                </div>
            </div>
        </section>
    );
};

export default Courses;
