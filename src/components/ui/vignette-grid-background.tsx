
import { cn } from "../../lib/utils";

interface GridVignetteBackgroundProps {
    size?: number;
    x?: number;
    y?: number;
    horizontalVignetteSize?: number;
    verticalVignetteSize?: number;
    intensity?: number;
}

export function GridVignetteBackground({
    className,
    size = 48,
    x = 50,
    y = 50,
    horizontalVignetteSize = 100,
    verticalVignetteSize = 100,
    intensity = 0,
}: React.ComponentProps<"div"> & GridVignetteBackgroundProps) {
    return (
        <div
            className={cn(
                "absolute inset-0 z-0 opacity-50 bg-[image:linear-gradient(to_right,var(--muted-foreground),transparent_1px),linear-gradient(to_bottom,var(--muted-foreground),transparent_1px)] pointer-events-none",
                className
            )}
            style={{
                backgroundSize: `${size}px ${size}px`,
                // Enhanced mask for "blur" effect on all sides (transparent edges)
                maskImage: `
            linear-gradient(to bottom, transparent, black 20%, black 80%, transparent),
            linear-gradient(to right, transparent, black 20%, black 80%, transparent),
            radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${100 - intensity}%, transparent 100%)
        `,
                maskComposite: 'intersect' // Ensures all masks apply together
            }}
        />
    );
}
