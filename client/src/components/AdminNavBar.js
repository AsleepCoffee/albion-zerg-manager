import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNavBar.css';

const AdminNavBar = () => {
  return (
    <nav className="admin-navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/configure-comps">Configure Comps</Link></li>
        <li><Link to="/setup-event">Setup Event</Link></li>
        <li><Link to="/configure-event">Configure Event</Link></li>
      </ul>
    </nav>
  );
};

export default AdminNavBar;
