import { useEffect, useRef, useState } from 'react';

interface TrustIndexWidgetProps {
    widgetId: string;
}

const TrustIndexWidget = ({ widgetId }: TrustIndexWidgetProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Check if script is already present
        const existingScript = document.querySelector('script[src*="defer_async.js"]');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://cdn.trustindex.io/loader.js?${new Date().getTime()}`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log("TrustIndex script loaded");
                setScriptLoaded(true);
            };
            document.body.appendChild(script);
        } else {
            console.log("TrustIndex script already exists");
            setScriptLoaded(true);
        }
    }, []);

    useEffect(() => {
        const checkAndInit = () => {
            console.log("[TrustIndex Debug] Checking environment...");
            const container = containerRef.current;
            console.log("[TrustIndex Debug] Container ref:", container);

            // @ts-ignore
            const ti = window.Trustindex;
            console.log("[TrustIndex Debug] window.Trustindex:", ti);

            if (ti && typeof ti.init === 'function') {
                console.log("[TrustIndex Debug] Calling init()...");
                ti.init();
            } else {
                console.log("[TrustIndex Debug] Trustindex object missing.");
            }
        };

        // Immediate check
        checkAndInit();

        // Polling check (every 1s for 10s)
        const interval = setInterval(checkAndInit, 1000);
        const timeout = setTimeout(() => clearInterval(interval), 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [scriptLoaded]);

    return (
        <div ref={containerRef} className="w-full min-h-[400px] bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-center">
            {/* Visual feedback for development/debug */}
            {!scriptLoaded && (
                <div className="text-gray-500 text-sm absolute">Carregando avaliações...</div>
            )}

            {/* Scripts */}
            <script defer async src={`https://cdn.trustindex.io/loader.js?${widgetId}`}></script>

            {/* Widget Container */}
            <div className="trustindex-google-widget w-full h-full" data-widget-id={widgetId}></div>
        </div>
    );
};

export default TrustIndexWidget;
