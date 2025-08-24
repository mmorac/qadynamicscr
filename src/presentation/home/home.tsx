import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

const Home: React.FC = () => {
  return (
    <div className="home-fb-bg">
      <header className="home-fb-header">
        <img src="/img/logo_inicio.png" alt="QADynamicsCR Logo" className="home-fb-logo" />
        <h1 className="home-fb-title">QA Dynamics CR</h1>
        <p className="home-fb-subtitle">Quality, Consultancy & Training for Your Business</p>
      </header>
      <section className="home-fb-section">
        <div className="home-fb-card">
          <h2>Book an Introduction Call</h2>
          <p>Schedule an initial session with our experts.</p>
          <Link to="/book-intro" className="home-fb-btn">Book Now</Link>
        </div>
        <div className="home-fb-card">
          <h2>Our Expertise</h2>
          <p>Discover our experience in quality management and business solutions.</p>
          <Link to="/expertise" className="home-fb-btn">Learn More</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
