import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterList from './pages/CharacterList';
import CharacterPage from './pages/CharacterPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterList />} />
        <Route path="/characters/:id" element={<CharacterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
