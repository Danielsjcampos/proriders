import { Player } from '@remotion/player';
import { HeroAnimation } from '../remotion/HeroAnimation';

const HeroRemotion = () => {
    return (
        <section id="hero" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
            <Player
                component={HeroAnimation}
                durationInFrames={120}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                controls={false}
                autoPlay
                loop
            />
            
            {/* CTA Buttons Overlay (Keep them as HTML for better interactivity) */}
            <div className="container mx-auto px-4 z-10 absolute bottom-20 left-1/2 -translate-x-1/2">
                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="https://wa.me/5519999999999"
                        className="bg-[#E31E24] hover:bg-red-700 text-white px-8 py-4 rounded text-base font-bold flex items-center justify-center gap-2 transition-transform hover:-translate-y-1"
                    >
                        Falar com a Pro Riders
                    </a>
                    <a
                        href="#courses"
                        className="border border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded text-base font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                    >
                        Conhecer os Cursos
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroRemotion;
