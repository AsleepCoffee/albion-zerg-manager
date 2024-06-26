import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './SignUp.css';

const SignUp = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [comps, setComps] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [firstPick, setFirstPick] = useState('');
  const [secondPick, setSecondPick] = useState('');
  const [thirdPick, setThirdPick] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(`/api/events/${eventId}`);
        const fetchedEvent = eventResponse.data;
        setEvent(fetchedEvent);

        const compIds = fetchedEvent.partyComps.map(comp => comp._id ? comp._id.toString() : comp.toString());
        const compResponses = await Promise.all(
          compIds.map(compId => axios.get(`/api/comps/${compId}`))
        );
        const fetchedComps = compResponses.map(response => response.data);
        setComps(fetchedComps);

        const signupResponse = await axios.get(`/api/signups/${eventId}`);
        const allSignups = signupResponse.data;

        const initialAssignments = fetchedEvent.assignedRoles || {};
        const populatedAssignments = {};
        for (const party in initialAssignments) {
          populatedAssignments[party] = {};
          for (const roleKey in initialAssignments[party]) {
            const signupName = initialAssignments[party][roleKey].name;
            const roleName = initialAssignments[party][roleKey].role;
            const signup = allSignups.find((s) => s.name === signupName);
            if (signup) {
              const roleIndex = parseInt(roleName.split('-').pop(), 10);
              const compId = compIds[0]; // Assuming single comp for simplicity
              const comp = fetchedComps.find(comp => comp._id === compId);
              if (comp) {
                console.log(`Role Index: ${roleIndex}, Role: ${comp.slots[roleIndex]}`);
                const role = comp.slots[roleIndex];
                populatedAssignments[party][roleKey] = { name: signup.name, role: role };
              }
            }
          }
        }
        setAssignedRoles(populatedAssignments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const getFilteredRoles = (excludedRoles) => {
    const allRoles = comps.flatMap(comp => comp.slots);
    const roleCounts = allRoles.reduce((acc, role) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    const assignedRoleCounts = Object.values(assignedRoles).flatMap(Object.values).reduce((acc, assignedRole) => {
      acc[assignedRole.role] = (acc[assignedRole.role] || 0) + 1;
      return acc;
    }, {});
    const selectedRoleCounts = excludedRoles.reduce((acc, role) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(roleCounts).filter(role => {
      const totalAssigned = (assignedRoleCounts[role] || 0) + (selectedRoleCounts[role] || 0);
      return roleCounts[role] > totalAssigned;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupData = {
      eventId,
      name,
      firstPick,
      secondPick,
      thirdPick,
    };

    try {
      const response = await axios.post('/api/signups', signupData);
      if (response.status === 201) {
        alert('Signed up successfully!');
        navigate(-1);
      } else {
        alert('Failed to sign up.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const renderRoleAssignments = () => {
    const assignments = [];
    for (const party in assignedRoles) {
      for (const roleKey in assignedRoles[party]) {
        const assignment = assignedRoles[party][roleKey];
        const imagePath = `/images/${assignment.role.replace(/\s+/g, '%20')}.png`;
        console.log(`Image Path: ${imagePath}`); // Debugging image path
        assignments.push(
          <div key={`${party}-${roleKey}`} className="assigned-role">
            <img 
              src={imagePath} 
              alt={assignment.role} 
              className="role-image" 
              onError={(e) => e.target.style.display = 'none'} // Hide image if not found
            />
          </div>
        );
      }
    }
    return assignments;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="signup-page specific-signup-page">
      <h1 className="signup-header">Sign Up for Event</h1>
      {event && (
        <div className="event-info">
          <p className="event-rewards">{event.rewards}</p>
          <p className="event-date">{moment(event.time).format('dddd, MMMM D - HH:mm [UTC]')}</p>
          <p className="event-type" style={{ color: '#ffffff', fontSize: '24px', transform: 'none', writingMode: 'horizontal-tb', textAlign: 'left' }}>{event.eventType}</p>
          <p className="event-details">
            <span className="label">Comp:</span> {event.partyComps && event.partyComps.length > 0 ? event.partyComps[0].name : 'N/A'} |
            <span className="label"> Caller:</span> {event.caller} |
            <span className="label"> Hammers:</span> {event.hammers} |
            <span className="label"> Sets:</span> {event.sets}
          </p>
        </div>
      )}
      <div className="signup-and-roles">
        {event && (
          <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="firstPick">First Pick:</label>
                <select
                  id="firstPick"
                  value={firstPick}
                  onChange={(e) => setFirstPick(e.target.value)}
                  required
                  className="input-field"
                >
                  <option value="">Select a Role</option>
                  {getFilteredRoles([secondPick, thirdPick]).map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="secondPick">Second Pick:</label>
                <select
                  id="secondPick"
                  value={secondPick}
                  onChange={(e) => setSecondPick(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a Role</option>
                  {getFilteredRoles([firstPick, thirdPick]).map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="thirdPick">Third Pick:</label>
                <select
                  id="thirdPick"
                  value={thirdPick}
                  onChange={(e) => setThirdPick(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a Role</option>
                  {getFilteredRoles([firstPick, secondPick]).map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="signup-button">Sign Up</button>
            </form>
          </div>
        )}
        <div className="assigned-roles-container-wrapper">
          <h2 className="assigned-roles-title">Assigned Roles</h2>
          <div className="assigned-roles">
            <div className="assigned-roles-container">
              {renderRoleAssignments()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
