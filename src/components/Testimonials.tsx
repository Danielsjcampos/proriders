import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Lucas Beltrão",
            rating: 5,
            text: "O Fernando demonstrou profissionalismo e comprometimento: sempre respondeu mensagens, enviou vídeos mostrando o andamento e se manteve presente. É raro encontrar esse nível de transparência.",
            date: "há um mês"
        },
        {
            name: "Eduardo Augusto Silva",
            rating: 5,
            text: "Fez um trabalho excepcional na minha BMW GS 1200. Ficaria 4 vezes mais caro na concessionária, além de ter todo o trabalho em me ensinar as funções da moto e ajustes.",
            date: "há 2 meses"
        },
        {
            name: "Luiz Mello",
            rating: 5,
            text: "Empresa de alta qualidade. O Fernando realiza curso especialista BMW de primeira linha. Muito conhecimento, habilidade e transparência. Espetacular a dinâmica das aulas.",
            date: "há 3 semanas"
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        O que dizem os pilotos
                    </h2>

                    {/* Google Badge Simulation */}
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                            alt="Google"
                            className="h-5"
                        />
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-800">5.0</span>
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                        </div>
                        <span className="text-gray-500 text-sm border-l pl-2 ml-1">Baseado em 128 avaliações</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testi, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-brand-dark p-8 rounded-xl border border-gray-800 relative hover:border-gray-600 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                                        {testi.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{testi.name}</h4>
                                        <span className="text-xs text-gray-500">{testi.date}</span>
                                    </div>
                                </div>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                                    alt="Google"
                                    className="w-5 h-5 opacity-50"
                                />
                            </div>

                            <div className="flex gap-1 mb-4 text-yellow-500">
                                {[...Array(testi.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed">
                                {testi.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
