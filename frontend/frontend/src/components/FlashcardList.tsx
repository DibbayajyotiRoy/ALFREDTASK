import React, { useState } from 'react';
import axios from 'axios';
import FlashcardComponent from './Flashcard'; 
import { Flashcard } from '../types'; 

interface FlashcardListProps {
    flashcards: Flashcard[];
    setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
}

function FlashcardList({ flashcards, setFlashcards }: FlashcardListProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleAnswer = async (correct: boolean) => {
        // ... your existing handleAnswer logic
    };

    if (flashcards.length === 0) {
        return <div className="text-center">No flashcards available. Add some to get started!</div>;
    }

    return (
        <div className="max-w-md mx-auto">
            <FlashcardComponent // Use FlashcardComponent here
                flashcard={flashcards[currentIndex]}
                onAnswer={handleAnswer} // Pass the onAnswer prop
            />
            <div className="mt-4 text-center">
                Card {currentIndex + 1} of {flashcards.length}
            </div>
        </div>
    );
}

export default FlashcardList;
