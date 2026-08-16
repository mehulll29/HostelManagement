import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Home as HomeIcon,
  Wrench,
  CalendarCheck,
  UtensilsCrossed,
} from 'lucide-react';

const Home = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#111111', color: '#f0f0f0', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header className="home-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="HostelHub Logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Hostel<span style={{ color: '#f97316' }}>Hub</span>
          </span>
        </div>

        <nav className="home-nav-links">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
          <Link to="/login">Login</Link>
          <button onClick={() => scrollToSection('features')}>Features</button>
          <button onClick={() => scrollToSection('contact')}>Contact</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome to HostelHub</h1>
        <p className="hero-subtitle">
          Streamlining hostel management for Indian educational institutions
        </p>
        <Link
          to="/login"
          style={{
            display: 'inline-block',
            padding: '0.65rem 1.75rem',
            background: '#f97316',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9375rem',
            borderRadius: '6px',
            textDecoration: 'none',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.target.style.background = '#ea580c'}
          onMouseLeave={(e) => e.target.style.background = '#f97316'}
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="features-title">Features</h2>

        {/* Top Row: 3 Cards */}
        <div className="features-grid-top">
          <div className="feature-card">
            <GraduationCap size={44} color="#a78bfa" />
            <h3>Student Management</h3>
            <p>Complete student registration and profile management with all necessary details</p>
          </div>

          <div className="feature-card">
            <HomeIcon size={44} color="#fbbf24" />
            <h3>Room Allocation</h3>
            <p>Smart room and bed allocation system with preference management</p>
          </div>

          <div className="feature-card">
            <Wrench size={44} color="#d1d5db" />
            <h3>Complaint System</h3>
            <p>Efficient complaint and maintenance request tracking system</p>
          </div>
        </div>

        {/* Bottom Row: 2 Cards Centered */}
        <div className="features-grid-bottom">
          <div className="feature-card">
            <CalendarCheck size={44} color="#34d399" />
            <h3>Leave Management</h3>
            <p>Digital leave applications and gate pass generation</p>
          </div>

          <div className="feature-card">
            <UtensilsCrossed size={44} color="#f97316" />
            <h3>Mess Management</h3>
            <p>Weekly menu planning and meal attendance tracking</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-grid">
          <div className="contact-card">
            <strong>Email:</strong>
            <p>support@hostelhub.com</p>
          </div>
          <div className="contact-card">
            <strong>Phone:</strong>
            <p>+91 9876543210</p>
          </div>
          <div className="contact-card">
            <strong>Address:</strong>
            <p>University Campus, Delhi, India</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2024 HostelHub Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

