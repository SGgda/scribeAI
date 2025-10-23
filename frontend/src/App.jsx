import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DetailsPage from './pages/DetailsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/details" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
