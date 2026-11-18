import SiteLayout from '../components/SiteLayout.jsx';
import ChatbotHero from '../components/sections/ChatbotHero.jsx';
import ChatbotFeatures from '../components/sections/ChatbotFeatures.jsx';
import ChatbotDeveloper from '../components/sections/ChatbotDeveloper.jsx';
import ChatbotInquiry from '../components/sections/ChatbotInquiry.jsx';
import '../styles/chatbot.css';

export default function ChatbotProjectPage() {
    return (
        <SiteLayout
            page="chatbot"
            title="AI-Powered Cybersecurity Awareness Chatbot | S.L.M. Asri"
            description="AI-Powered Cybersecurity Awareness Chatbot - A project by Sulaiman Lebbe Muhammad Asri. Built with Python, Flask, HTML, CSS, JavaScript, and MySQL to deliver cybersecurity quizzes and awareness content."
        >
            <ChatbotHero />
            <ChatbotFeatures />
            <ChatbotDeveloper />
            <ChatbotInquiry />
        </SiteLayout>
    );
}
