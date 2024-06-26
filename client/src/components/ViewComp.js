import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewComp.css';

const ViewComp = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [comp, setComp] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(`/api/events/${eventId}`);
        const fetchedEvent = eventResponse.data;
        setEvent(fetchedEvent);

        const compId = fetchedEvent.comp._id.toString();
        const compResponse = await axios.get(`/api/comps/${compId}`);
        setComp(compResponse.data);

        // Fetch all signups for the event
        const signupResponse = await axios.get(`/api/signups/${eventId}`);
        const allSignups = signupResponse.data;

        // Create a map of signup IDs to signup details
        const signupMap = {};
        allSignups.forEach(signup => {
          signupMap[signup._id] = signup;
        });

        const initialAssignments = fetchedEvent.assignedRoles || {};
        console.log('Initial assignments:', initialAssignments); // Debug log

        // Populate assignedRoles with full signup data
        const populatedAssignments = {};
        for (const party in initialAssignments) {
          populatedAssignments[party] = {};
          for (const role in initialAssignments[party]) {
            const signupId = initialAssignments[party][role].name; // Get signup ID
            const signup = signupMap[signupId];
            if (signup) {
              populatedAssignments[party][role] = signup;
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
      const safeRole = role.replace(/\./g, '_'); // Transform role name for lookup
      const assignedSignup = assignedRoles[party] ? assignedRoles[party][safeRole] : null;
      console.log(`Rendering role ${role} for party ${party}:`, assignedSignup); // Debug log
      return (
        <div key={index} className="role-square" style={{ backgroundColor: assignedSignup ? 'lightgreen' : 'white', border: '1px dashed black', color: assignedSignup ? 'black' : 'black' }}>
          {assignedSignup ? (
            <>
              <div className="signup-details">
                <div className="signup-name">{assignedSignup.name} - {role.replace(/_/g, '.')}</div> {/* Replace underscores with dots */}
              </div>
            </>
          ) : (
            role.replace(/_/g, '.') // Replace underscores with dots
          )}
        </div>
      );
    });
  };

  const renderParties = (numParties, roles) => {
    const parties = [];
    for (let i = 1; i <= numParties; i++) {
      parties.push(
        <div key={i} className="party-container">
          <h2>Party {i}</h2>
          <div className="roles-container">
            {renderRoleSquares(`party${i}`, roles)}
          </div>
        </div>
      );
    }
    return parties;
  };

  if (!event || !comp) {
    return <div>Loading event and comp data...</div>;
  }

  return (
    <div className="view-comp-page">
      <h1>View Comp for Event</h1>
      <h2>{new Date(event.time).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} - {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</h2>
      <h2>{comp.name}</h2>
      {renderParties(event.parties, comp.slots)}
    </div>
  );
};

export default ViewComp;
