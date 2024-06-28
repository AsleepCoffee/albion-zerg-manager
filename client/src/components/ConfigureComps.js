import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavBar from './AdminNavBar';
import './ConfigureComps.css';

// Define the list of roles
const roleNames = [
  'Arcane Staff', 'Astral Staff', 'Battleaxe', 'Battle Bracers', 'Bear Paws', 'Bedrock Mace', 'Black Monk Stave',
  'Blazing Staff', 'Blight Staff', 'Bloodletter', 'Bloodmoon Staff', 'Boltcasters', 'Bow of Badon', 'Bow', 'Brawler Gloves',
  'Bridled Fury', 'Brimstone Staff', 'Broadsword', 'Camlann Mace', 'Carrioncaller', 'Carving Sword', 'Chillhowl', 'Clarent Blade',
  'Claws', 'Claymore', 'Crossbow', 'Cursed Skull', 'Cursed Staff', 'Dagger Pair', 'Dagger', 'Damnation Staff', 'Dawnsong', 
  'Daybreaker', 'Deathgivers', 'Demonfang', 'Demonic Staff', 'Divine Staff', 'Double Bladed Staff', 'Druidic Staff', 'Dual Swords',
  'Earthrune Staff', 'Energy Shaper', 'Enigmatic Staff', 'Evensong', 'Fallen Staff', 'Fire Staff', 'Fists of Avalon', 'Forge Hammers',
  'Frost Staff', 'Galatine Pair', 'Glacial Staff', 'Glaive', 'Grailseeker', 'Great Arcane Staff', 'Greataxe', 'Great Cursed Staff',
  'Great Fire Staff', 'Great Frost Staff', 'Great Hammer', 'Great Holy Staff', 'Great Nature Staff', 'Grovekeeper', 'Halberd',
  'Hallowfall', 'Hammer', 'Hand of Justice', 'Heavy Crossbow', 'Heavy Mace', 'Hellfire Hands', 'Hellspawn Staff', 'Heron Spear',
  'Hoarfrost Staff', 'Holy Staff', 'Icicle Staff', 'Incubus Mace', 'Infernal Scythe', 'Infernal Staff', 'Infinity Blade', 'Iron-clad Staff',
  'Ironroot Staff', 'Kingmaker', 'Lifecurse Staff', 'Lifetouch Staff', 'Lightcaller', 'Light Crossbow', 'Longbow', 'Mace',
  'Malevolent Locus', 'Mistpiercer', 'Morning Star', 'Nature Staff', 'Oathkeepers', 'Occult Staff', 'Permafrost Prism', 'Pike', 
  'Polehammer', 'Primal Staff', 'Prowling Staff', 'Quarterstaff', 'Rampant Staff', 'Ravenstrike Cestus', 'Realmbreaker', 'Redemption Staff',
  'Rift Glaive', 'Rootbound Staff', 'Shadowcaller', 'Siegebow', 'Soulscythe', 'Spear', 'Spiked Gauntlets', 'Spirithunter',
  'Staff of Balance', 'Tombhammer', 'Trinity Spear', 'Ursine Maulers', 'Wailing Bow', 'Warbow', 'Weeping Repeater', 'Whispering Bow',
  'Wildfire Staff', 'Wild Staff', 'Witchwork Staff'
];

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
              <select
                id={`slot-${index}`}
                value={slot}
                onChange={(e) => handleSlotChange(index, e.target.value)}
                required
              >
                <option value="">Select a role</option>
                {roleNames.map((role, roleIndex) => (
                  <option key={roleIndex} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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
