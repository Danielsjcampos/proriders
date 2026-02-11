import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const COLUMNS = [
    { id: 'NOVO_LEAD', title: 'Novo Lead', color: 'bg-blue-500' },
    { id: 'CONTATO_INICIADO', title: 'Contato Iniciado', color: 'bg-purple-500' },
    { id: 'QUALIFICADO', title: 'Qualificado', color: 'bg-yellow-500' },
    { id: 'PROPOSTA_ENVIADA', title: 'Proposta Enviada', color: 'bg-orange-500' },
    { id: 'NEGOCIACAO', title: 'Negociação', color: 'bg-brand-red' },
];

const MOCK_LEADS: Record<string, any[]> = {
    'NOVO_LEAD': [
        { id: '1', name: 'Ricardo Santos', interest: 'Curso Mecânica', origin: 'Site' },
        { id: '2', name: 'Juliana Lima', interest: 'Manutenção R1250', origin: 'WhatsApp' },
    ],
    'CONTATO_INICIADO': [
        { id: '3', name: 'Marcos Oliveira', interest: 'Curso Avançado', origin: 'Instagram' },
    ],
    'QUALIFICADO': [],
    'PROPOSTA_ENVIADA': [
        { id: '4', name: 'André Souza', interest: 'Revisão Geral', origin: 'Indicação' },
    ],
    'NEGOCIACAO': [],
};

export default function KanbanBoard() {
    const [leads, setLeads] = React.useState(MOCK_LEADS);

    const onDragEnd = (result: any) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId) {
            const column = [...leads[source.droppableId]];
            const [removed] = column.splice(source.index, 1);
            column.splice(destination.index, 0, removed);
            setLeads({ ...leads, [source.droppableId]: column });
        } else {
            const sourceColumn = [...leads[source.droppableId]];
            const destColumn = [...leads[destination.droppableId]];
            const [removed] = sourceColumn.splice(source.index, 1);
            destColumn.splice(destination.index, 0, removed);
            setLeads({
                ...leads,
                [source.droppableId]: sourceColumn,
                [destination.droppableId]: destColumn,
            });
            // TODO: Update status in DB
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Kanban Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">Pipeline de Leads</h1>
                    <p className="text-gray-500">Gerencie o funil de vendas e conversões da Pro Riders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-4" /> Filtros
                    </Button>
                    <Button size="sm" className="gap-2">
                        <Plus className="size-4" /> Novo Lead
                    </Button>
                </div>
            </div>

            {/* Kanban Body */}
            <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-max">
                        {COLUMNS.map((column) => (
                            <div key={column.id} className="w-72 flex flex-col gap-4">
                                {/* Column Header */}
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("size-2 rounded-full", column.color)} />
                                        <h3 className="font-bold uppercase tracking-widest text-xs text-gray-300">
                                            {column.title}
                                        </h3>
                                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-bold">
                                            {leads[column.id]?.length || 0}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <MoreHorizontal className="size-4 text-gray-600" />
                                    </Button>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={cn(
                                                "flex-1 rounded-xl p-2 transition-colors flex flex-col gap-3 min-h-[500px]",
                                                snapshot.isDraggingOver ? "bg-white/[0.02]" : "bg-transparent"
                                            )}
                                        >
                                            {leads[column.id]?.map((lead, index) => (
                                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={provided.draggableProps.style}
                                                            className={cn(
                                                                "bg-[#111] border border-white/5 p-4 rounded-xl shadow-lg hover:border-brand-red/30 transition-all",
                                                                snapshot.isDragging && "rotate-2 border-brand-red shadow-brand-red/20"
                                                            )}
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <span className="text-[10px] uppercase font-bold tracking-tighter text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
                                                                    {lead.origin}
                                                                </span>
                                                                <span className="text-[10px] text-gray-600 font-medium">#{lead.id}</span>
                                                            </div>
                                                            <h4 className="font-bold text-white mb-1">{lead.name}</h4>
                                                            <p className="text-xs text-gray-500 mb-4">{lead.interest}</p>
                                                            
                                                            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                                                <div className="flex -space-x-2">
                                                                    <div className="size-6 rounded-full bg-gray-800 border-2 border-[#111] flex items-center justify-center text-[10px] font-bold">FS</div>
                                                                </div>
                                                                <div className="text-[10px] text-gray-700 font-bold uppercase">Hoje</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                            
                                            <Button 
                                                variant="ghost" 
                                                className="w-full border border-dashed border-white/5 text-gray-600 hover:text-brand-red hover:bg-brand-red/5 hover:border-brand-red/20 py-8"
                                            >
                                                <Plus className="size-4 mr-2" /> Adicionar Lead
                                            </Button>
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
