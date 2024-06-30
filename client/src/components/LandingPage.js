import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(moment().utc().format('YYYY-MM-DD HH:mm:ss'));
  const [events, setEvents] = useState([]);
  const [timeUntilNextEvent, setTimeUntilNextEvent] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        const sortedEvents = response.data.sort((a, b) => new Date(a.time) - new Date(b.time));
        setEvents(sortedEvents);
        console.log('Fetched Events:', sortedEvents);
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

  useEffect(() => {
    if (events.length > 0) {
      const calculateTimeUntilNextEvent = () => {
        const nextEventTime = moment.utc(events[0].time);
        const now = moment.utc();
        const duration = moment.duration(nextEventTime.diff(now));
        console.log('Next Event Time:', nextEventTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log('Current Time:', now.format('YYYY-MM-DD HH:mm:ss'));
        console.log('Duration:', duration.days(), 'd', duration.hours(), 'h', duration.minutes(), 'm', duration.seconds(), 's');
        setTimeUntilNextEvent(`${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`);
      };

      calculateTimeUntilNextEvent();
      const countdownTimer = setInterval(calculateTimeUntilNextEvent, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [events]);

  useEffect(() => {
    console.log('Current Time:', currentTime);
    console.log('Time Until Next Event:', timeUntilNextEvent);
  }, [currentTime, timeUntilNextEvent]);

  return (
    <div className="landing-page">
      <header>
        <div className="header-content">
          <div className="title-section">
            <h1>
              <span style={{ color: 'white' }}>Albion</span> <span className="highlight">Zerg</span> <span style={{ color: 'white' }}>Manager</span>
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
        <div className="time-bubble next-event-time">
          <p>Time Until Next Event:</p>
          <p>{timeUntilNextEvent ? timeUntilNextEvent : 'No upcoming events'}</p>
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
                  <p className="date">{moment.utc(event.time).format('dddd, MMMM D - HH:mm [UTC]')}</p>
                  <p className="title">{event.eventType}</p>
                  {event.partyComps && event.partyComps.length > 0 && (
                    <p className="details">
                      <span>Comp:</span> {event.partyComps[0].name} | <span>Caller:</span> {event.caller} | <span>Hammers:</span> {event.hammers} | <span>Sets:</span> {event.sets}
                    </p>
                  )}
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
