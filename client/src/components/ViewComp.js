import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewComp.css';

const ViewComp = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [comps, setComps] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState({});

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
              populatedAssignments[party][roleKey] = { name: signup.name, role: roleName };
            }
          }
        }
        setAssignedRoles(populatedAssignments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

  const renderRoleSquares = (party, roles) => {
    return roles.map((role, index) => {
      const uniqueRoleKey = `${party}-role-${index}`; // Use the same unique key generation logic
      const assignedSignup = assignedRoles[party] ? assignedRoles[party][uniqueRoleKey] : null;
      return (
        <div
          key={index}
          className="role-square"
          style={{
            backgroundColor: assignedSignup ? 'lightgreen' : 'white',
            border: '1px dashed black',
            color: assignedSignup ? 'black' : 'black',
          }}
        >
          {assignedSignup ? (
            <div className="signup-details">
              <div className="signup-name">{assignedSignup.name}</div>
              <div className="signup-role">{role}
              </div>
            </div>
          ) : (
            role // Directly display the role name
          )}
        </div>
      );
    });
  };

  const renderParties = (numParties, comps) => {
    const parties = [];
    for (let i = 0; i < numParties; i++) {
      parties.push(
        <div key={i} className="party-container">
          <h2>Party {i + 1}</h2>
          <div className="roles-container">
            {renderRoleSquares(`party${i + 1}`, comps[i].slots)}
          </div>
        </div>
      );
    }
    return parties;
  };

  if (!event || comps.length === 0) {
    return <div>Loading event and comp data...</div>;
  }

  return (
    <div className="view-comp-page">
      <h1>View Comp for {event.eventType}</h1>
      <h2>{new Date(event.time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} - {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</h2>
      {renderParties(event.parties, comps)}
    </div>
  );
};

export default ViewComp;
