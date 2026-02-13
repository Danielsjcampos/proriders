import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Users, 
    Edit,
    Calendar,
    MapPin,
    Trash2,
    ExternalLink,
    Filter,
    UserPlus,
    Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseDateModal from './CourseDateModal';
import EnrollmentManager from './EnrollmentManager';
import AddEnrollmentModal from './AddEnrollmentModal';
import CourseTemplateModal from './CourseTemplateModal';

export default function CourseManagement() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'turmas' | 'modelos'>('turmas');
    
    // Modal states
    const [showDateModal, setShowDateModal] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [duplicateData, setDuplicateData] = useState<any>(null);
    const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
    const [selectedDateInfo, setSelectedDateInfo] = useState<{name: string, date: string, price: number} | null>(null);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Flatten all dates across all courses
    const allDates = useMemo(() => {
        const dates: any[] = [];
        courses.forEach(course => {
            if (course.dates) {
                course.dates.forEach((date: any) => {
                    dates.push({
                        ...date,
                        courseName: course.name,
                        courseSlug: course.slug
                    });
                });
            }
        });
        // Sort by date soonest first
        return dates.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    }, [courses]);

    const filteredDates = allDates.filter(date => 
        date.courseName.toLowerCase().includes(search.toLowerCase()) ||
        date.location.toLowerCase().includes(search.toLowerCase()) ||
        date.slug.toLowerCase().includes(search.toLowerCase())
    );

    const deleteCourseDate = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta data? Isso removerá as inscrições e leads associados.')) return;
        try {
            const response = await fetch(`/api/course-dates/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Error deleting course date:', error);
        }
    };

    const deleteCourse = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este modelo de curso? Isso removerá todas as datas e inscrições associadas.')) return;
        try {
            const response = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchCourses();
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };
    
    const handleDuplicate = (date: any) => {
         // We pass the full object, the modal handles stripping ID/Slug logic via initialData prop
         setDuplicateData(date);
         setSelectedCourseId(date.courseId);
         setSelectedDate(null); // Ensure not editing mode
         setShowDateModal(true);
    };

    const handleOpenAddStudent = (date: any) => {
        setSelectedDateId(date.id);
        setSelectedDateInfo({
            name: date.courseName,
            date: new Date(date.startDate).toLocaleDateString('pt-BR'),
            price: date.price
        });
        setShowAddStudentModal(true);
    };

    const handleOpenEnrollments = (date: any) => {
        setSelectedDateId(date.id);
        setSelectedDateInfo({
            name: date.courseName,
            date: new Date(date.startDate).toLocaleDateString('pt-BR'),
            price: date.price
        });
        setShowEnrollmentModal(true);
    };

    const handleDuplicateTemplate = (course: any) => {
        setDuplicateData(course);
        setSelectedCourse(null);
        setShowTemplateModal(true);
    };

    return (
        <div className="space-y-8">
            {/* Modals */}
            {showTemplateModal && (
                <CourseTemplateModal 
                    existingCourse={selectedCourse}
                    initialData={duplicateData}
                    onClose={() => {
                        setShowTemplateModal(false);
                        setSelectedCourse(null);
                        setDuplicateData(null);
                    }}
                    onSave={() => {
                        fetchCourses();
                        setDuplicateData(null);
                    }}
                />
            )}

            {showDateModal && selectedCourseId && (
                <CourseDateModal 
                    courseId={selectedCourseId}
                    existingDate={selectedDate}
                    initialData={duplicateData}
                    onClose={() => {
                        setShowDateModal(false);
                        setSelectedDate(null);
                        setDuplicateData(null);
                    }}
                    onSave={() => {
                        fetchCourses();
                        setDuplicateData(null);
                    }}
                />
            )}
            
            {showEnrollmentModal && selectedDateId && selectedDateInfo && (
                <EnrollmentManager 
                    courseDateId={selectedDateId}
                    courseName={selectedDateInfo.name}
                    courseDate={selectedDateInfo.date}
                    coursePrice={selectedDateInfo.price}
                    onClose={() => setShowEnrollmentModal(false)}
                />
            )}

            {showAddStudentModal && selectedDateId && selectedDateInfo && (
                <AddEnrollmentModal 
                    courseDateId={selectedDateId}
                    courseName={selectedDateInfo.name}
                    courseDate={selectedDateInfo.date}
                    coursePrice={selectedDateInfo.price}
                    onClose={() => setShowAddStudentModal(false)}
                    onSave={fetchCourses}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">
                        {viewMode === 'turmas' ? 'Gestão de Turmas' : 'Modelos de Cursos'}
                    </h1>
                    <p className="text-gray-500">
                        {viewMode === 'turmas' 
                            ? 'Administre o calendário de cursos e inscrições de alunos.' 
                            : 'Gerencie os templates e conteúdos base dos seus treinamentos.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setViewMode(viewMode === 'turmas' ? 'modelos' : 'turmas')}
                        className="border-white/10 text-xs"
                    >
                        {viewMode === 'turmas' ? 'Ver Modelos' : 'Ver Calendário'}
                    </Button>
                    <Button 
                        onClick={() => {
                            if (viewMode === 'turmas') {
                                // If in turmas view, we need to select a course template first or provide a generic way.
                                // For now, let's open a date modal if we have a courseId or show an alert.
                                if (courses.length > 0) {
                                    setSelectedCourseId(courses[0].id);
                                    setShowDateModal(true);
                                } else {
                                    setShowTemplateModal(true);
                                }
                            } else {
                                setShowTemplateModal(true);
                            }
                        }}
                        className="gap-2 bg-brand-red hover:bg-brand-red/90"
                    >
                        <Plus className="size-4" /> {viewMode === 'turmas' ? 'Novo Agendamento' : 'Novo Modelo'}
                    </Button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 items-center bg-[#111] p-4 rounded-xl border border-white/5">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                    <input 
                        type="text" 
                        placeholder="Buscar por curso, local ou slug..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-brand-red text-sm"
                    />
                </div>
                <Button variant="outline" className="gap-2 h-10 border-white/10">
                    <Filter className="size-4" /> Filtros
                </Button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="size-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
                </div>
            ) : viewMode === 'turmas' ? (
                <div className="grid grid-cols-1 gap-4">
                    {filteredDates.length === 0 ? (
                        <div className="text-center py-20 bg-[#0f0f0f] rounded-2xl border border-white/5">
                            <p className="text-gray-500 italic">Nenhuma turma encontrada.</p>
                        </div>
                    ) : (
                        filteredDates.map((date, i) => (
                            <motion.div 
                                key={date.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden group hover:border-brand-red/30 transition-all"
                            >
                                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex gap-4 items-center flex-1">
                                        <div className="size-12 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                            <span className="text-[10px] font-black text-brand-red uppercase">
                                                {new Date(date.startDate).toLocaleDateString('pt-BR', { month: 'short' })}
                                            </span>
                                            <span className="text-lg font-bold text-white">
                                                {new Date(date.startDate).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg group-hover:text-brand-red transition-colors">
                                                    {date.courseName}
                                                </h3>
                                                <span className="text-[10px] bg-brand-red/10 text-brand-red px-2 py-0.5 rounded border border-brand-red/20 font-black">
                                                    {date.enrolledCount}/{date.maxStudents}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} className="text-gray-600" /> {date.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} className="text-gray-600" /> {date.timeStart}h - {date.timeEnd}h
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-4 hidden sm:block">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Valor</p>
                                            <p className="text-lg font-black text-brand-red">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(date.price)}
                                            </p>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="gap-2 h-9 border-brand-red/30 text-brand-red hover:bg-brand-red hover:text-white transition-all text-xs font-bold"
                                                onClick={() => handleOpenAddStudent(date)}
                                            >
                                                <UserPlus size={14} /> <span className="hidden lg:inline">Novo Aluno</span>
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="gap-2 h-9 border-white/5 text-gray-400 hover:text-white transition-all text-xs"
                                                onClick={() => handleOpenEnrollments(date)}
                                            >
                                                <Users size={14} /> <span className="hidden lg:inline">Alunos</span>
                                            </Button>
                                            <div className="flex gap-1 border-l border-white/5 pl-2 ml-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 text-gray-600 hover:text-white"
                                                    onClick={() => {
                                                        setSelectedCourseId(date.courseId);
                                                        setSelectedDate(date);
                                                        setDuplicateData(null);
                                                        setShowDateModal(true);
                                                    }}
                                                >
                                                    <Edit size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 text-gray-600 hover:text-white"
                                                    onClick={() => handleDuplicate(date)}
                                                    title="Duplicar Turma"
                                                >
                                                    <Copy size={16} />
                                                </Button>
                                                <a href={`/cursos/${date.slug}`} target="_blank" rel="noreferrer">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:text-white">
                                                        <ExternalLink size={16} />
                                                    </Button>
                                                </a>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-9 w-9 text-gray-800 hover:text-red-500"
                                                    onClick={() => deleteCourseDate(date.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((course) => (
                        <div key={course.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-brand-red/30 transition-all">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors">{course.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-brand-red font-black uppercase tracking-tighter bg-brand-red/10 px-2 py-0.5 rounded border border-brand-red/20">
                                        {course.type}
                                    </span>
                                    <p className="text-xs text-gray-500">{course.dates?.length || 0} turmas agendadas</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-brand-red/30 text-brand-red hover:bg-brand-red text-[10px] h-8" onClick={() => {
                                    setSelectedCourseId(course.id);
                                    setSelectedDate(null);
                                    setShowDateModal(true);
                                }}>
                                    Agendar Data
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-500 h-8 w-8 p-0" onClick={() => {
                                    setSelectedCourse(course);
                                    setDuplicateData(null);
                                    setShowTemplateModal(true);
                                }}>
                                    <Edit size={16} />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-500 h-8 w-8 p-0" onClick={() => handleDuplicateTemplate(course)} title="Duplicar Modelo">
                                    <Copy size={16} />
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="text-gray-800 hover:text-red-500 h-8 w-8 p-0"
                                    onClick={() => deleteCourse(course.id)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
