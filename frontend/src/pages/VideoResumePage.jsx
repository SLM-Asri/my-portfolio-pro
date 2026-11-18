import SiteLayout from '../components/SiteLayout.jsx';
import ResumeShowcase from '../components/sections/ResumeShowcase.jsx';
import '../styles/resume.css';

export default function VideoResumePage() {
    return (
        <SiteLayout
            page="resume"
            title="Animation Video Resume | S.L.M. Asri"
            description="Watch the video resume of Sulaiman Lebbe Muhammad Asri - HND IT Student and Full-Stack, Mobile &amp; Desktop App Developer."
        >
            <ResumeShowcase />
        </SiteLayout>
    );
}
