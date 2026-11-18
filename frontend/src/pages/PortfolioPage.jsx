import SiteLayout from '../components/SiteLayout.jsx';
import HeroSection from '../components/sections/HeroSection.jsx';
import SkillsTicker from '../components/sections/SkillsTicker.jsx';
import AboutSection from '../components/sections/AboutSection.jsx';
import SkillsSection from '../components/sections/SkillsSection.jsx';
import CertificationsSection from '../components/sections/CertificationsSection.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
export default function PortfolioPage() {
    return (
        <SiteLayout
            page="home"
            title="Sulaiman Lebbe Muhammad Asri | Full-Stack &amp; Software Engineering Student"
            description="Professional Portfolio of Sulaiman Lebbe Muhammad Asri (S.L.M. Asri) - HND IT Student at SLIATE Anuradhapura, Full-Stack Web Developer, Mobile &amp; Desktop App Developer, and AI/Cybersecurity Enthusiast."
        >
            <HeroSection />
            <SkillsTicker />
            <AboutSection />
            <SkillsSection />
            <CertificationsSection />
            <ContactSection />
        </SiteLayout>
    );
}
