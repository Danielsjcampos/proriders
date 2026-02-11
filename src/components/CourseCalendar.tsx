import { motion } from 'framer-motion';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const UPCOMING_EVENTS = [
    {
        id: '1',
        name: 'Mecânica Básica BMW GS',
        slug: 'mecanica-basica-bmw-gs',
        date: '15 Fev',
        time: '08:00 - 18:00',
        location: 'São Paulo, SP',
        spots: 3,
        price: 'R$ 1.200'
    },
    {
        id: '2',
        name: 'Manutenção Avançada Boxer',
        slug: 'manutencao-avancada-boxer',
        date: '20 Mar',
        time: '09:00 - 17:00',
        location: 'São Paulo, SP',
        spots: 5,
        price: 'R$ 2.500'
    }
];

export default function CourseCalendar() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {UPCOMING_EVENTS.map((event, i) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-brand-red/30 transition-all group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-brand-red/10 border border-brand-red/20 rounded-2xl p-3 text-center min-w-[70px]">
                            <p className="text-xl font-black text-brand-red uppercase">{event.date.split(' ')[0]}</p>
                            <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest leading-none">{event.date.split(' ')[1]}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Investimento</p>
                            <p className="text-xl font-black text-white">{event.price}</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-red transition-colors">
                        {event.name}
                    </h3>

                    <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Clock className="size-4" />
                            <span className="text-sm font-medium">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-500">
                            <MapPin className="size-4" />
                            <span className="text-sm font-medium">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="size-4 text-brand-red" />
                            <span className="text-sm font-bold text-brand-red uppercase tracking-tighter">Últimas {event.spots} vagas</span>
                        </div>
                    </div>

                    <Link to={`/cursos/${event.slug}`}>
                        <Button className="w-full py-6 font-bold uppercase tracking-widest bg-white/5 hover:bg-brand-red hover:text-white border-white/10 group/btn">
                            Ver detalhes <ArrowRight className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
