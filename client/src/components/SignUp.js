import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [firstPick, setFirstPick] = useState('');
  const [secondPick, setSecondPick] = useState('');
  const [thirdPick, setThirdPick] = useState('');
  const [event, setEvent] = useState(null);
  const [compSlots, setCompSlots] = useState([]);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventResponse = await axios.get(`/api/events/${eventId}`);
        setEvent(eventResponse.data);

        // Fetch comp details based on event's comp ID
        const compResponse = await axios.get(`/api/comps/${eventResponse.data.comp._id}`);
        setCompSlots(compResponse.data.slots);
      } catch (error) {
        console.error('Error fetching event or comp:', error);
        alert('An error occurred. Please try again.');
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSignUp = { eventId, name, firstPick, secondPick, thirdPick };
      console.log('Submitting signup:', newSignUp); // Log the signup data
      await axios.post('/api/signups', newSignUp); // Ensure this URL matches the backend route
      setIsSignedUp(true);
      setTimeout(() => {
        navigate(-1); // Go back to the previous page
      }, 2000); // Adjust the timeout duration as needed
    } catch (error) {
      console.error('Error submitting signup:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const getAvailableSlots = (excludeSlots) => {
    return compSlots.filter(slot => !excludeSlots.includes(slot));
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div className="sign-up-page">
      <h1>Sign Up for {event.comp.name}</h1>
      {isSignedUp ? (
        <div className="success-message">
          Signup successful! Redirecting...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="firstPick">First Pick:</label>
            <select
              id="firstPick"
              value={firstPick}
              onChange={(e) => setFirstPick(e.target.value)}
              required
            >
              <option value="" disabled>Select your first pick</option>
              {getAvailableSlots([secondPick, thirdPick]).map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="secondPick">Second Pick:</label>
            <select
              id="secondPick"
              value={secondPick}
              onChange={(e) => setSecondPick(e.target.value)}
              required
            >
              <option value="" disabled>Select your second pick</option>
              {getAvailableSlots([firstPick, thirdPick]).map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="thirdPick">Third Pick:</label>
            <select
              id="thirdPick"
              value={thirdPick}
              onChange={(e) => setThirdPick(e.target.value)}
              required
            >
              <option value="" disabled>Select your third pick</option>
              {getAvailableSlots([firstPick, secondPick]).map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="sign-up-button">Sign Up</button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
