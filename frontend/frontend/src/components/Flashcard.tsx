import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flashcard as FlashcardType } from '../types';

interface FlashcardProps {
  flashcard: FlashcardType;
  onAnswer: (correct: boolean) => void;
}

const FlashcardComponent: React.FC<FlashcardProps> = ({ flashcard, onAnswer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct);
    setShowAnswer(false);
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 cursor-pointer"
      onClick={handleFlip}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-xl mb-4">
        {showAnswer ? flashcard.answer : flashcard.question}
      </div>
      {showAnswer && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => handleAnswer(false)}
          >
            Got it wrong
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => handleAnswer(true)}
          >
            Got it right
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default FlashcardComponent;

