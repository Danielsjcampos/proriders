import { motion, useScroll, useTransform } from 'framer-motion';
import { GridVignetteBackground } from '../components/ui/vignette-grid-background';
import CustomTrustIndexWidget from '../components/CustomTrustIndexWidget';
import { ChevronDown, CheckCircle2, Trophy, Gift, Calendar, Award, Activity, Star, Wrench, ArrowRight, ShieldCheck } from 'lucide-react';
import AnimatedShaderBackground from '../components/ui/animated-shader-background';
import { ShinyButton } from '../components/ui/shiny-button';
import { StarsBackground } from '../components/ui/stars';
import { GlowingEffect } from '../components/ui/glowing-effect';
import { useState, useEffect, useRef } from 'react';
import ShaderDivider from '../components/ShaderDivider';
import Marquee from '../components/ui/marquee';

// --- DATA ---



const audience = [
    "É dono de BMW GS e quer entender o que está sendo feito na sua moto antes de qualquer viagem longa.",
    "Já trabalha em oficina e quer subir o nível técnico no atendimento a big trails premium.",
    "Atua como consultor ou gestor técnico e precisa padronizar revisões e checklists de GS.",
    "Está começando na mecânica, mas quer aprender um procedimento passo a passo pensado para iniciantes."
];

const learningOutcomes = [
    "Montar um plano de revisão completo da GS, do diagnóstico ao reset final.",
    "Identificar problemas antes que se tornem panes caras e perigosas.",
    "Dialogar com clientes e pilotos com muito mais segurança técnica."
];

const faqs = [
    {
        q: "Como funciona o acesso ao curso?",
        a: "Assim que a compra for confirmada, você recebe por e-mail seu login e senha para acessar a plataforma. O acesso é imediato e vitalício: você pode assistir quando e quantas vezes quiser."
    },
    {
        q: "O curso tem certificado?",
        a: "Sim. Ao concluir as aulas, você emite o certificado digital Pro Riders diretamente na plataforma, sem custo extra."
    },
    {
        q: "Preciso ter experiência em mecânica?",
        a: "Não. O conteúdo é passo a passo e direto ao ponto, pensado tanto para iniciantes quanto para mecânicos e consultores que querem dominar o padrão de revisão da GS."
    },
    {
        q: "Posso assistir do celular?",
        a: "Pode. A plataforma é 100% responsiva: assista do celular, tablet ou computador conectado à internet."
    },
    {
        q: "E se eu não gostar do curso?",
        a: "Você tem 7 dias de garantia incondicional. Se não curtir o conteúdo, é só solicitar o reembolso dentro desse prazo e devolvemos seu investimento."
    }
];

// --- ANIMATIONS ---
const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
};

// --- HELPER COMPONENTS ---



const CountdownTimer = () => {
    // Simple 24h countdown simulation
    const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return { hours: 23, minutes: 59, seconds: 59 }; // Reset
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex justify-center gap-4 mb-8">
            <TimeBox val={timeLeft.hours} label="Horas" />
            <span className="text-2xl font-bold text-gray-600 mt-2">:</span>
            <TimeBox val={timeLeft.minutes} label="Minutos" />
            <span className="text-2xl font-bold text-gray-600 mt-2">:</span>
            <TimeBox val={timeLeft.seconds} label="Segundos" />
        </div>
    );
};

const TimeBox = ({ val, label }: { val: number, label: string }) => (
    <div className="text-center">
        <div className="bg-[#111] border border-gray-800 rounded-lg w-16 h-16 flex items-center justify-center mb-2 shadow-inner">
            <span className="text-2xl font-mono font-bold text-white">{val.toString().padStart(2, '0')}</span>
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
);

const AchievementRow = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <div className="flex items-center gap-3 text-gray-300">
        <Icon size={18} className="text-[#D4AF37]" /> {/* Gold icon like reference */}
        <span className="font-medium text-sm">{text}</span>
    </div>
);

