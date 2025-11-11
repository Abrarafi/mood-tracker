const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes");
const chatRouter = require("./routes/chat.routes");
const moodRouter = require("./routes/mood.routes");
const activityRouter = require("./routes/activity.routes");
let logger;
try {
  logger = require("./config/logger");
} catch (e) {
  logger = console;
}

dotenv.config();

const app = express();

app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",               // local dev (Next.js)
  "https://soulcare-ai-xwl3.vercel.app",    // replace with your actual Vercel domain
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true, // allow cookies
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API routes
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);

// Basic error handler
app.use((err, req, res, next) => {
  logger.error("Unhandled error", err);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
