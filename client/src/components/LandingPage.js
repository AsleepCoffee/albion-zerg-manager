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
        <div className="header-content">
          <div className="title-section">
            <h1>
              <span className="albion">Albion</span> <span className="highlight">Zerg</span> <span className="manager">Manager</span>
            </h1>
            <p className="developer">Developed by <span className="developer-name">SnowTea</span></p>
          </div>
          <a href="/admin-login" className="admin-login">Admin Login</a>
        </div>
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
            <div className={`event-wrapper ${event.rewards === 'Regearable' ? 'regearable' : 'lootsplit'}`}>
              <div className="event-type">
                <p>{event.rewards}</p>
              </div>
              <div className="event-card">
                <div className="event-details">
                  <p className="date">{moment(event.time).format('dddd, MMMM D - HH:mm [UTC]')}</p>
                  <p className="title">{event.comp.name} - {event.rewards}</p>
                  <p className="details">
                    <span>Comp:</span> {event.comp.name} | <span>Caller:</span> {event.caller} | <span>Hammers:</span> {event.hammers} | <span>Sets:</span> {event.sets}
                  </p>
                </div>
                <div className="event-actions">
                  <Link to={`/signup/${event._id}`} className="button">Sign Up</Link>
                  <Link to={`/view-comp/${event._id}`} className="button">View Comp</Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default LandingPage;
