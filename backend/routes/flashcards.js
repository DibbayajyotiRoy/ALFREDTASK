import express from "express";
import Flashcard from "../models/Flashcard.js";

const router = express.Router();

// POST /flashcards - Add a new flashcard
router.post("/", async (req, res) => {
  console.log("POST /flashcards: Received request", req.body); // Log the request body

  try {
    const newFlashcard = new Flashcard(req.body);
    const savedFlashcard = await newFlashcard.save();

    console.log("POST /flashcards: Flashcard saved", savedFlashcard); // Log the saved object

    res.status(201).json(savedFlashcard);
  } catch (error) {
    console.error("POST /flashcards: Error saving flashcard", error);
    res.status(400).json({ message: error.message });
  }
});

// GET /flashcards - Get all flashcards
router.get("/", async (req, res) => {
  console.log("GET /flashcards: Received request"); // Log the get Request.
  try {
    const flashcards = await Flashcard.find();
    console.log("GET /flashcards: Retrieved flashcards", flashcards); // Log the retrieved flashcards.
    res.json(flashcards);
  } catch (error) {
    console.error("GET /flashcards: Error fetching flashcards", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /flashcards/:id - Update a flashcard
router.put("/:id", async (req, res) => {
  console.log(`PUT /flashcards/${req.params.id}: Received request`, req.body);

  try {
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(`PUT /flashcards/${req.params.id}: Flashcard updated`, updatedFlashcard);
    res.json(updatedFlashcard);
  } catch (error) {
    console.error(`PUT /flashcards/${req.params.id}: Error updating flashcard`, error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE /flashcards/:id - Delete a flashcard
router.delete("/:id", async (req, res) => {
  console.log(`DELETE /flashcards/${req.params.id}: Received request`);

  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    console.log(`DELETE /flashcards/${req.params.id}: Flashcard deleted`);
    res.json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    console.error(`DELETE /flashcards/${req.params.id}: Error deleting flashcard`, error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
