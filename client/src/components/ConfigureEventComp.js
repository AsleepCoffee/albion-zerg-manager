import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './ConfigureEventComp.css';
import AdminNavBar from './AdminNavBar'; // Import the AdminNavBar component

const ItemTypes = {
  SIGNUP: 'signup',
};

const SignupSquare = ({ signup }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SIGNUP,
    item: { signup },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="role-square"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'lightblue',
        cursor: 'move',
      }}
    >
      <div className="signup-details">
        <div className="signup-name">{signup.name}</div>
        <div className="signup-roles">
          {signup.firstPick} <br />
          {signup.secondPick} <br />
          {signup.thirdPick}
        </div>
      </div>
    </div>
  );
};

const RoleSquare = ({ party, role, assignedSignup, onDropSignup, onRemoveSignup }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.SIGNUP,
    drop: (item) => {
      console.log(`Dropped ${item.signup.name} into ${party} - ${role}`);
      onDropSignup(party, role, item.signup);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="role-square"
      style={{
        backgroundColor: assignedSignup ? 'lightgreen' : isOver ? 'lightyellow' : 'white',
        border: '1px dashed black',
        color: assignedSignup ? 'black' : 'black',
      }}
    >
      {assignedSignup ? (
        <>
          <div className="signup-details">
            <div className="signup-name">{assignedSignup.name}</div>
            <div className="signup-role">{assignedSignup.role}</div>
          </div>
          <button className="remove-button" onClick={() => onRemoveSignup(party, role)}>
            X
          </button>
        </>
      ) : (
        role.replace(/_/g, '.')
      )}
    </div>
  );
};

const UnassignedDropZone = ({ onDropSignup, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.SIGNUP,
    drop: (item) => {
      console.log(`Dropped ${item.signup.name} into unassigned`);
      onDropSignup(null, null, item.signup);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="unassigned-dropzone"
      style={{
        backgroundColor: isOver ? 'lightyellow' : 'white',
        border: '1px dashed black',
        padding: '10px',
        minHeight: '100px',
      }}
    >
      {children}
    </div>
  );
};

const ConfigureEventComp = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [comps, setComps] = useState([]);
  const [signups, setSignups] = useState([]);
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
          for (const role in initialAssignments[party]) {
            const signupName = initialAssignments[party][role].name;
            const roleName = initialAssignments[party][role].role;
            const signup = allSignups.find((s) => s.name === signupName);
            if (signup) {
              populatedAssignments[party][role] = { name: signup.name, role: roleName, ...signup };
            }
          }
        }
        setAssignedRoles(populatedAssignments);

        const unassignedSignups = allSignups.filter(
          (signup) =>
            !Object.values(populatedAssignments).some((party) =>
              Object.values(party).some((assignedSignup) => assignedSignup.name === signup.name)
            )
        );
        setSignups(unassignedSignups);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDropSignup = (party, role, signup) => {
    console.log('Handling drop signup:', { party, role, signup });
    if (party && role) {
      setAssignedRoles((prev) => ({
        ...prev,
        [party]: {
          ...prev[party],
          [role]: { name: signup.name, role, firstPick: signup.firstPick, secondPick: signup.secondPick, thirdPick: signup.thirdPick },
        },
      }));
      setSignups((prev) => prev.filter((s) => s._id !== signup._id));
    } else {
      setAssignedRoles((prev) => {
        const newAssignedRoles = { ...prev };
        Object.keys(newAssignedRoles).forEach((partyKey) => {
          Object.keys(newAssignedRoles[partyKey]).forEach((roleKey) => {
            if (newAssignedRoles[partyKey][roleKey] && newAssignedRoles[partyKey][roleKey].name === signup.name) {
              delete newAssignedRoles[partyKey][roleKey];
            }
          });
        });
        return newAssignedRoles;
      });
      setSignups((prev) => [...prev, signup]);
    }
  };

  const handleUnassignSignup = (party, role) => {
    const signup = assignedRoles[party][role];
    console.log('Unassigning signup:', { party, role, signup });
    setAssignedRoles((prev) => {
      const newAssignedRoles = { ...prev };
      delete newAssignedRoles[party][role];
      return newAssignedRoles;
    });
    setSignups((prev) => [...prev, signup]);
  };

  const handleSaveAssignments = async () => {
    try {
      console.log('Saving assignments:', assignedRoles); // Debug log
      const transformedAssignments = {};
      for (const party in assignedRoles) {
        transformedAssignments[party] = {};
        for (const role in assignedRoles[party]) {
          if (assignedRoles[party][role]) {
            const safeRole = role.replace(/\./g, '_'); // Transform role name
            transformedAssignments[party][safeRole] = assignedRoles[party][role];
          }
        }
      }
      console.log('Transformed assignments before saving:', JSON.stringify(transformedAssignments, null, 2)); // Debug log
      await axios.put(`/api/events/${eventId}/assignments`, { assignedRoles: transformedAssignments });
      alert('Assignments saved successfully!');
    } catch (error) {
      console.error('Error saving assignments:', error);
      alert('An error occurred while saving assignments.');
    }
  };

  const renderRoleSquares = (party, roles) => {
    return roles.map((role, index) => {
      const safeRole = role.replace(/\./g, '_'); // Transform role name for lookup
      return (
        <RoleSquare
          key={index}
          party={party}
          role={safeRole}
          assignedSignup={assignedRoles[party] ? assignedRoles[party][safeRole] : null}
          onDropSignup={handleDropSignup}
          onRemoveSignup={handleUnassignSignup}
        />
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
    <DndProvider backend={HTML5Backend}>
      <div className="configure-comp-page">
        <AdminNavBar /> {/* Include the AdminNavBar component */}
        <h1>Configure Comp for Event</h1>
        <UnassignedDropZone onDropSignup={handleDropSignup}>
          <div className="unassigned-container">
            {signups.map((signup) => (
              <SignupSquare key={signup._id} signup={signup} />
            ))}
          </div>
        </UnassignedDropZone>
        {renderParties(event.parties, comps)}
        <button className="save-button" onClick={() => {
          console.log('Save button clicked'); // Add this log to verify the button click
          handleSaveAssignments();
        }}>Save Assignments</button>
      </div>
    </DndProvider>
  );
};

export default ConfigureEventComp;
