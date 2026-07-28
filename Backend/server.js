const cors = require('cors');
const express = require('express');
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();


const app = express();
const defaultClientUrls = [
  "http://localhost:5173",
  "https://trip-mate-git-main-krishnesh1s-projects.vercel.app",
];
const allowedOrigins = (process.env.CLIENT_URL || defaultClientUrls.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Connect to MongoDB
connectDB();
app.use(cookieParser());
// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true
}));

app.use(express.json());

app.get("/",(req,res)=>{
  res.send("TripMate API is running");
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
