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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
