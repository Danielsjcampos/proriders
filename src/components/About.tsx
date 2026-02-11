import { motion } from 'framer-motion';
import { CheckCircle2, Wrench, Award, Users } from 'lucide-react';

const About = () => {
    const credentials = [
        { icon: <Wrench className="text-brand-red" size={24} />, text: "Especialista em motores BMW GS" },
        { icon: <CheckCircle2 className="text-brand-red" size={24} />, text: "Vivência real em oficina e expedições" },
        { icon: <Users className="text-brand-red" size={24} />, text: "Mentor de centenas de alunos" },
        { icon: <Award className="text-brand-red" size={24} />, text: "Parceiro Oficial Liqui Moly" },
    ];

    return (
        <section id="about" className="py-20 bg-brand-dark overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                            <img
                                src="https://proriders.com.br/wp-content/uploads/2025/09/fernsndo.png"
                                alt="Fernando Pro Riders"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-brand-red p-6 rounded-lg shadow-xl hidden md:block">
                            <p className="text-4xl font-bold text-white">10+</p>
                            <p className="text-white/90 text-sm font-medium uppercase">Anos de<br />Experiência</p>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                            Quem é o <span className="text-brand-red">Fernando Pro Riders?</span>
                        </h2>
                        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                            Apaixonado por duas rodas e especialista em motores BMW GS, o Fernando transformou anos de experiência em oficina em uma missão: elevar o padrão de manutenção de Big Trails no Brasil.
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Na Pro Riders, ele une o conhecimento técnico avançado — reconhecido por marcas como Liqui Moly — com uma didática simples e direta. Seja cuidando da sua moto ou ensinando você a cuidar dela, o objetivo é um só: garantir sua segurança e a performance da sua máquina em qualquer estrada.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {credentials.map((cred, index) => (
                                <div key={index} className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg border border-gray-800">
                                    {cred.icon}
                                    <span className="text-sm font-medium text-gray-200">{cred.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default About;
