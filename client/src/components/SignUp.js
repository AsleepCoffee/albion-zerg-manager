import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState('');
  const [firstPick, setFirstPick] = useState('');
  const [secondPick, setSecondPick] = useState('');
  const [thirdPick, setThirdPick] = useState('');
  const [roles, setRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(`/api/events/${eventId}`);
        const fetchedEvent = eventResponse.data;
        setEvent(fetchedEvent);

        const compResponses = await Promise.all(
          fetchedEvent.partyComps.map(comp => axios.get(`/api/comps/${comp._id}`))
        );
        const fetchedComps = compResponses.map(response => response.data);

        const allRoles = fetchedComps.flatMap(comp => comp.slots);
        setRoles(allRoles);

        const assignedRolesList = [];
        for (const party in fetchedEvent.assignedRoles) {
          for (const role in fetchedEvent.assignedRoles[party]) {
            assignedRolesList.push({
              party,
              role,
              name: fetchedEvent.assignedRoles[party][role].name,
            });
          }
        }
        setAssignedRoles(assignedRolesList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

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
        navigate(-1);  // Go back to the previous page
      } else {
        alert('Failed to sign up.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  const filteredRoles = (role) => {
    return !assignedRoles.some(assignedRole => assignedRole.role === role);
  };

  return (
    <div className="signup-page">
      <h1>Sign Up for Event</h1>
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
                {roles.filter(filteredRoles).map((role, index) => (
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
                {roles.filter(filteredRoles).map((role, index) => (
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
                {roles.filter(filteredRoles).map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
          <div className="assigned-roles">
            <h2>Assigned Roles</h2>
            <div className="assigned-roles-container">
              {assignedRoles.map((assignedRole, index) => (
                <div key={index} className="assigned-role">
                  <span className="role-name">{assignedRole.role}</span>
                  <span className="role-party">Party: {assignedRole.party}</span>
                  <span className="role-assigned">Assigned to: {assignedRole.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
