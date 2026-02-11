import { motion } from 'framer-motion';

const OnlineCourseCTA = () => {
    return (
        <section className="py-20 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                    {/* Responsive Background Images */}
                    <div className="absolute inset-0 z-0">
                        {/* Mobile Image */}
                        <img
                            src="https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-1920-x-500-px-1920-x-900-px-Mobile-Video.png"
                            alt="Curso Online Pro Riders"
                            className="w-full h-full object-cover md:hidden opacity-50"
                        />
                        {/* Desktop Image */}
                        <img
                            src="https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-1920-x-500-px-1920-x-900-px.png"
                            alt="Curso Online Pro Riders"
                            className="w-full h-full object-cover hidden md:block"
                        />
                        {/* Gradient Overlay for Desktop to ensure text readability if needed */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none md:via-black/20"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-16 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                                Descubra o Curso Online de <br />
                                <span className="text-white">Revisão </span>
                                <span className="text-[#3b82f6]">Avançada BMW GS</span>
                            </h2>

                            <div className="space-y-4 text-gray-200 text-lg mb-8 leading-relaxed">
                                <p>
                                    Aprenda direto com o <strong>Fernando da Pro Riders</strong>, especialista em motores BMW GS.
                                </p>
                                <p>
                                    No curso online você terá acesso a técnicas de revisão avançada, conteúdos aplicados na prática da oficina e um método claro para elevar seu nível de conhecimento.
                                </p>
                                <p>
                                    Estude <strong>quando e onde quiser</strong>, com acesso vitalício e certificado exclusivo Pro Riders.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="https://proriders.com.br/curso-de-revisao-avancada/"
                                    className="bg-[#8B0000] hover:bg-red-900 text-white px-8 py-3 rounded-md font-bold text-center transition-colors shadow-lg"
                                >
                                    Quero Garantir Meu Acesso
                                </a>
                                <a
                                    href="#courses"
                                    className="bg-white hover:bg-gray-100 text-brand-dark px-8 py-3 rounded-md font-bold text-center transition-colors shadow-lg"
                                >
                                    Saiba Mais
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OnlineCourseCTA;
