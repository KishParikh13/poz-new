import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Home from './views/Home';
import Note from './views/Note';
import Layout from './views/Layout';
import Settings from './views/Settings';
import { SignInOrUp } from './views/Landing';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<SignInOrUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="notes/:id" element={<Note />} />
        </Routes>
    </Router>
  );
}

export default App;