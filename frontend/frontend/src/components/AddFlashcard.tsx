import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Flashcard } from '../types';

interface AddFlashcardProps {
    setFlashcards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
}

const AddFlashcard: React.FC<AddFlashcardProps> = ({ setFlashcards }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);  // Start loading state
        setSaveSuccess(false); // Reset success state

        try {
            const response = await axios.post<Flashcard>('http://localhost:5000/flashcards', { question, answer });
            setFlashcards(prevFlashcards => [...prevFlashcards, response.data]);
            setSaveSuccess(true); // Set success state
            setQuestion(''); // Clear input fields
            setAnswer('');
        } catch (error) {
            console.error('Error adding flashcard:', error);
            setSaveSuccess(false); // Ensure success state is false on error
        } finally {
            setIsSaving(false); // End loading state
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Flashcard</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="question" className="block mb-2">Question:</label>
                    <input
                        type="text"
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="answer" className="block mb-2">Answer:</label>
                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={isSaving}
                >
                    {isSaving ? 'Adding...' : 'Add Flashcard'}
                </button>

                {saveSuccess && (
                    <div className="mt-4 text-green-500">Flashcard added successfully!</div>
                )}
            </form>
        </div>
    );
}

export default AddFlashcard;
