import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ConfigureEvent.css';
import AdminNavBar from './AdminNavBar'; // Import the AdminNavBar component

const ConfigureEvent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event and all associated signups?')) {
      try {
        await axios.delete(`/api/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
        alert('Event and associated signups deleted successfully.');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred while deleting the event.');
      }
    }
  };

  return (
    <div className="configure-event-page">
      <AdminNavBar /> {/* Include the AdminNavBar component */}
      <h1>Configure Event</h1>
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <div className="event-info">
            <h3>{new Date(event.time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} - {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</h3>
            <p><strong>Caller:</strong> {event.caller}</p>
            <p><strong>Hammers:</strong> {event.hammers}</p>
            <p><strong>Sets:</strong> {event.sets}</p>
          </div>
          <div className="event-actions">
            <Link to={`/configure-event-comp/${event._id}`} className="button">View Comp</Link>
            <Link to={`/signup/${event._id}`} className="button">Sign Up</Link>
            <Link to={`/event-signups/${event._id}`} className="button">View Signups</Link>
            <Link to={`/edit-event-information/${event._id}`} className="button">Edit Event Information</Link> {/* New button */}
            <button className="button delete-btn" onClick={() => handleDelete(event._id)}>Delete Event</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfigureEvent;
