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

  const handlePlayerLookup = () => {
    navigate('/player-lookup');
  };

  const handleApprovedSets = () => {
    navigate('/approved-sets');
  };

  return (
    <div className="admin-panel">
      <AdminNavBar />
      <div className="admin-content">
        <h1>Admin Panel</h1>
        <button className="button" onClick={handleSetupEvent}>Setup Event</button>
        <button className="button" onClick={handleConfigureEvent}>Configure Event</button>
        <button className="button" onClick={handleConfigureComps}>Configure Comps</button>
        <button className="button" onClick={handlePlayerLookup}>Player Lookup</button>
        <button className="button" onClick={handleApprovedSets}>Approved Sets</button>
      </div>
    </div>
  );
};

export default AdminPanel;
