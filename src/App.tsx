import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from './presentation/home/home';
import Consultancy from './presentation/services/consultancy';
import Training from './presentation/services/training';
import QMS from './presentation/services/qms';
import MVV from './presentation/aboutus/mvv';
import Expertise from './presentation/aboutus/expertise';
import { getAccessToken } from './calendar_access/authService';


function App() {
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessToken();
        sessionStorage.setItem('accessToken', token || '');
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };
    fetchToken();
  }, []);

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg custom-navbar mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand custom-navbar-brand" to="/">
              <img className='logo' src="/img/logo_inicio.png" alt="Logo" />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle dropdown-button" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ background: 'none', border: 'none', padding: 0 }}>
                    About Us
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/mvv">Mission, Vision & Values</Link></li>
                    <li><Link className="dropdown-item" to="/expertise">Expertise</Link></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle dropdown-button" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ background: 'none', border: 'none', padding: 0 }}>
                    Services
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/consultancy">Sterilization Consultancy</Link></li>
                    <li><Link className="dropdown-item" to="/training">Sterilization Training</Link></li>
                    <li><Link className="dropdown-item" to="/qms">Quality Management Systems</Link></li>
                  </ul>
                </li>
                {/* Add more nav items here if needed */}
              </ul>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultancy" element={<Consultancy />} />
          <Route path="/training" element={<Training />} />
          <Route path="/qms" element={<QMS />} />
          <Route path="/mvv" element={<MVV />} />
          <Route path="/expertise" element={<Expertise />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
