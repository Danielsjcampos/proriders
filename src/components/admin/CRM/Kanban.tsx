import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus, Filter, Search, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LeadDetailsModal from './LeadDetailsModal';
import { AnimatePresence } from 'framer-motion';

const COLUMNS = [
    { id: 'NOVO_LEAD', title: 'Novo Lead', color: 'bg-blue-500' },
    { id: 'CONTATO_INICIADO', title: 'Contato Iniciado', color: 'bg-purple-500' },
    { id: 'QUALIFICADO', title: 'Qualificado', color: 'bg-yellow-500' },
    { id: 'PROPOSTA_ENVIADA', title: 'Proposta Enviada', color: 'bg-orange-500' },
    { id: 'NEGOCIACAO', title: 'Negociação', color: 'bg-brand-red' },
];

export default function KanbanBoard() {
    const [leads, setLeads] = useState<Record<string, any[]>>({
        'NOVO_LEAD': [],
        'CONTATO_INICIADO': [],
        'QUALIFICADO': [],
        'PROPOSTA_ENVIADA': [],
        'NEGOCIACAO': [],
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchLeads = async () => {
        try {
            const response = await fetch('/api/leads');
            if (response.ok) {
                const data = await response.json();
                
                // Group leads by status
                const grouped: Record<string, any[]> = {
                    'NOVO_LEAD': [],
                    'CONTATO_INICIADO': [],
                    'QUALIFICADO': [],
                    'PROPOSTA_ENVIADA': [],
                    'NEGOCIACAO': [],
                };
                
                data.forEach((lead: any) => {
                    if (grouped[lead.status]) {
                        grouped[lead.status].push(lead);
                    } else {
                        grouped['NOVO_LEAD'].push(lead);
                    }
                });
                
                setLeads(grouped);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const onDragEnd = async (result: any) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Optimistic UI update
        const sourceColumn = [...leads[source.droppableId]];
        const destColumn = source.droppableId === destination.droppableId ? sourceColumn : [...leads[destination.droppableId]];
        
        const [movedLead] = sourceColumn.splice(source.index, 1);
        movedLead.status = destination.droppableId; // Update local status
        destColumn.splice(destination.index, 0, movedLead);

        const newLeads = {
            ...leads,
            [source.droppableId]: sourceColumn,
            [destination.droppableId]: destColumn,
        };
        
        setLeads(newLeads);

        // API Call
        try {
            // Need a patch route for leads in server.ts
            await fetch(`/api/leads/${draggableId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: destination.droppableId })
            });
        } catch (error) {
            console.error('Error updating lead status:', error);
            fetchLeads(); // Rollback on error
        }
    };

    const handleOpenDetails = (lead: any) => {
        setSelectedLead(lead);
        setShowDetailsModal(true);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <AnimatePresence>
                {showDetailsModal && selectedLead && (
                    <LeadDetailsModal 
                        lead={selectedLead}
                        onClose={() => setShowDetailsModal(false)}
                        onUpdate={fetchLeads}
                    />
                )}
            </AnimatePresence>

            {/* Kanban Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-wider">Pipeline de Leads</h1>
                    <p className="text-gray-500">Gerencie o funil de vendas e conversões da Pro Riders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-600" />
                        <input 
                            type="text" 
                            placeholder="Buscar lead..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-brand-red text-sm w-64"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 border-white/10">
                        <Filter className="size-4" /> Filtros
                    </Button>
                    <Button size="sm" className="gap-2 bg-brand-red hover:bg-brand-red/90">
                        <Plus className="size-4" /> Novo Lead
                    </Button>
                </div>
            </div>

            {/* Kanban Body */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="size-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto pb-4 scrollbar-hide">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex gap-6 h-full min-w-max">
                            {COLUMNS.map((column) => (
                                <div key={column.id} className="w-80 flex flex-col gap-4">
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
                                                    "flex-1 rounded-2xl p-2 transition-colors flex flex-col gap-3 min-h-[500px]",
                                                    snapshot.isDraggingOver ? "bg-white/[0.01]" : "bg-transparent border border-white/[0.02]"
                                                )}
                                            >
                                                {leads[column.id]?.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map((lead, index) => (
                                                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={provided.draggableProps.style}
                                                                onClick={() => handleOpenDetails(lead)}
                                                                className={cn(
                                                                    "bg-[#0f0f0f] border border-white/5 p-4 rounded-2xl shadow-xl hover:border-brand-red/30 transition-all group/card cursor-pointer",
                                                                    snapshot.isDragging && "rotate-2 border-brand-red shadow-brand-red/10 z-50"
                                                                )}
                                                            >
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <span className="text-[9px] uppercase font-black tracking-widest text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
                                                                        {lead.origin || 'Direto'}
                                                                    </span>
                                                                    <div className="flex gap-1">
                                                                        {lead.phone && <Phone size={10} className="text-gray-600" />}
                                                                        {lead.whatsapp && <MessageSquare size={10} className="text-green-600" />}
                                                                    </div>
                                                                </div>
                                                                <h4 className="font-bold text-white group-hover/card:text-brand-red transition-colors">{lead.name}</h4>
                                                                {lead.interest && (
                                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{lead.interest}</p>
                                                                )}
                                                                
                                                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                                                                    <div className="flex -space-x-2">
                                                                        <div className="size-6 rounded-full bg-brand-red/20 border border-white/5 flex items-center justify-center text-[10px] font-bold text-brand-red">
                                                                            {lead.name[0]}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest">
                                                                        {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                                
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full border border-dashed border-white/5 text-gray-700 hover:text-brand-red hover:bg-brand-red/5 hover:border-brand-red/20 py-8 rounded-xl"
                                                >
                                                    <Plus className="size-4 mr-2" />
                                                </Button>
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                </div>
            )}
        </div>
    );
}
