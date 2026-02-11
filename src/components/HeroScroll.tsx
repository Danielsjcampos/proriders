import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TOTAL_IMAGES = 97;

const HeroScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    
    // 1. Phased Image Preloading
    useEffect(() => {
        const priorityFrames = 10;
        const loadedImages: HTMLImageElement[] = [];

        const loadRange = async (start: number, end: number) => {
            const promises = Array.from({ length: end - start }).map((_, i) => {
                const index = start + i;
                return new Promise((resolve) => {
                    const img = new Image();
                    const paddedIndex = String(index).padStart(3, '0');
                    img.src = `/hero/pro2_${paddedIndex}.webp`;
                    img.onload = () => {
                        loadedImages[index] = img;
                        resolve(img);
                    };
                });
            });
            await Promise.all(promises);
            // Update state with shallow copy to trigger re-renders as we load
            setImages([...loadedImages]);
        };

        const preload = async () => {
            // High Priority: First 10 frames for instant visual
            await loadRange(0, priorityFrames);
            
            // Medium Priority: Next 30 frames
            loadRange(priorityFrames, 40);
            
            // Background: The rest
            setTimeout(() => loadRange(40, TOTAL_IMAGES), 1000);
        };

        preload();
    }, []);

    // 2. Scroll Logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const imageIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_IMAGES - 1]);

    // 3. Canvas Rendering
    useEffect(() => {
        const render = () => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            const currentIndex = Math.floor(imageIndex.get());
            
            if (canvas && ctx && images[currentIndex]) {
                const img = images[currentIndex];
                const canvasAspect = canvas.width / canvas.height;
                const imgAspect = img.width / img.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (canvasAspect > imgAspect) {
                    drawWidth = canvas.width;
                    drawHeight = canvas.width / imgAspect;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawWidth = canvas.height * imgAspect;
                    drawHeight = canvas.height;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
        };

        const unsubscribe = imageIndex.on("change", render);
        if (images.length > 0) render();
        return () => unsubscribe();
    }, [images, imageIndex]);

    useEffect(() => {
        const updateSize = () => {
            if (canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Text Transforms - Sequencing Phases
    // Phase 1: 0 - 0.25 (A Referência em Manutenção)
    const opacity1 = useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [0, 1, 1, 0]);
    const y1 = useTransform(smoothProgress, [0, 0.05, 0.20, 0.25], [20, 0, 0, -20]);

    // Phase 2: 0.25 - 0.50 (e Cursos para)
    const opacity2 = useTransform(smoothProgress, [0.25, 0.30, 0.45, 0.50], [0, 1, 1, 0]);
    const y2 = useTransform(smoothProgress, [0.25, 0.30, 0.45, 0.50], [20, 0, 0, -20]);

    // Phase 3: 0.50 - 0.75 (BMW GS)
    const opacity3 = useTransform(smoothProgress, [0.50, 0.55, 0.70, 0.75], [0, 1, 1, 0]);
    const y3 = useTransform(smoothProgress, [0.50, 0.55, 0.70, 0.75], [20, 0, 0, -20]);

    // Phase 4: 0.75 - 1.0 (Domine... + CTAs)
    const opacity4 = useTransform(smoothProgress, [0.75, 0.80, 1], [0, 1, 1]);
    const y4 = useTransform(smoothProgress, [0.75, 0.80, 1], [20, 0, 0]);

    return (
        <section 
            ref={containerRef} 
            className="relative h-[500vh] bg-black"
        >
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
                <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                    <div className="max-w-4xl w-full text-center md:text-left">
                        
                        {/* Phase 1 */}
                        <motion.div 
                            style={{ opacity: opacity1, y: y1 }}
                            className="absolute inset-0 flex flex-col justify-center px-4 md:px-0"
                        >
                            <h2 className="text-4xl md:text-8xl font-black text-white uppercase leading-none">
                                A Referência em <br />
                                <span className="text-[#D92323]">Manutenção</span>
                            </h2>
                        </motion.div>

                        {/* Phase 2 */}
                        <motion.div 
                            style={{ opacity: opacity2, y: y2 }}
                            className="absolute inset-0 flex flex-col justify-center px-4 md:px-0"
                        >
                            <h2 className="text-4xl md:text-8xl font-black text-white uppercase leading-none">
                                e Cursos <br />
                                <span className="text-[#D92323]">Especializados</span>
                            </h2>
                        </motion.div>

                        {/* Phase 3 */}
                        <motion.div 
                            style={{ opacity: opacity3, y: y3 }}
                            className="absolute inset-0 flex flex-col justify-center px-4 md:px-0"
                        >
                            <h2 className="text-5xl md:text-9xl font-black text-white uppercase leading-none">
                                PARA <span className="text-[#D92323]">BMW GS</span>
                            </h2>
                        </motion.div>

                        {/* Phase 4 - Final Reveal */}
                        <motion.div 
                            style={{ opacity: opacity4, y: y4 }}
                            className="absolute inset-0 flex flex-col justify-center px-4 md:px-0"
                        >
                            <div className="max-w-2xl mx-auto md:mx-0">
                                <span className="text-[#D92323] font-bold tracking-widest uppercase text-sm mb-4 block">
                                    Domine a sua jornada
                                </span>
                                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 uppercase">
                                    Deixe nas mãos de <br />
                                    <span className="text-[#D92323]">QUEM ENTENDE</span>
                                </h1>
                                <p className="text-gray-300 text-lg md:text-xl mb-12 leading-relaxed">
                                    Una a excelência especializada com o conhecimento prático necessário para conquistar qualquer terreno.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <a
                                        href="https://wa.me/5519999999999"
                                        className="bg-[#D92323] hover:bg-red-700 text-white px-8 py-4 rounded text-base font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
                                    >
                                        Falar com a Pro Riders
                                    </a>
                                    <a
                                        href="#courses"
                                        className="border border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded text-base font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                                    >
                                        Conhecer os Cursos
                                        <ArrowRight size={20} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    style={{ opacity: useTransform(smoothProgress, [0, 0.02], [1, 0]) }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll para explorar</span>
                    <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroScroll;
