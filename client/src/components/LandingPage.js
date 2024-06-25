import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Use Link for navigation

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(moment().utc().format('YYYY-MM-DD HH:mm:ss'));
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const sortedEvents = response.data.sort((a, b) => new Date(a.time) - new Date(b.time));
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();

    const timer = setInterval(() => {
      setCurrentTime(moment().utc().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-page">
      <header>
        <h1>Albion <span className="highlight">Zerg</span> Manager</h1>
        <p>Developed by <span className="developer">SnowTea</span></p>
        <a href="/admin-login" className="admin-login">Admin Login</a>
      </header>
      <div className="time-container">
        <div className="time-bubble current-time">
          <p>Current UTC Time:</p>
          <p>{currentTime}</p>
        </div>
      </div>
      <main>
        {events.map((event, index) => (
          <section key={index} className={index === 0 ? 'current-mass' : 'up-next'}>
            <h2>{index === 0 ? 'Current Mass' : 'Up Next'}</h2>
            <div className={`event-card ${event.rewards === 'Regearable' ? 'regearable' : 'lootsplit'}`}>
              <div className="event-details">
                <p className="time">{moment(event.time).format('dddd, MMMM D - HH:mm [UTC]')}</p>
                <p className="title">{moment(event.time).format('HH:mm')} UTC - {event.comp.name} - {event.rewards}</p>
                <p className="details">Comp: {event.comp.name} | Caller: {event.caller} | Hammers: {event.hammers} | Sets: {event.sets}</p>
              </div>
              <div className="event-actions">
                <Link to={`/signup/${event._id}`} className="button">Sign Up</Link>
                <Link to={`/view-comp/${event._id}`} className="button">View Comp</Link> {/* Add this line */}
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default LandingPage;
