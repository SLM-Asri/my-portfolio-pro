import { lazy, Suspense, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { usePageMotion } from './hooks/usePageMotion.js';

const PortfolioPage = lazy(() => import('./pages/PortfolioPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage.jsx'));
const ChatbotProjectPage = lazy(() => import('./pages/ChatbotProjectPage.jsx'));
const KnowledgeSystemPage = lazy(() => import('./pages/KnowledgeSystemPage.jsx'));
const VideoResumePage = lazy(() => import('./pages/VideoResumePage.jsx'));
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard.jsx'));

function AppRoutes() {
    const location = useLocation();
    const motionRootRef = useRef(null);
    usePageMotion(motionRootRef, location.pathname);

    return (
        <div className="route-motion-frame" key={location.pathname} ref={motionRootRef}>
            <Suspense fallback={null}>
                <Routes location={location}>
                    <Route path="/" element={<PortfolioPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/cybersecurity-chatbot" element={<ChatbotProjectPage />} />
                    <Route path="/projects/knowledge-assessment" element={<KnowledgeSystemPage />} />
                    <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
                    <Route path="/video-resume" element={<VideoResumePage />} />
                    <Route path="/admin" element={<AdminLoginPage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}
