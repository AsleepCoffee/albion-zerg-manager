import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import ConfigureComps from './components/ConfigureComps';
import SetupEvent from './components/SetupEvent';
import ConfigureEvent from './components/ConfigureEvent';
import ConfigureEventComp from './components/ConfigureEventComp';
import ViewComp from './components/ViewComp';
import SignUp from './components/SignUp';
import EventSignups from './components/EventSignups';
import EditEventInformation from './components/EditEventInformation';
import PlayerLookup from './components/PlayerLookup'; // Import the PlayerLookup component
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/configure-comps" element={<ConfigureComps />} />
          <Route path="/setup-event" element={<SetupEvent />} />
          <Route path="/configure-event" element={<ConfigureEvent />} />
          <Route path="/configure-event-comp/:eventId" element={<ConfigureEventComp />} />
          <Route path="/view-comp/:eventId" element={<ViewComp />} />
          <Route path="/signup/:eventId" element={<SignUp />} />
          <Route path="/event-signups/:eventId" element={<EventSignups />} />
          <Route path="/edit-event-information/:eventId" element={<EditEventInformation />} />
          <Route path="/player-lookup" element={<PlayerLookup />} /> {/* Add the new route here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
