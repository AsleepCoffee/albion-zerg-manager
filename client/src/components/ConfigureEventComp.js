import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './ConfigureEventComp.css';

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
            <div className="signup-role">{role}</div>
          </div>
          <button className="remove-button" onClick={() => onRemoveSignup(party, role)}>
            X
          </button>
        </>
      ) : (
        role
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
  const [comp, setComp] = useState(null);
  const [signups, setSignups] = useState([]);
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

        const signupResponse = await axios.get(`/api/signups/${eventId}`);
        const allSignups = signupResponse.data;

        const initialAssignments = fetchedEvent.assignedRoles || {};
        console.log('Initial assignments:', initialAssignments); // Debug log

        // Populate assignedRoles with full signup data
        const populatedAssignments = {};
        for (const party in initialAssignments) {
          populatedAssignments[party] = {};
          for (const role in initialAssignments[party]) {
            const signupId = initialAssignments[party][role];
            const signup = allSignups.find((s) => s._id === signupId);
            if (signup) {
              populatedAssignments[party][role] = signup;
            }
          }
        }
        setAssignedRoles(populatedAssignments);

        // Filter out already assigned signups
        const unassignedSignups = allSignups.filter(
          (signup) =>
            !Object.values(populatedAssignments).some((party) =>
              Object.values(party).some((assignedSignup) => assignedSignup._id === signup._id)
            )
        );
        setSignups(unassignedSignups);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [eventId]);

  useEffect(() => {
    console.log('Loaded event:', event);
    console.log('Loaded signups:', signups);
    console.log('Loaded assigned roles:', assignedRoles);

    if (event && signups.length > 0) {
      const assigned = { ...assignedRoles };
      Object.keys(assigned).forEach((partyKey) => {
        Object.keys(assigned[partyKey]).forEach((roleKey) => {
          const signup = assigned[partyKey][roleKey];
          if (signup) {
            setSignups((prevSignups) => prevSignups.filter((s) => s._id !== signup._id));
          }
        });
      });
      setAssignedRoles(assigned);
    }
  }, [event, signups, assignedRoles]);

  const handleDropSignup = (party, role, signup) => {
    console.log('Handling drop signup:', { party, role, signup });
    if (party && role) {
      setAssignedRoles((prev) => ({
        ...prev,
        [party]: {
          ...prev[party],
          [role]: signup,
        },
      }));
      setSignups((prev) => prev.filter((s) => s._id !== signup._id));
    } else {
      // Handle unassigned drop zone
      setAssignedRoles((prev) => {
        const newAssignedRoles = { ...prev };
        Object.keys(newAssignedRoles).forEach((partyKey) => {
          Object.keys(newAssignedRoles[partyKey]).forEach((roleKey) => {
            if (newAssignedRoles[partyKey][roleKey] && newAssignedRoles[partyKey][roleKey]._id === signup._id) {
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
          transformedAssignments[party][role] = assignedRoles[party][role]._id;
        }
      }
      await axios.put(`/api/events/${eventId}/assignments`, { assignedRoles: transformedAssignments });
      alert('Assignments saved successfully!');
    } catch (error) {
      console.error('Error saving assignments:', error);
      alert('An error occurred while saving assignments.');
    }
  };

  const renderRoleSquares = (party, roles) => {
    return roles.map((role, index) => (
      <RoleSquare
        key={index}
        party={party}
        role={role}
        assignedSignup={assignedRoles[party] ? assignedRoles[party][role] : null}
        onDropSignup={handleDropSignup}
        onRemoveSignup={handleUnassignSignup}
      />
    ));
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
    <DndProvider backend={HTML5Backend}>
      <div className="configure-comp-page">
        <h1>Configure Comp for Event</h1>
        <h2>{comp.name}</h2>
        <UnassignedDropZone onDropSignup={handleDropSignup}>
          <div className="unassigned-container">
            {signups.map((signup) => (
              <SignupSquare key={signup._id} signup={signup} />
            ))}
          </div>
        </UnassignedDropZone>
        {renderParties(event.parties, comp.slots)}
        <button className="save-button" onClick={handleSaveAssignments}>Save Assignments</button>
      </div>
    </DndProvider>
  );
};

export default ConfigureEventComp;
