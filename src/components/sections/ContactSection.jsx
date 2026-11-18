import { useState } from 'react';
import api from '../../services/api.js';

export default function ContactSection() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatus('');

        try {
            await api.post('/contact', formData);
            setStatus('Your message has been sent successfully.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus(error.message || 'Unable to send your message right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="contact-section scroll-section">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">Get In Touch</h2>
      <div className="title-underline" />
    </div>
    <div className="contact-grid">
      {/* Left: Contact Details and Social Buttons */}
      <div className="contact-info-panel reveal">
        <h3>Contact Information</h3>
        <p className="contact-subtext">Have an internship opportunity, freelance project, or collaboration idea to discuss? Let's connect!</p>
        <div className="contact-details">
          {/* Email */}
          <a href="mailto:mohammadasri553@gmail.com" className="detail-item" data-contact-theme="purple">
            <div className="detail-icon">
              <i className="fas fa-envelope" />
            </div>
            <div className="detail-info">
              <span>Email Me</span>
              <strong>mohammadasri553@gmail.com</strong>
            </div>
          </a>
          {/* WhatsApp */}
          <a href="https://wa.me/94768967587" target="_blank" rel="noopener" className="detail-item" data-contact-theme="green">
            <div className="detail-icon">
              <i className="fab fa-whatsapp" />
            </div>
            <div className="detail-info">
              <span>WhatsApp / Call</span>
              <strong>+94 76 896 7587</strong>
            </div>
          </a>
          {/* LinkedIn */}
          <a href="https://www.linkedin.com/in/muhammad-asri-37a192329" target="_blank" rel="noopener" className="detail-item" data-contact-theme="blue">
            <div className="detail-icon">
              <i className="fab fa-linkedin-in" />
            </div>
            <div className="detail-info">
              <span>LinkedIn Connection</span>
              <strong>muhammad-asri-37a192329</strong>
            </div>
          </a>
          {/* GitHub */}
          <a href="https://github.com/SLM-Asri" target="_blank" rel="noopener" className="detail-item" data-contact-theme="white">
            <div className="detail-icon">
              <i className="fab fa-github" />
            </div>
            <div className="detail-info">
              <span>GitHub Profile</span>
              <strong>SLM-Asri</strong>
            </div>
          </a>
          {/* Location */}
          <a href="#" className="detail-item" data-contact-theme="yellow" onClick={(event) => event.preventDefault()}>
            <div className="detail-icon">
              <i className="fas fa-map-marker-alt" />
            </div>
            <div className="detail-info">
              <span>Location</span>
              <strong>Anuradhapura, Sri Lanka</strong>
            </div>
          </a>
        </div>
        <div className="social-circles">
          <a href="mailto:mohammadasri553@gmail.com" title="Email"><i className="fas fa-envelope" /></a>
          <a href="https://wa.me/94768967587" target="_blank" rel="noopener" title="WhatsApp"><i className="fab fa-whatsapp" /></a>
          <a href="https://www.linkedin.com/in/muhammad-asri-37a192329" target="_blank" rel="noopener" title="LinkedIn"><i className="fab fa-linkedin-in" /></a>
          <a href="https://github.com/SLM-Asri" target="_blank" rel="noopener" title="GitHub"><i className="fab fa-github" /></a>
        </div>
      </div>
      {/* Right: Contact Form */}
      <div className="contact-form-panel reveal">
        <form id="contactForm" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required placeholder="Enter your name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" required placeholder="Enter your email address" value={formData.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" name="subject" required placeholder="Project description / Inquiry" value={formData.subject} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required placeholder="Tell me about your project, query, or invitation..." value={formData.message} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary form-btn colorful-contact-btn" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send Message'} <i className="fas fa-paper-plane" /></button>
        </form>
        {status && <div id="formStatus" className="form-status" style={{ display: 'block' }}>{status}</div>}
      </div>
    </div>
  </div>
</section>

    );
}
