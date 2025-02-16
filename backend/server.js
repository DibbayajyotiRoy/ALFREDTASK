import express from "express";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";
import flashcardRoutes from "./routes/flashcards.js";  // Corrected import

// ----------------------------------------------------------------------------
// 1. Configuration
// ----------------------------------------------------------------------------

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;  // Get from environment

// ----------------------------------------------------------------------------
// 2. Logging Setup (Winston)
// ----------------------------------------------------------------------------

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }),
    ],
});

// ----------------------------------------------------------------------------
// 3. Database Connection (Mongoose)
// ----------------------------------------------------------------------------

const connectToDatabase = async () => {
    if (!MONGO_URI) {
        logger.error("MongoDB connection string (MONGO_URI) is missing!");
        process.exit(1); // Exit if no connection string is provided
    }

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000,        // Increase connection timeout
            socketTimeoutMS: 45000,         // Increase socket timeout
        });
        logger.info('MongoDB connected SUCCESSFULLY');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if DB connection fails
    }
};

// ----------------------------------------------------------------------------
// 4. Middleware Setup
// ----------------------------------------------------------------------------

app.use(cors());                // Enable CORS
app.use(express.json());        // Parse JSON request bodies

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: 100,                    // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,      // Use standard rate limit headers
    legacyHeaders: false,       // Don't use legacy headers
});
app.use(limiter);             // Apply rate limiting to all routes

// ----------------------------------------------------------------------------
// 5. Routing
// ----------------------------------------------------------------------------

app.use('/flashcards', flashcardRoutes); // Use the flashcard routes

// ----------------------------------------------------------------------------
// 6. Error Handling
// ----------------------------------------------------------------------------

// 404 Route Handler
app.use((req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'ROUTE NOT FOUND',
    });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled application error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

// ----------------------------------------------------------------------------
// 7. Server Startup
// ----------------------------------------------------------------------------

const startServer = async () => {
    try {
        await connectToDatabase();      // First, connect to the database
        app.listen(PORT, () => {
            logger.info(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Server startup failed:', error);
    }
};

startServer();
