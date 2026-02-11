import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Img } from 'remotion';

export const HeroAnimation: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 97 images: pro2_000 to pro2_096
    const totalImages = 97;
    const durationInSeconds = 4;
    const totalFrames = durationInSeconds * fps;
    
    const imageIndex = Math.floor(
        interpolate(frame, [0, totalFrames], [0, totalImages - 1], {
            extrapolateRight: 'clamp',
        })
    );

    const paddedIndex = String(imageIndex).padStart(3, '0');
    const imageSrc = staticFile(`hero/pro2_${paddedIndex}.webp`);

    // Animation values
    const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
    const textSlide = interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' });
    
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Image Sequence Layer */}
            <AbsoluteFill>
                <Img
                    src={imageSrc}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </AbsoluteFill>

            {/* Gradient Overlay for Readability */}
            <AbsoluteFill
                style={{
                    background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                }}
            />

            {/* Content Container */}
            <AbsoluteFill
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 8%',
                    opacity: fadeIn,
                    transform: `translateY(${textSlide}px)`,
                }}
            >
                {/* Tagline */}
                <div
                    style={{
                        color: '#D92323',
                        fontWeight: 'bold',
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        fontSize: 18,
                        marginBottom: 16,
                    }}
                >
                    Especialista em BMW GS
                </div>

                {/* Main Title */}
                <div
                    style={{
                        color: 'white',
                        fontSize: 72,
                        fontWeight: '900',
                        lineHeight: 1.1,
                        maxWidth: 900,
                        textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                >
                    A Referência em Manutenção<br />
                    e Cursos para <span style={{ color: '#D92323' }}>BMW GS</span>
                </div>

                {/* Subtitle */}
                <div
                    style={{
                        color: '#D1D5DB',
                        fontSize: 24,
                        marginTop: 32,
                        maxWidth: 650,
                        lineHeight: 1.5,
                        fontWeight: '400',
                    }}
                >
                    Domine a mecânica da sua Big Trail ou deixe nas mãos de quem entende.
                    Una a excelência especializada com conhecimento prático.
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
