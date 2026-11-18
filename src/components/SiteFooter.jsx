export default function SiteFooter({ page }) {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p>&copy; 2026 Sulaiman Lebbe Muhammad Asri. All Rights Reserved.</p>
                {page === 'home' ? (
                    <p>Designed with <i className="fas fa-heart text-coral" /> and built on Full-Stack principles.</p>
                ) : page === 'resume' ? (
                    <p>Full-Stack Developer | HND IT Student</p>
                ) : (
                    <p>Full-Stack Developer &amp; HND IT Student</p>
                )}
            </div>
        </footer>
    );
}
