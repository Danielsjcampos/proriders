
import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    placeholder?: string;
    className?: string;
}

export default function ImageUpload({ 
    value, 
    onChange, 
    label, 
    placeholder = "Clique para upload de imagem",
    className 
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
            } else {
                console.error('Upload failed');
                alert('Erro ao enviar imagem. Tente novamente.');
            }
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Erro de conexão ao enviar imagem.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && <label className="block text-xs uppercase text-gray-500 font-bold">{label}</label>}
            
            {value ? (
                <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black/20">
                    <img 
                        src={value} 
                        alt="Upload preview" 
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm" 
                            onClick={handleRemove}
                            className="bg-red-600 hover:bg-red-700 font-bold"
                        >
                            <X size={16} className="mr-2" /> Remover
                        </Button>
                    </div>
                </div>
            ) : (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/10 rounded-lg hover:border-brand-red/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleUpload}
                    />
                    {uploading ? (
                        <Loader2 className="animate-spin text-brand-red" />
                    ) : (
                        <>
                            <Upload className="text-gray-500 group-hover:text-white transition-colors" />
                            <p className="text-xs text-gray-500 font-bold group-hover:text-white transition-colors uppercase tracking-wide">
                                {placeholder}
                            </p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
