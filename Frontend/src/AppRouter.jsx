// src/AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Accounts from './Pages/Accounts';
// import WhatIsFinanceTracker from './Pages/WhatIsFinanceTracker';
// import Learn from './Pages/Learn';
// import Share from './Pages/Share';
// import Team from './Pages/Team';
// import Contact from './Pages/Contact';

function AppRouter() {
  return (
    <Router>
      <div>
        {/* <Header /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard/>}/>          
          <Route path="/accounts" element={<Accounts/>}/>          
      {/* <Route path="/what-is-finance-tracker" element={<WhatIsFinanceTracker />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/share" element={<Share />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default AppRouter;