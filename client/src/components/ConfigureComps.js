import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavBar from './AdminNavBar';
import './ConfigureComps.css';

const ConfigureComp = () => {
  const [compName, setCompName] = useState('');
  const [slots, setSlots] = useState(Array(20).fill(''));
  const [comps, setComps] = useState([]);
  const [editingCompId, setEditingCompId] = useState(null);

  useEffect(() => {
    const fetchComps = async () => {
      try {
        const response = await axios.get('/api/comps');
        setComps(response.data);
      } catch (error) {
        console.error('Error fetching comps:', error);
      }
    };

    fetchComps();
  }, []);

  const handleSlotChange = (index, value) => {
    const newSlots = [...slots];
    newSlots[index] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const compData = { name: compName, slots };

    try {
      if (editingCompId) {
        await axios.put(`/api/comps/${editingCompId}`, compData);
        alert('Comp updated successfully!');
      } else {
        await axios.post('/api/comps', compData);
        alert('Comp created successfully!');
      }
      // Clear form after submission
      setCompName('');
      setSlots(Array(20).fill(''));
      setEditingCompId(null);
      // Fetch updated comps
      const response = await axios.get('/api/comps');
      setComps(response.data);
    } catch (error) {
      console.error('Error saving comp:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleEdit = (comp) => {
    setCompName(comp.name);
    setSlots(comp.slots);
    setEditingCompId(comp._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/comps/${id}`);
      alert('Comp deleted successfully!');
      // Fetch updated comps
      const response = await axios.get('/api/comps');
      setComps(response.data);
    } catch (error) {
      console.error('Error deleting comp:', error.response ? error.response.data : error.message);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="configure-comp-page">
      <AdminNavBar />
      <h1>Configure Comp</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="compName">Comp Name:</label>
          <input
            type="text"
            id="compName"
            value={compName}
            onChange={(e) => setCompName(e.target.value)}
            required
          />
        </div>
        <div className="slots-grid">
          {slots.map((slot, index) => (
            <div key={index} className="slot-input">
              <label htmlFor={`slot-${index}`}>Slot {index + 1}:</label>
              <input
                type="text"
                id={`slot-${index}`}
                value={slot}
                onChange={(e) => handleSlotChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>
        <button type="submit">Save Comp</button>
      </form>
      <h2>Existing Comps</h2>
      <ul>
        {comps.map((comp) => (
          <li key={comp._id}>
            {comp.name}
            <button onClick={() => handleEdit(comp)}>Edit</button>
            <button onClick={() => handleDelete(comp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConfigureComp;
