import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavBar.css';

const AdminNavBar = () => {
  return (
    <nav className="admin-navbar">
      <ul className="nav-links">
        <li><Link to="/" className="nav-button">Home</Link></li>
        <li><Link to="/configure-comps" className="nav-button">Configure Comps</Link></li>
        <li><Link to="/setup-event" className="nav-button">Setup Event</Link></li>
        <li><Link to="/configure-event" className="nav-button">Configure Event</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
