import SiteLayout from '../components/SiteLayout.jsx';
import KnowledgeHero from '../components/sections/KnowledgeHero.jsx';
import KnowledgeFeatures from '../components/sections/KnowledgeFeatures.jsx';
import KnowledgeDeveloper from '../components/sections/KnowledgeDeveloper.jsx';
import KnowledgeInquiry from '../components/sections/KnowledgeInquiry.jsx';
import '../styles/knowledge.css';

export default function KnowledgeSystemPage() {
    return (
        <SiteLayout
            page="knowledge"
            title="Gamified Student Knowledge Assessment System | S.L.M. Asri"
            description="Gamified Student Knowledge Level Identification System - A project by Sulaiman Lebbe Muhammad Asri. Built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL with JWT authentication and real-time dashboards."
        >
            <KnowledgeHero />
            <KnowledgeFeatures />
            <KnowledgeDeveloper />
            <KnowledgeInquiry />
        </SiteLayout>
    );
}
