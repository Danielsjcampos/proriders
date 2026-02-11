import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: string[];
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Qual o seu nível de experiência com mecânica?",
        options: ["Nenhum (Quero começar do zero)", "Básico (Troco óleo/filtros)", "Intermediário (Faço manutenções leves)", "Avançado (Já trabalho na área)"]
    },
    {
        id: 2,
        text: "Qual o seu principal objetivo com o curso?",
        options: ["Cuidar da minha própria moto", "Abrir meu próprio negócio", "Trabalhar em uma oficina especializada", "Lazer / Hobby"]
    },
    {
        id: 3,
        text: "Quanto tempo você tem disponível para estudar por semana?",
        options: ["Menos de 2 horas", "2 a 5 horas", "5 a 10 horas", "Mais de 10 horas (Dedicação total)"]
    }
];

interface CourseQuizProps {
    onComplete: (answers: string[]) => void;
}

export default function CourseQuiz({ onComplete }: CourseQuizProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);

    const handleAnswer = (answer: string) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="mb-8 flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">Fase de Qualificação</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Passo {currentStep + 1} de {QUESTIONS.length}</span>
            </div>

            <div className="h-1 bg-white/5 rounded-full mb-12 overflow-hidden">
                <motion.div 
                    className="h-full bg-brand-red"
                    animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-8 leading-tight">
                        {QUESTIONS[currentStep].text}
                    </h2>

                    <div className="space-y-3">
                        {QUESTIONS[currentStep].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-brand-red/10 hover:border-brand-red/30 transition-all group flex justify-between items-center"
                            >
                                <span className="text-gray-300 font-medium group-hover:text-white">{option}</span>
                                <ArrowRight className="size-4 text-gray-700 group-hover:text-brand-red transition-colors" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
