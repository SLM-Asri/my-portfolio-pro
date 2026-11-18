const motionSelector = [
    'section',
    'header',
    'footer',
    'nav a[href]',
    '.menu-toggle',
    'h1',
    'h2',
    'h3',
    'h4',
    'p',
    'li',
    'label',
    'input',
    'textarea',
    'select',
    'button',
    'a[href]',
    'img',
    'video',
    'article',
    '.skills-category',
    '.shape-card-3d',
    '.about-card-item',
    '.stat-box',
    '.timeline-card-3d',
    '.skills-photo-card',
    '.tech-diagnostic-module',
    '.lang-card',
    '.bento-card',
    '.detail-item',
    '.project-detail-section',
    '.project-stack-grid > div',
    '.project-gallery > a',
    '.related-project-card',
    '.resume-features-card',
    '.video-player-wrapper',
    '.founder-img-card',
    '.company-logo-wrapper',
    '.admin-topbar',
    '.admin-sidebar',
    '.admin-page-heading',
    '.admin-notice',
    '.admin-card',
    '.admin-item',
    '.admin-field',
    '.login-card',
    '.metric-card'
].join(',');

function getMotionVariant(element) {
    if (element.matches('img, video, article, .bento-card, .shape-card-3d, .about-card-item, .project-showcase-card, .related-project-card, .admin-card, .admin-item, .metric-card')) {
        return 'reveal--scale';
    }

    if (element.matches('header, footer, nav a[href], .admin-topbar, .admin-sidebar')) {
        return 'reveal--fade';
    }

    if (element.matches('.project-detail-intro, .hero-content, .founder-img-card')) {
        return 'reveal--slide-left';
    }

    if (element.matches('.project-detail-hero-image, .company-logo-wrapper')) {
        return 'reveal--slide-right';
    }

    return 'reveal--up';
}

function setRevealDelay(element) {
    const siblings = Array.from(element.parentElement?.children || []);
    const siblingIndex = siblings.indexOf(element);
    const delay = Math.min(Math.max(siblingIndex, 0) * 70, 350);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
}

export function observePageMotion(root) {
    if (!root) return () => {};

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
    if (reducedMotion || !('IntersectionObserver' in window) || !('MutationObserver' in window)) {
        return () => {};
    }

    const observedElements = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target;
            element.classList.add('active');
            observer.unobserve(element);

            const cleanupReveal = (event) => {
                if (event.target !== element || !event.animationName.startsWith('reveal-')) return;

                element.removeEventListener('animationend', cleanupReveal);
                element.classList.remove('reveal', 'active', ...Array.from(element.classList).filter((name) => name.startsWith('reveal--')));
                element.style.removeProperty('--reveal-delay');
            };
            element.addEventListener('animationend', cleanupReveal);
        });
    }, { threshold: 0.01, rootMargin: '0px 0px -24px 0px' });

    const revealElement = (element) => {
        if (!(element instanceof HTMLElement) || observedElements.has(element)) return;
        if (element.closest('#pre, #btn, #gl, #grain')) return;
        observedElements.add(element);

        const variant = getMotionVariant(element);
        element.classList.add('reveal', variant);
        setRevealDelay(element);
        observer.observe(element);
    };

    const scanNode = (node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(motionSelector)) revealElement(node);
        node.querySelectorAll(motionSelector).forEach(revealElement);
    };

    scanNode(root);

    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(scanNode);
            mutation.removedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement)) return;

                observer.unobserve(node);
                observedElements.delete(node);
                node.querySelectorAll(motionSelector).forEach((element) => {
                    observer.unobserve(element);
                    observedElements.delete(element);
                });
            });
        });
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
        mutationObserver.disconnect();
        observer?.disconnect();
    };
}
