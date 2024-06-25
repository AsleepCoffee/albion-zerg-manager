import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewComp.css';
import AdminNavBar from './AdminNavBar';

const ViewComp = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        setEvent(response.data);
        setAssignedRoles(response.data.assignedRoles || {});
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div className="view-comp-page">
      <AdminNavBar />
      <h1>View Comp for {event.comp}</h1>
      <div className="roles-container">
        {event.compSlots.map((role, index) => (
          <div key={index} className="role-box" style={{ backgroundColor: assignedRoles[role] ? 'green' : '#555' }}>
            <p>{role}</p>
            {assignedRoles[role] && <p>{assignedRoles[role].name} - {role}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewComp;
