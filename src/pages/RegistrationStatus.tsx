import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    CheckCircle2, 
    Calendar, 
    MapPin, 
    CreditCard, 
    ArrowRight,
    QrCode,
    Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header-2';

export default function RegistrationStatus() {
    const { id } = useParams();
    const [enrollment, setEnrollment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const response = await fetch(`/api/enrollments/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEnrollment(data);
                }
            } catch (error) {
                console.error('Error fetching enrollment:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollment();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <div className="size-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!enrollment) return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-black text-white mb-4">Inscrição não encontrada</h1>
            <Link to="/">
                <Button variant="outline">Voltar para Home</Button>
            </Link>
        </div>
    );

    const { student, courseDate } = enrollment;
    const { course } = courseDate;

    return (
        <div className="bg-brand-dark min-h-screen text-gray-100 pb-20">
            <Header />
            
            <div className="container mx-auto px-4 pt-32 max-w-3xl">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl"
                >
                    {/* Status Header */}
                    <div className="p-8 md:p-12 text-center border-b border-white/5 bg-gradient-to-b from-brand-red/10 to-transparent">
                        <div className="size-20 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="size-10 text-brand-red" />
                        </div>
                        <h1 className="text-3xl font-black text-white uppercase italic mb-2">Inscrição Confirmada!</h1>
                        <p className="text-gray-400">Olá, <span className="text-white font-bold">{student.name}</span>. Sua vaga na imersão está garantida.</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-12">
                        {/* Course Info Card */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em]">Treinamento</h3>
                                <h2 className="text-2xl font-bold text-white leading-tight">{course.name}</h2>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Calendar className="size-4" />
                                        <span>{new Date(courseDate.startDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <MapPin className="size-4" />
                                        <span>{courseDate.location}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col justify-between">
                                <div>
                                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status de Pagamento</h3>
                                    <p className={`text-lg font-black ${enrollment.paymentStatus === 'PAGO' ? 'text-green-500' : 'text-brand-red'}`}>
                                        {enrollment.paymentStatus}
                                    </p>
                                </div>
                                
                                {enrollment.paymentStatus === 'PENDENTE' && enrollment.paymentLink && (
                                    <a href={enrollment.paymentLink} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full mt-4 bg-brand-red hover:bg-red-700 font-bold gap-2">
                                            Pagar Agora <CreditCard className="size-4" />
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest border-l-4 border-brand-red pl-4">Próximos Passos</h3>
                            <div className="grid gap-4">
                                {[
                                    { title: "Entre no Grupo de WhatsApp", desc: "Acesse o grupo exclusivo da sua turma para receber orientações.", icon: Send },
                                    { title: "Complete seu Perfil", desc: "Garanta que temos todos os dados para emissão do seu certificado.", icon: QrCode },
                                    { title: "Manual do Aluno", desc: "Baixe o guia de preparação para o dia da imersão.", icon: ArrowRight }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                        <div className="size-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-brand-red transition-colors">
                                            <step.icon className="size-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{step.title}</h4>
                                            <p className="text-xs text-gray-500">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <p className="mt-12 text-center text-gray-600 text-xs font-bold uppercase tracking-widest leading-loose">
                    Dúvidas? Entre em contato com nossa equipe técnica<br />
                    via WhatsApp ou E-mail.
                </p>
            </div>
        </div>
    );
}