const AdvancedCourseLP = () => {
    const modulesRef = useRef(null);
    const { scrollYProgress: modulesScrollY } = useScroll({
        target: modulesRef,
        offset: ["start end", "end start"]
    });
    const modulesY = useTransform(modulesScrollY, [0, 1], ["-20%", "20%"]);

    useEffect(() => {
        // Force init with multiple attempts to handle React hydration delays
        const attempts = [500, 1500, 3000, 5000];

        attempts.forEach(delay => {
            setTimeout(() => {
                // @ts-ignore
                if (window.Trustindex && window.Trustindex.init) {
                    console.log(`TrustIndex init attempt at ${delay}ms`);
                    // @ts-ignore
                    window.Trustindex.init();
                } else {
                    console.log(`TrustIndex not found at ${delay}ms`);
                }
            }, delay);
        });

        // Also try to append a fresh script if global one failed? 
        // No, let's stick to the global one first as it's cleaner.
    }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-gray-100 font-sans selection:bg-brand-red selection:text-white overflow-x-hidden">

            {/* 1. HERO SECTION */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
                {/* Backgrounds */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-1920-x-500-px-1920-x-900-px.png"
                        alt="Oficina Pro Riders"
                        className="w-full h-full object-cover hidden md:block"
                    />
                    <img
                        src="https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-1920-x-500-px-1920-x-900-px-Mobile-Video.png"
                        alt="Oficina Pro Riders Mobile"
                        className="w-full h-full object-cover md:hidden"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl text-left"
                    >
                        <img
                            src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png"
                            alt="Pro Riders"
                            className="h-16 md:h-20 mb-8 w-auto"
                        />

                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                            Curso de Revisão Avançada <span className="text-brand-red">BMW GS</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-300 mb-8 leading-relaxed font-light max-w-2xl border-l-4 border-brand-red pl-6">
                            Domine o passo a passo da revisão completa da sua BMW GS com o método usado na Pro Riders Oficina, 100% online, direto com o Fernando Macedo.
                        </p>

                        <div className="flex flex-col gap-3 mb-10 text-gray-400">
                            {[
                                "Evite surpresas na estrada entendendo sua moto.",
                                "Aplique o padrão de revisão de uma oficina referência.",
                                "Ganhe autonomia técnica real."
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-brand-red shrink-0" size={20} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <a href="#offer">
                                <ShinyButton className="w-full sm:w-auto text-lg px-10 py-4">
                                    Garantir minha vaga agora
                                </ShinyButton>
                            </a>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 ml-2">
                            Acesso vitalício • Certificado Pro Riders • 7 dias de garantia
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. VIDEO SECTION */}
            <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
                {/* Red Grid Background */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <GridVignetteBackground
                        className="opacity-80 [&]:bg-[image:linear-gradient(to_right,rgba(220,38,38,0.3),transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.3),transparent_1px)]"
                        size={60}
                        x={50}
                        y={50}
                        intensity={25} // Reduced further for subtler effect
                        horizontalVignetteSize={90}
                        verticalVignetteSize={90}
                    />
                    {/* Extra Glow Layer - Reduced Opacity */}
                    <div className="absolute inset-0 bg-brand-red/5 blur-[100px] mix-blend-screen pointer-events-none"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center mb-10">
                    <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-4 block">
                        Aprenda com o maior especialista do Brasil!
                    </span>
                    <div className="max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(217,35,35,0.2)] border border-white/10">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/rpj6UDexnIw"
                            title="Curso de Revisão Avançada Online"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* 3. AUDIENCE */}
            <section className="py-24 bg-[#050505] border-y border-gray-900/50">
                <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeUp}>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
                            Para quem é este curso
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            O Curso de Revisão Avançada BMW GS foi pensado para pilotos, mecânicos e consultores que querem dominar o padrão de revisão da GS.
                        </p>

                        <div className="space-y-8">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-brand-red font-bold uppercase tracking-widest text-sm mb-4">É para você que...</h3>
                                <ul className="space-y-3">
                                    {audience.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <div className="mt-1 w-1.5 h-1.5 bg-brand-red rounded-full shrink-0"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-brand-red font-bold uppercase tracking-widest text-sm mb-4">Depois do curso...</h3>
                                <ul className="space-y-3">
                                    {learningOutcomes.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <CheckCircle2 className="text-brand-red shrink-0 w-5 h-5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative group">
                            <img
                                src="https://proriders.com.br/wp-content/uploads/2025/09/BRV02657-scaled-1.jpg"
                                alt="Oficina BMW Pro Riders"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES CAROUSEL */}
            <section className="py-12 bg-[#050505] overflow-hidden border-b border-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Conteúdo Prático
                        </h2>
                        <p className="text-gray-400">
                            Veja o que preparamos para você
                        </p>
                    </div>

                    {/* Desktop: Grid / Mobile: Scroll -> NOW INFINITE MARQUEE */}
                    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
                        <Marquee pauseOnHover className="[--duration:20s]">
                            {[
                                { src: "https://proriders.com.br/wp-content/uploads/2025/09/modos.png", alt: "Modos de Condução" },
                                { src: "https://proriders.com.br/wp-content/uploads/2025/09/pastilha-traseira.png", alt: "Pastilha Traseira" },
                                { src: "https://proriders.com.br/wp-content/uploads/2025/09/dianteriro.png", alt: "Freio Dianteiro" },
                                { src: "https://proriders.com.br/wp-content/uploads/2025/09/ajustes-ergonomicos.png", alt: "Ajustes Ergonômicos" },
                                { src: "https://proriders.com.br/wp-content/uploads/2025/09/ferramentas.png", alt: "Ferramentas" }
                            ].map((img, i) => (
                                <div key={i} className="mx-4 min-w-[280px]">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:border-brand-red/50 transition-all duration-300 group">
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Marquee>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#050505] dark:from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#050505] dark:from-background"></div>
                    </div>
                </div>
            </section>

            {/* 4. INSIDE THE COURSE (MODULES) */}
            <section ref={modulesRef} className="py-24 bg-[#0a0a0a] relative overflow-hidden">
                <div className="absolute inset-0 z-0 h-[150%] -top-[25%]">
                    <motion.img
                        style={{ y: modulesY }}
                        src="/modules-bg.png"
                        alt="Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Como o curso funciona na prática
                        </h2>
                        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                            Nada de aula enrolada. Você assiste às aulas em uma plataforma moderna, com as revisões acontecendo de verdade na oficina Pro Riders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: Trophy,
                                title: "Protocolo Pro Riders",
                                text: "O mesmo protocolo técnico usado na Pro Riders Oficina para garantir uma revisão impecável e segura.",
                                originalValue: "297,00",
                            },
                            {
                                icon: Gift,
                                title: "Guia de Checklist GS",
                                text: "Passo a passo detalhado de conferência diagnóstica e preventiva para não deixar passar nenhum detalhe na moto.",
                                originalValue: "197,00",
                            },
                            {
                                icon: Calendar,
                                title: "Módulo de Ergonomia",
                                text: "Aprenda a configurar sua BMW GS para o seu biotipo, eliminando dores e fadiga em viagens longas.",
                                originalValue: "247,00",
                            },
                            {
                                icon: Award,
                                title: "Certificado de Domínio",
                                text: "Documento técnico que atesta seu conhecimento no método de manutenção referência da Pro Riders.",
                                originalValue: "147,00",
                            },
                            {
                                icon: Activity,
                                title: "Acesso Vitalício 24h",
                                text: "Consulte o curso direto do celular enquanto executa a manutenção na garagem ou oficina, para sempre.",
                                originalValue: "197,00",
                            },
                            {
                                icon: Star,
                                title: "VALOR TOTAL DOS BÔNUS",
                                text: "Você leva todos esses presentes de graça ao garantir sua vaga hoje.",
                                originalValue: "1.085,00",
                                isTotal: true
                            }
                        ].map((bonus, index) => (
                            <div key={index} className={`relative h-full rounded-[1.25rem] border-[0.75px] border-white/10 p-2 md:rounded-[1.5rem] md:p-3 min-h-[350px] ${bonus.isTotal ? 'col-span-1 md:col-span-2 lg:col-span-1 border-brand-red/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''}`}>
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={64}
                                    inactiveZone={0.01}
                                    borderWidth={3}
                                    variant={bonus.isTotal ? "white" : "default"}
                                />
                                <div className={`relative flex h-full flex-col items-center justify-between overflow-hidden rounded-xl border-[0.75px] border-white/10 bg-zinc-950 p-6 shadow-sm ${bonus.isTotal ? 'bg-gradient-to-b from-brand-red/10 to-black' : ''}`}>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col items-center text-center mt-4">
                                        <div className={`mb-4 p-3 rounded-full border border-white/10 ${bonus.isTotal ? 'bg-brand-red text-white shadow-[0_0_15px_#ef4444]' : 'bg-white/5'}`}>
                                            <bonus.icon size={32} className={bonus.isTotal ? "text-white" : "text-yellow-500"} />
                                        </div>
                                        <h3 className={`text-xl font-bold mb-2 uppercase tracking-wide ${bonus.isTotal ? 'text-brand-red text-2xl' : 'text-white'}`}>{bonus.title}</h3>
                                        <p className="text-sm text-gray-400 mb-4 leading-relaxed max-w-lg">{bonus.text}</p>
                                    </div>

                                    {/* Footer (Price) */}
                                    <div className="relative z-10 w-full pt-4 border-t border-white/10 mt-auto">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                            <span className="text-xs text-gray-400 font-medium opacity-80 uppercase tracking-wider">
                                                De R$ <span className="line-through">{bonus.originalValue}</span>
                                            </span>
                                            <span className={`font-black uppercase tracking-widest ${bonus.isTotal ? 'text-brand-red text-3xl drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]' : 'text-yellow-500 text-sm'}`}>
                                                POR R$ 0,00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <a href="#offer">
                            <ShinyButton className="w-full md:w-auto justify-center px-12 py-5 text-xl">Quero acesso imediato com bônus</ShinyButton>
                        </a>
                    </div>
                </div>
            </section>

            {/* 5. AUTHORITY - THIAGO BRAZ STYLE */}
            <section className="relative bg-[#050505] min-h-screen md:min-h-[800px] flex flex-col md:items-center">

                {/* Desktop Background & Overlays (Hidden on Mobile) */}
                <div className="absolute inset-0 z-0 hidden md:block">
                    <img
                        src="/bg-fernando.jpg"
                        alt="Fernando Macedo Background"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                </div>

                {/* Mobile "Poster" Header - Image + Name */}
                <div className="relative w-full h-[70vh] md:hidden">
                    <img
                        src="/mobile-authority.jpg"
                        alt="Fernando Macedo Mobile"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-6 right-6 z-20">
                        <span className="text-gray-300 tracking-[0.3em] text-xs font-bold uppercase block mb-2">
                            O Mentor
                        </span>
                        <h2 className="text-5xl font-black text-white leading-[0.9] tracking-tighter">
                            FERNANDO <br />
                            <span className="text-brand-red">MACEDO</span>
                        </h2>
                    </div>
                </div>

                <div className="container mx-auto px-6 py-12 md:py-0 md:px-4 grid lg:grid-cols-2 gap-0 items-center relative z-10 w-full">

                    {/* Left Column: Empty to keep layout on Desktop */}
                    <div className="hidden lg:block relative h-full"></div>

                    {/* Right Column: Content */}
                    <div className="relative z-20 w-full">
                        <div className="md:bg-[#0f0f0f]/80 md:backdrop-blur-xl md:border md:border-white/5 md:rounded-3xl md:p-12 md:shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                            {/* Desktop-only Header (Inside the card) */}
                            <div className="hidden md:block">
                                <span className="text-gray-400 tracking-[0.3em] text-xs font-bold uppercase block mb-4">
                                    O Mentor
                                </span>
                                <h2 className="text-6xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                                    FERNANDO <br />
                                    <span className="text-brand-red">MACEDO</span>
                                </h2>
                            </div>

                            {/* Red Accent Line on Right */}
                            <div className="absolute top-0 bottom-0 right-0 w-1 bg-brand-red rounded-l-full shadow-[0_0_15px_#D92323]"></div>

                            {/* Bio & Achievements: Visible on all devices, flowed below on mobile */}
                            <div className="space-y-6 text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
                                <p>
                                    Reconhecido como uma das maiores autoridades brasileiras em mecânica e diagnóstico de <strong className="text-white">motos BMW</strong>, especialmente da linha GS.
                                </p>
                                <p>
                                    Mas sua maior conquista não foi apenas o conhecimento técnico, foi a criação da <strong className="text-white">Pro Riders Oficina</strong>, onde aplica um método de revisão transparente e de elite.
                                </p>
                                <p>
                                    Hoje, como instrutor e especialista, Fernando usa o método Pro Riders para forjar mecânicos e proprietários autônomos que buscam a excelência.
                                </p>
                            </div>

                            {/* Achievements List */}
                            <div className="mt-10 space-y-4">
                                <AchievementRow icon={Wrench} text="Especialista em Motores Boxer" />
                                <AchievementRow icon={Award} text="Instrutor de +2.000 Alunos" />
                                <AchievementRow icon={CheckCircle2} text="Consultor Técnico Pro Riders" />
                                <AchievementRow icon={Star} text="Referência Nacional em BMW GS" />
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 text-center md:text-left">
                                <a href="#offer" className="inline-flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase hover:text-brand-red transition-colors group-hover:translate-x-1 duration-300">
                                    Conheça a História <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* SHADER DIVIDER - LOWERED HEIGHT */}
            <div className="relative h-48 w-full -my-12 z-20 pointer-events-none">
                <ShaderDivider />
            </div>

            {/* 6. SOCIAL PROOF */}
            <section className="relative z-10 bg-[#0a0a0a]">
                <StarsBackground className="py-24" starColor="#EF4444">
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">O que os pilotos dizem</h2>
                            <p className="text-gray-400">Avaliações reais de quem confiou sua BMW GS à Pro Riders.</p>
                        </div>

                        {/* Trustindex Google Reviews Widget (Converted to Custom Component for Reliability) */}
                        <div className="max-w-6xl mx-auto">
                            <CustomTrustIndexWidget />
                        </div>
                    </div>
                </StarsBackground>
            </section>

            {/* 7. OFFER SECTION */}
            <section id="offer" className="py-24 bg-[#050505] relative overflow-hidden">
                <AnimatedShaderBackground />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(217,35,35,0.15)] p-1 md:p-1 relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-red via-yellow-500 to-brand-red"></div>

                        <div className="bg-[#0a0a0a]/90 rounded-[22px] p-8 md:p-12 text-center">
                            <span className="text-[#D4AF37] font-bold tracking-[0.2em] uppercase text-xs block mb-4">Oferta Especial da Turma Atual</span>

                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Garanta Condições Especiais
                            </h2>

                            <div className="flex flex-col items-center justify-center mb-8">
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">De R$ 1.997,00 por</p>
                                <h3 className="text-5xl md:text-6xl font-black text-white mb-2">
                                    12x R$ 103,11
                                </h3>
                                <p className="text-brand-red font-bold text-lg">
                                    ou R$ 997,00 à vista no Pix/Cartão
                                </p>
                            </div>

                            <CountdownTimer />

                            <p className="text-gray-400 mb-10 text-lg max-w-xl mx-auto">
                                Enquanto esta página estiver no ar, você garante acesso imediato e vitalício com todos os bônus inclusos.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
                                <ul className="space-y-3">
                                    <li className="flex gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-brand-red w-5 h-5" /> Acesso Vitalício + Atualizações</li>
                                    <li className="flex gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-brand-red w-5 h-5" /> Certificado Digital Pro Riders</li>
                                </ul>
                                <ul className="space-y-3">
                                    <li className="flex gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-brand-red w-5 h-5" /> Conteúdo 100% em Vídeo</li>
                                    <li className="flex gap-2 text-gray-300 text-sm"><CheckCircle2 className="text-brand-red w-5 h-5" /> Pagamento em até 12x</li>
                                </ul>
                            </div>

                            <a href="https://pay.kiwify.com.br/V4jDEtG" target="_blank" rel="noopener noreferrer">
                                <ShinyButton className="w-full md:w-auto text-xl px-16 py-6 shadow-xl shadow-brand-red/20">
                                    QUERO MINHA VAGA COM ESSAS CONDIÇÕES
                                </ShinyButton>
                            </a>

                            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-gray-400" size={20} />
                                    <span className="text-gray-400 text-sm">Garantia Incondicional de 7 Dias</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-600 border border-[#0a0a0a]"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-500 border border-[#0a0a0a]"></div>
                                        <div className="w-6 h-6 rounded-full bg-gray-400 border border-[#0a0a0a]"></div>
                                    </div>
                                    <span className="text-gray-400 text-sm">Vagas sujeitas à disponibilidade</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
                {/* Red Grid Background (Subtle) */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <GridVignetteBackground
                        className="opacity-40 [&]:bg-[image:linear-gradient(to_right,rgba(220,38,38,0.2),transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.2),transparent_1px)]"
                        size={50}
                        x={50}
                        y={50}
                        intensity={60} // Higher intensity = more masking = subtler effect
                        horizontalVignetteSize={80}
                        verticalVignetteSize={80}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
                </div>

                <div className="container mx-auto px-4 max-w-3xl relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center tracking-tight">Dúvidas Frequentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group bg-white/5 rounded-xl border border-white/5 open:border-brand-red/30 transition-all duration-300">
                                <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-white">
                                    {faq.q}
                                    <ChevronDown className="text-brand-red transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-400 text-base leading-relaxed border-t border-white/5 pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* 9. FINAL CTA */}
            <section className="py-24 bg-[#050505] text-center border-t border-gray-900">
                <div className="container mx-auto px-4">
                    <img src="https://proriders.com.br/wp-content/uploads/2025/09/Logo-Pro-Riders.png" alt="Pro Riders" className="h-14 mx-auto mb-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Pronto para levar a revisão da sua BMW GS para outro nível?</h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        Entre para o Curso de Revisão Avançada BMW GS e tenha o método completo da Pro Riders na sua tela.
                    </p>
                    <div className="flex justify-center">
                        <a href="#offer">
                            <ShinyButton className="inline-block px-12">
                                Garantir Minha Vaga Agora
                            </ShinyButton>
                        </a>
                    </div>
                    <p className="text-sm text-gray-600 mt-6">Pro Riders Oficina © Todos os direitos reservados.</p>
                </div>
            </section>

        </div>
    );
};



export default AdvancedCourseLP;
