import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Users, 
    Clock, 
    MoreVertical,
    Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MOCK_COURSES = [
    { 
        id: '1', 
        name: 'Mecânica Básica BMW GS', 
        instructor: 'Fernando Pro Riders', 
        students: 12, 
        maxStudents: 15,
        price: 'R$ 1.200,00',
        status: 'Ativo',
        date: '15/02/2026'
    },
    { 
        id: '2', 
        name: 'Manutenção Preventiva Avançada', 
        instructor: 'Fernando Pro Riders', 
        students: 8, 
        maxStudents: 10,
        price: 'R$ 2.500,00',
        status: 'Inscrições Abertas',
        date: '20/03/2026'
    },
];

export default function CourseManagement() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">Gestão de Cursos</h1>
                    <p className="text-gray-500">Administre o catálogo de treinamentos, instrutores e turmas.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="size-4" /> Criar Novo Curso
                </Button>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 items-center bg-[#111] p-4 rounded-xl border border-white/5">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome, instrutor ou ID..." 
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-brand-red text-sm"
                    />
                </div>
                <Button variant="outline" className="gap-2 h-10">
                    Ativos
                </Button>
            </div>

            {/* Courses List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {MOCK_COURSES.map((course, i) => (
                    <motion.div 
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-brand-red/30 transition-all group"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                                        course.status === 'Ativo' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                    )}>
                                        {course.status}
                                    </span>
                                    <h3 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        Instrutor: <span className="text-gray-300 font-medium">{course.instructor}</span>
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="size-5 text-gray-600" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Users className="size-3" />
                                        <span className="text-[10px] font-bold uppercase">Alunos</span>
                                    </div>
                                    <p className="text-lg font-black text-white">{course.students}/{course.maxStudents}</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Clock className="size-3" />
                                        <span className="text-[10px] font-bold uppercase">Data Início</span>
                                    </div>
                                    <p className="text-lg font-black text-white">{course.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-xl font-black text-brand-red">{course.price}</span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="gap-2 text-gray-400">
                                        <Edit className="size-4" /> Editar
                                    </Button>
                                    <Button variant="outline" size="sm" className="gap-2 hover:bg-brand-red hover:text-white border-white/10">
                                        Ver Alunos
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
