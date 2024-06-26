import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './EventSignups.css';

const EventSignups = () => {
  const { eventId } = useParams();
  const [signups, setSignups] = useState([]);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const signupResponse = await axios.get(`/api/signups/${eventId}`);
        setSignups(signupResponse.data);

        const eventResponse = await axios.get(`/api/events/${eventId}`);
        setEvent(eventResponse.data);
      } catch (error) {
        console.error('Error fetching signups:', error);
      }
    };

    fetchSignups();
  }, [eventId]);

  const handleDelete = async (signupId) => {
    try {
      console.log(`Deleting signup with ID: ${signupId}`);
      await axios.delete(`/api/signups/${signupId}`);
      setSignups(signups.filter((signup) => signup._id !== signupId));

      // Update the event state to reflect the removed signup from assigned roles
      const updatedEvent = { ...event };
      for (const party in updatedEvent.assignedRoles) {
        for (const role in updatedEvent.assignedRoles[party]) {
          if (updatedEvent.assignedRoles[party][role] && updatedEvent.assignedRoles[party][role]._id === signupId) {
            console.log(`Removing role ${role} from party ${party} for signup ${signupId}`);
            delete updatedEvent.assignedRoles[party][role];
          }
        }
      }
      setEvent(updatedEvent);
      console.log('Updated event state:', updatedEvent);
    } catch (error) {
      console.error('Error deleting signup:', error);
      alert('An error occurred while deleting the signup.');
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-signups-page">
      <h1>Signups for {event.eventType} Event</h1>
      <div className="signups-list">
        {signups.map((signup) => (
          <div key={signup._id} className="signup-item">
            <p><strong>Name:</strong> {signup.name}</p>
            <p><strong>First Pick:</strong> {signup.firstPick}</p>
            <p><strong>Second Pick:</strong> {signup.secondPick}</p>
            <p><strong>Third Pick:</strong> {signup.thirdPick}</p>
            <p><strong>Assigned Role:</strong> {getAssignedRole(signup.name, event.assignedRoles)}</p>
            <button className="button delete-btn" onClick={() => handleDelete(signup._id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const getAssignedRole = (name, assignedRoles) => {
  for (const party in assignedRoles) {
    for (const role in assignedRoles[party]) {
      if (assignedRoles[party][role].name === name) {
        return role.replace(/_/g, '.');
      }
    }
  }
  return 'None';
};

export default EventSignups;
