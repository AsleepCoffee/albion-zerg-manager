import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import AdminNavBar from './AdminNavBar';

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleSetupEvent = () => {
    navigate('/setup-event');
  };

  const handleConfigureEvent = () => {
    navigate('/configure-event');
  };

  const handleConfigureComps = () => {
    navigate('/configure-comps');
  };

  return (
    <div className="admin-panel">
      <AdminNavBar />
      <div className="admin-content">
        <h1>Admin Panel</h1>
        <button onClick={handleSetupEvent}>Setup Event</button>
        <button onClick={handleConfigureEvent}>Configure Event</button>
        <button onClick={handleConfigureComps}>Configure Comps</button>
      </div>
    </div>
  );
};

export default AdminPanel;
