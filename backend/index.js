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

// Debug middleware to log cookies and headers
app.use((req, res, next) => {
  console.log(`\n[REQUEST] ${req.method} ${req.originalUrl}`);
  console.log(`[ORIGIN] ${req.headers.origin || 'no origin header'}`);
  console.log(`[COOKIES RECEIVED] accessToken: ${req.cookies.accessToken ? 'YES ✓' : 'NO ✗'}, refreshToken: ${req.cookies.refreshToken ? 'YES ✓' : 'NO ✗'}`);
  
  // Intercept response to log cookies being set
  const originalSetHeader = res.setHeader;
  res.setHeader = function(name, value) {
    if (name.toLowerCase() === 'set-cookie') {
      console.log(`[COOKIES SET] ${Array.isArray(value) ? value.join(', ') : value}`);
    }
    return originalSetHeader.call(this, name, value);
  };
  
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Cookie test endpoint for debugging
app.get("/test-cookie", (req, res) => {
  // Set a test cookie
  res.cookie('testCookie', 'testValue', {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60000,
    path: '/',
    domain: 'localhost'
  });
  
  res.json({ 
    message: "Test cookie set",
    receivedCookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      cookie: req.headers.cookie
    }
  });
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
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
