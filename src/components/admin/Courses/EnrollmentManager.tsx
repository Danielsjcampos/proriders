import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Users, 
    X, 
    CreditCard, 
    CheckCircle2, 
    Send,
    ExternalLink,
    Search,
    UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddEnrollmentModal from './AddEnrollmentModal';

interface EnrollmentManagerProps {
    courseDateId: string;
    courseName: string;
    courseDate: string;
    coursePrice: number;
    onClose: () => void;
}

export default function EnrollmentManager({ courseDateId, courseName, courseDate, coursePrice, onClose }: EnrollmentManagerProps) {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);

    const fetchEnrollments = async () => {
        try {
            const response = await fetch('/api/admin/enrollments');
            if (response.ok) {
                const data = await response.json();
                // Filter by courseDateId for this view
                setEnrollments(data.filter((e: any) => e.courseDateId === courseDateId));
            }
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, [courseDateId]);

    const updateEnrollment = async (id: string, data: any) => {
        try {
            const response = await fetch(`/api/admin/enrollments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                fetchEnrollments();
            }
        } catch (error) {
            console.error('Error updating enrollment:', error);
        }
    };

    const generatePaymentLink = async (id: string) => {
        try {
            const response = await fetch('/api/enrollments/generate-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollmentId: id })
            });
            if (response.ok) {
                fetchEnrollments();
            }
        } catch (error) {
            console.error('Error generating link:', error);
        }
    };

    const filtered = enrollments.filter(e => 
        e.student.name.toLowerCase().includes(search.toLowerCase()) ||
        e.student.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-red/20 rounded-lg text-brand-red">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Gestão de Alunos - {courseName}</h2>
                            <p className="text-xs text-gray-500">{courseDate} • Controle de inscrições e pagamentos.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X size={20} />
                    </Button>
                </div>

                {/* Sub-header with Stats & Search */}
                <div className="p-6 border-b border-white/5 bg-black/40">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                            <input 
                                type="text"
                                placeholder="Buscar aluno..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-brand-red text-sm transition-all"
                            />
                        </div>
                        <div className="flex gap-4 shrink-0 items-center">
                            <div className="flex gap-2">
                                {[
                                    { label: 'Confirmados', val: enrollments.filter(e => e.paymentStatus === 'PAGO').length },
                                    { label: 'Pendentes', val: enrollments.filter(e => e.paymentStatus === 'PENDENTE').length }
                                ].map((s, i) => (
                                    <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg flex flex-col items-center min-w-[80px]">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{s.label}</span>
                                        <span className="text-sm font-bold text-white">{s.val}</span>
                                    </div>
                                ))}
                            </div>
                            <Button 
                                onClick={() => setShowAddStudentModal(true)}
                                className="gap-2 bg-brand-red hover:bg-brand-red/90 h-10 px-6 rounded-xl font-bold"
                            >
                                <UserPlus size={16} /> Adicionar Aluno
                            </Button>
                        </div>
                    </div>
                </div>

                {showAddStudentModal && (
                    <AddEnrollmentModal 
                        courseDateId={courseDateId}
                        courseName={courseName}
                        courseDate={courseDate}
                        coursePrice={coursePrice}
                        onClose={() => setShowAddStudentModal(false)}
                        onSave={fetchEnrollments}
                    />
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="size-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 opacity-50">Nenhum aluno encontrado.</div>
                    ) : (
                        filtered.map((enr) => (
                            <div key={enr.id} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl group hover:border-brand-red/20 transition-all">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex gap-4">
                                        <div className="size-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-brand-red">
                                            {enr.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{enr.student.name}</h4>
                                            <p className="text-xs text-gray-500">{enr.student.email}</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                    enr.paymentStatus === 'PAGO' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                                                )}>
                                                    {enr.paymentStatus}
                                                </span>
                                                {enr.paymentMethod && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                                        {enr.paymentMethod}
                                                    </span>
                                                )}
                                                {enr.attendance && (
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                                                        PRESENTE
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="mt-3 flex gap-4 text-[10px] font-bold">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 uppercase tracking-tighter">Valor Pago</span>
                                                    <span className="text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(enr.amountPaid) || 0)}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 uppercase tracking-tighter">Total</span>
                                                    <span className="text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(enr.totalAmount) || 0)}</span>
                                                </div>
                                                {(Number(enr.totalAmount) - Number(enr.amountPaid)) > 0 && (
                                                    <div className="flex flex-col">
                                                        <span className="text-brand-red uppercase tracking-tighter">Restante</span>
                                                        <span className="text-brand-red font-black">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(enr.totalAmount) - Number(enr.amountPaid))}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 items-center justify-end">
                                        {!enr.paymentLink && enr.paymentStatus === 'PENDENTE' && (
                                            <Button 
                                                size="xs" 
                                                onClick={() => generatePaymentLink(enr.id)}
                                                className="gap-1 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white"
                                            >
                                                <CreditCard size={12} /> Gerar Link
                                            </Button>
                                        )}
                                        {enr.paymentLink && (
                                            <a href={`/status/${enr.id}`} target="_blank" rel="noreferrer">
                                                <Button size="xs" variant="outline" className="gap-1 border-white/5 text-gray-400">
                                                    <ExternalLink size={12} /> Página Status
                                                </Button>
                                            </a>
                                        )}
                                        <Button 
                                            size="xs" 
                                            variant="outline"
                                            onClick={() => updateEnrollment(enr.id, { paymentStatus: enr.paymentStatus === 'PAGO' ? 'PENDENTE' : 'PAGO' })}
                                            className={cn(
                                                "gap-1 border-white/5",
                                                enr.paymentStatus === 'PAGO' ? "text-green-500" : "text-gray-400"
                                            )}
                                        >
                                            <CheckCircle2 size={12} /> {enr.paymentStatus === 'PAGO' ? 'Pago' : 'Marcar Pago'}
                                        </Button>
                                        <Button 
                                            size="xs" 
                                            variant="outline"
                                            className="border-white/5 text-gray-500"
                                        >
                                            <Send size={12} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
