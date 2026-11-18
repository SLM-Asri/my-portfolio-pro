import { useEffect, useState } from 'react';
import { createRevealAnimation } from '../../scripts/revealAnimation.js';

export default function Preloader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!isVisible) return undefined;

        const cleanup = createRevealAnimation(document.body, () => {
            window.dispatchEvent(new Event('portfolio:enter'));
            setIsVisible(false);
        });

        return cleanup;
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <>
            <canvas id="gl" aria-hidden="true" />
            <div id="grain" aria-hidden="true" />
            <div id="pre" aria-live="polite">
                <canvas id="emb" aria-hidden="true" />
                <svg viewBox="0 0 132 132" aria-hidden="true">
                    <circle className="t" cx="66" cy="66" r="62" />
                    <circle className="p" id="ring" cx="66" cy="66" r="62" strokeDasharray="389.6" strokeDashoffset="389.6" />
                </svg>
                <div id="pct">1</div>
            </div>
            <button id="btn" type="button" disabled>
                Reveal
            </button>
        </>
    );
}
