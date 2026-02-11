import { Star, CheckCircle2 } from 'lucide-react';

const reviews = [
    {
        name: "Carlos Eduardo",
        date: "2 semanas atrás",
        rating: 5,
        text: "O curso do Fernando é sensacional! A didática é incrível e o passo a passo da revisão da GS me deu total confiança para mexer na minha moto. Economizei uma grana e ainda aprendi muito.",
        initial: "CE"
    },
    {
        name: "Roberto Almeida",
        date: "1 mês atrás",
        rating: 5,
        text: "Sempre tive receio de levar minha moto em oficinas que não conhecem BMW a fundo. Com o curso, agora eu mesmo faço o básico e sei cobrar o serviço correto quando preciso. Recomendo demais!",
        initial: "RA"
    },
    {
        name: "Marcelo Souza",
        date: "3 semanas atrás",
        rating: 5,
        text: "Conteúdo técnico de primeira. O módulo de diagnóstico eletrônico valeu cada centavo. O suporte da equipe Pro Riders também é excelente.",
        initial: "MS"
    },
    {
        name: "André Lima",
        date: "2 meses atrás",
        rating: 5,
        text: "Já fiz vários cursos de mecânica, mas esse focado na GS é imbatível. Detalhes que só quem vive a oficina dia a dia conhece. Parabéns pelo trabalho!",
        initial: "AL"
    },
    {
        name: "Ricardo Mendes",
        date: "1 mês atrás",
        rating: 5,
        text: "A plataforma é muito fácil de usar e os vídeos têm uma qualidade absurda. Dá pra ver cada parafuso sendo ajustado. Nota 10!",
        initial: "RM"
    },
    {
        name: "Felipe Costa",
        date: "3 semanas atrás",
        rating: 5,
        text: "Investimento que se paga na primeira revisão. A clareza com que o Fernando explica os sistemas complexos da BMW é impressionante.",
        initial: "FC"
    }
];

const CustomTrustIndexWidget = () => {
    return (
        <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#f8f9fa] border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src="https://cdn.trustindex.io/assets/platform/Google/logo.svg" alt="Google" className="h-6 w-6" />
                    <span className="font-bold text-gray-700">Avaliações</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-800">5.0</span>
                    <div className="flex text-[#ffb400]">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" stroke="none" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                                    {review.initial}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800 text-sm">{review.name}</div>
                                    <div className="text-xs text-gray-500">{review.date}</div>
                                </div>
                            </div>
                            <img src="https://cdn.trustindex.io/assets/platform/Google/icon.svg" alt="Google" className="w-5 h-5 opacity-50" />
                        </div>
                        <div className="flex text-[#ffb400] mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} fill="currentColor" stroke="none" />
                            ))}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                            {review.text}
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="bg-[#f8f9fa] border-t border-gray-200 p-3 text-center">
                <a
                    href="https://www.google.com/search?q=pro+riders+oficina"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                    Ver todas as avaliações no Google <CheckCircle2 size={14} />
                </a>
            </div>
        </div>
    );
};

export default CustomTrustIndexWidget;
