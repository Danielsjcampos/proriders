import { motion } from 'framer-motion';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

import { useState, useEffect } from 'react';

export default function CourseCalendar() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('/api/courses');
                if (response.ok) {
                    const courses = await response.json();
                    // Flatten dates from all courses
                    const allDates = courses.flatMap((course: any) => 
                        course.dates.map((date: any) => ({
                            ...date,
                            courseName: course.name
                        }))
                    ).sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                    
                    setEvents(allDates);
                }
            } catch (error) {
                console.error('Error fetching calendar events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="size-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (events.length === 0) return (
        <div className="text-center p-12 bg-white/5 rounded-3xl border border-white/5">
            <p className="text-gray-500 font-bold uppercase tracking-widest">Nenhuma imersão agendada no momento.</p>
        </div>
    );
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event, i) => {
                const startDate = new Date(event.startDate);
                const day = startDate.getDate();
                const month = startDate.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
                
                return (
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
                                <p className="text-xl font-black text-brand-red uppercase">{day}</p>
                                <p className="text-[10px] font-bold text-brand-red uppercase tracking-widest leading-none">{month}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Investimento</p>
                                <p className="text-xl font-black text-white">R$ {Number(event.price).toLocaleString('pt-BR')}</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-red transition-colors">
                            {event.courseName}
                        </h3>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-gray-500">
                                <Clock className="size-4" />
                                <span className="text-sm font-medium">{event.timeStart} - {event.timeEnd}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <MapPin className="size-4" />
                                <span className="text-sm font-medium">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="size-4 text-brand-red" />
                                <span className="text-sm font-bold text-brand-red uppercase tracking-tighter">
                                    Vagas: {event.maxStudents - event.enrolledCount} restantes
                                </span>
                            </div>
                        </div>

                        <Link to={`/cursos/${event.slug}`}>
                            <Button className="w-full py-6 font-bold uppercase tracking-widest bg-white/5 hover:bg-brand-red hover:text-white border-white/10 group/btn">
                                Ver detalhes <ArrowRight className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
