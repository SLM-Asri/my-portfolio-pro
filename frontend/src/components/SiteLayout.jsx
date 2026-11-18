import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializePageInteractions, initializeSiteInteractions } from '../scripts/site.js';
import { initializeResumeVideo } from '../scripts/resumeVideo.js';
import Preloader from './sections/Preloader.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import SiteFooter from './SiteFooter.jsx';
import SiteHeader from './SiteHeader.jsx';

export default function SiteLayout({ children, page, title, description }) {
    const location = useLocation();

    useEffect(() => {
        document.title = title;
        const descriptionTag = document.querySelector('meta[name="description"]');
        if (descriptionTag) descriptionTag.content = description;

        const cleanups = [
            initializeSiteInteractions(),
            initializePageInteractions()
        ];
        if (page === 'resume') cleanups.push(initializeResumeVideo());

        return () => cleanups.forEach(cleanup => cleanup());
    }, [description, page, title]);

    useEffect(() => {
        if (!location.hash) {
            window.scrollTo(0, 0);
            return;
        }

        const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) target.scrollIntoView();
    }, [location.hash, location.pathname]);

    return (
        <>
            {page === 'home' && <Preloader />}
            {page === 'home' && <ScrollToTop />}
            <SiteHeader page={page} />
            {children}
            <SiteFooter page={page} />
            {page !== 'home' && page !== 'resume' && <ScrollToTop />}
        </>
    );
}
