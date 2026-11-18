import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

const PortfolioPage = lazy(() => import('./pages/PortfolioPage.jsx'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetailsPage.jsx'));
const ChatbotProjectPage = lazy(() => import('./pages/ChatbotProjectPage.jsx'));
const KnowledgeSystemPage = lazy(() => import('./pages/KnowledgeSystemPage.jsx'));
const VideoResumePage = lazy(() => import('./pages/VideoResumePage.jsx'));
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard.jsx'));

export default function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={null}>
                <Routes>
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
        </BrowserRouter>
    );
}
