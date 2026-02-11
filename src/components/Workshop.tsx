import { motion } from 'framer-motion';
import { ShieldCheck, Search, PenTool, CheckCircle } from 'lucide-react';
import LeadForm from './LeadForm';

const Workshop = () => {
    return (
        <section id="workshop" className="py-20 bg-brand-dark relative">
            <div className="container mx-auto px-4">

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Oficina Especializada <span className="text-brand-red">BMW GS</span> em Campinas
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            Esqueça a dúvida sobre o que foi feito na sua moto. Na Oficina Pro Riders, aliamos ferramentas de ponta e produtos de primeira linha (Liqui Moly) a um atendimento que joga limpo com você.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            <ServiceItem
                                icon={<ShieldCheck className="text-brand-red" size={28} />}
                                title="Transparência Absoluta"
                                desc="Enviamos vídeos e fotos durante o serviço para você acompanhar tudo."
                            />
                            <ServiceItem
                                icon={<Search className="text-brand-red" size={28} />}
                                title="Diagnóstico Preciso"
                                desc="Tecnologia e expertise para resolver o problema na raiz."
                            />
                            <ServiceItem
                                icon={<PenTool className="text-brand-red" size={28} />}
                                title="Especialização Focada"
                                desc="Não somos genéricos; respiramos BMW GS."
                            />
                            <ServiceItem
                                icon={<CheckCircle className="text-brand-red" size={28} />}
                                title="Produtos Oficiais"
                                desc="Garantia de qualidade em fluidos e peças."
                            />
                        </div>

                        <div className="bg-white/5 border border-white/5 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Solicitar Agendamento</h3>
                            <LeadForm interest="Oficina" origin="Seção Workshop Site" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        {/* Using a placeholder mechanic image */}
                        <img
                            src="https://proriders.com.br/wp-content/uploads/2025/09/O-PLANO-DEFINITIVO-1920-x-900-px-Instagram-Post-45-5.png"
                            alt="Oficina Pro Riders Campinas"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const ServiceItem = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
            {icon}
            <h4 className="font-bold text-white text-lg">{title}</h4>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-gray-800 pl-4">
            {desc}
        </p>
    </div>
);

export default Workshop;
