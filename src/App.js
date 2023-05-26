import React, { useEffect, useState } from 'react';
import Home from './views/Home';
import Note from './views/Note';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Layout from './views/Layout';

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="notes/:id" element={<Note />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;