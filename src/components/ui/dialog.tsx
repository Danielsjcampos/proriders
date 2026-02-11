import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
                    />
                    
                    {/* Content */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={cn(
                                "w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl pointer-events-auto overflow-hidden",
                                className
                            )}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <h2 className="text-xl font-black text-white uppercase tracking-wider">{title}</h2>
                                <button 
                                    onClick={onClose}
                                    className="size-8 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                            
                            {/* Body */}
                            <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
