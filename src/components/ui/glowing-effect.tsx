import { memo, useCallback, useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface GlowingEffectProps {
    blur?: number;
    inactiveZone?: number;
    proximity?: number;
    spread?: number;
    variant?: "default" | "white";
    glow?: boolean;
    className?: string;
    movementDuration?: number;
    borderWidth?: number;
    disabled?: boolean;
}

export const GlowingEffect = memo(
    ({
        blur = 0,
        inactiveZone = 0.7,
        proximity = 0,
        spread = 20,
        variant = "default",
        glow = false,
        className = "",
        movementDuration = 2,
        borderWidth = 1,
        disabled = false,
    }: GlowingEffectProps) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const lastPosition = useRef({ x: 0, y: 0 });
        const animationFrameRef = useRef(0);

        const handleMove = useCallback(
            (e?: { x: number; y: number }) => {
                if (!containerRef.current) return;
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                animationFrameRef.current = requestAnimationFrame(() => {
                    const element = containerRef.current;
                    if (!element) return;
                    const { left, top, width, height } = element.getBoundingClientRect();
                    const mouseX = e?.x ?? lastPosition.current.x;
                    const mouseY = e?.y ?? lastPosition.current.y;
                    if (e) {
                        lastPosition.current = { x: mouseX, y: mouseY };
                    }
                    const center = [left + width * 0.5, top + height * 0.5];
                    const distanceFromCenter = Math.hypot(
                        mouseX - center[0],
                        mouseY - center[1]
                    );
                    const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;
                    if (distanceFromCenter < inactiveRadius) {
                        element.style.setProperty("--active", "0");
                        return;
                    }
                    const isActive =
                        mouseX > left - proximity &&
                        mouseX < left + width + proximity &&
                        mouseY > top - proximity &&
                        mouseY < top + height + proximity;
                    element.style.setProperty("--active", isActive ? "1" : "0");
                    if (!isActive) return;
                    const currentAngle =
                        parseFloat(element.style.getPropertyValue("--start")) || 0;
                    let targetAngle =
                        (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
                        Math.PI +
                        90;
                    const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
                    const newAngle = currentAngle + angleDiff;
                    animate(currentAngle, newAngle, {
                        duration: movementDuration,
                        ease: [0.16, 1, 0.3, 1],
                        onUpdate: (value) => {
                            element.style.setProperty("--start", String(value));
                        },
                    });
                });
            },
            [inactiveZone, proximity, movementDuration]
        );

        useEffect(() => {
            if (disabled) return;
            const handlePointerMove = (e: PointerEvent) => handleMove({ x: e.clientX, y: e.clientY });
            document.body.addEventListener("pointermove", handlePointerMove, {
                passive: true,
            });
            return () => {
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                }
                document.body.removeEventListener("pointermove", handlePointerMove);
            };
        }, [handleMove, disabled]);

        return (
            <div
                ref={containerRef}
                style={{
                    // @ts-ignore
                    "--blur": `${blur}px`,
                    "--spread": spread,
                    "--start": "0",
                    "--active": "0",
                    "--glowingeffect-border-width": `${borderWidth}px`,
                    "--repeating-conic-gradient-times": "5",
                    "--gradient":
                        variant === "white"
                            ? `repeating-conic-gradient(from 236.84deg at 50% 50%, #fff, #fff calc(25% / var(--repeating-conic-gradient-times)))`
                            : `radial-gradient(circle at 50% 50%, #ca8a04 10%, transparent 70%),
                   repeating-conic-gradient(
                     from 236.84deg at 50% 50%,
                     #ca8a04 0%,
                     #eab308 calc(25% / var(--repeating-conic-gradient-times)),
                     #d92323 calc(50% / var(--repeating-conic-gradient-times)), 
                     #ca8a04 calc(100% / var(--repeating-conic-gradient-times))
                   )`,
                }}
                className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity ${glow ? "opacity-100" : "opacity-0"
                    } ${disabled ? "hidden" : ""} ${className}`}
            >
                <div
                    className={`absolute inset-0 rounded-[inherit]
            after:content-[''] after:rounded-[inherit] after:absolute after:inset-0
            after:[border:var(--glowingeffect-border-width)_solid_transparent]
            after:[background:var(--gradient)] after:[background-attachment:fixed]
            after:opacity-[var(--active)] after:transition-opacity after:duration-500
            after:[mask-clip:padding-box,border-box]
            after:[mask-composite:intersect]
            after:[mask-image:linear-gradient(#000,#000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff_calc(var(--spread)*1deg),#00000000_calc(var(--spread)*2deg))]
            ${blur > 0 ? "blur-[var(--blur)]" : ""}
          `}
                />
            </div>
        );
    }
);
GlowingEffect.displayName = "GlowingEffect";
