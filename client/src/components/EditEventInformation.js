import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditEventInformation.css';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';
import "react-datetime/css/react-datetime.css";
import AdminNavBar from './AdminNavBar';

const EditEventInformation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [partyComps, setPartyComps] = useState(['']);
  const [caller, setCaller] = useState('');
  const [hammers, setHammers] = useState('');
  const [sets, setSets] = useState('');
  const [rewards, setRewards] = useState('Loot Split');
  const [parties, setParties] = useState(1);
  const [eventType, setEventType] = useState('');
  const [comps, setComps] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment().utc().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${eventId}`);
        const event = response.data;
        setTime(moment.utc(event.time).format('YYYY-MM-DDTHH:mm:ssZ')); // Parse as UTC and format
        setPartyComps(event.partyComps);
        setCaller(event.caller);
        setHammers(event.hammers);
        setSets(event.sets);
        setRewards(event.rewards);
        setParties(event.parties);
        setEventType(event.eventType);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    const fetchComps = async () => {
      try {
        const response = await axios.get('/api/comps');
        setComps(response.data);
      } catch (error) {
        console.error('Error fetching comps:', error);
      }
    };

    fetchEvent();
    fetchComps();

    const timer = setInterval(() => {
      setCurrentTime(moment().utc().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventId]);

  const handleUpdateEvent = async () => {
    const updatedEvent = {
      time: moment(time).utc().format(), // Ensure time is saved as UTC
      partyComps,
      caller,
      hammers,
      sets,
      rewards,
      parties,
      eventType
    };
    try {
      const response = await axios.put(`/api/events/${eventId}`, updatedEvent);
      if (response.status === 200) {
        alert('Event updated successfully!');
        navigate('/configure-event');
      } else {
        alert('Failed to update event.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const handleCompChange = (index, value) => {
    const updatedComps = [...partyComps];
    updatedComps[index] = value;
    setPartyComps(updatedComps);
  };

  const isValidDate = (current) => {
    return current.isAfter(moment().subtract(1, 'day'));
  };

  return (
    <div className="edit-event-page">
      <AdminNavBar />
      <h1>Edit Event Information</h1>
      <div className="time-container">
        <div className="time-bubble current-time">
          <p>Current UTC Time:</p>
          <p>{currentTime}</p>
        </div>
      </div>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="time">Date and Time (UTC):</label>
          <Datetime
            id="time"
            value={time}
            onChange={setTime}
            isValidDate={isValidDate}
            dateFormat="YYYY-MM-DD"
            timeFormat="HH:mm"
            utc={true} // Ensure Datetime component handles UTC
          />
        </div>
        {[...Array(parties)].map((_, index) => (
          <div key={index} className="form-group">
            <label htmlFor={`comp${index}`}>Party {index + 1} Comp:</label>
            <select
              id={`comp${index}`}
              value={partyComps[index] || ''}
              onChange={(e) => handleCompChange(index, e.target.value)}
            >
              <option value="">Select a Comp</option>
              {comps.map((compItem) => (
                <option key={compItem._id} value={compItem._id}>
                  {compItem.name}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="caller">Caller:</label>
          <input
            type="text"
            id="caller"
            value={caller}
            onChange={(e) => setCaller(e.target.value)}
            placeholder="Enter caller name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="hammers">Hammers:</label>
          <input
            type="text"
            id="hammers"
            value={hammers}
            onChange={(e) => setHammers(e.target.value)}
            placeholder="Enter hammers info"
          />
        </div>
        <div className="form-group">
          <label htmlFor="sets">Sets:</label>
          <input
            type="text"
            id="sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
            placeholder="Enter sets info"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rewards">Rewards:</label>
          <select id="rewards" value={rewards} onChange={(e) => setRewards(e.target.value)}>
            <option value="Loot Split">Loot Split</option>
            <option value="Regearable">Regearable</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="parties">Number of Parties:</label>
          <select
            id="parties"
            value={parties}
            onChange={(e) => {
              const numParties = parseInt(e.target.value);
              setParties(numParties);
              setPartyComps(new Array(numParties).fill(''));
            }}
          >
            {[1, 2, 3, 4, 5].map((number) => (
              <option key={number} value={number}>{number}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="eventType">Type of Event:</label>
          <input
            type="text"
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Enter type of event"
          />
        </div>
      </div>
      <button onClick={handleUpdateEvent}>Update Event</button>
    </div>
  );
};

export default EditEventInformation;
