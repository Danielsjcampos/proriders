import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';

const Hero = () => {
    return (
        <section id="hero" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://proriders.com.br/wp-content/uploads/2025/09/BRV02267-scaled.jpg"
                    alt="Oficina BMW GS"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 z-10 relative">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-4 block">
                            Especialista em BMW GS
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                            A Referência em Manutenção e Cursos para <span className="text-brand-red">BMW GS</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl">
                            Domine a mecânica da sua Big Trail ou deixe nas mãos de quem entende. Una a excelência de uma oficina especializada com o conhecimento de cursos práticos e diretos.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <a
                            href="https://wa.me/5519999999999"
                            className="bg-brand-red hover:bg-red-700 text-white px-8 py-4 rounded text-base font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
                        >
                            <MessageCircle size={20} />
                            Falar com a Pro Riders
                        </a>
                        <a
                            href="#courses"
                            className="border border-white text-white hover:bg-white hover:text-brand-dark px-8 py-4 rounded text-base font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                        >
                            Conhecer os Cursos
                            <ArrowRight size={20} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
