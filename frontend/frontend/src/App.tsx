import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import FlashcardList from './components/FlashcardList';
import AddFlashcard from './components/AddFlashcard';
import { Flashcard } from './types';

function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get<Flashcard[]>('http://localhost:5000/flashcards');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-800 text-white' : 'bg-gray-100'}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FlashcardList flashcards={flashcards} setFlashcards={setFlashcards} />} />
            <Route path="/add" element={<AddFlashcard setFlashcards={setFlashcards} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;