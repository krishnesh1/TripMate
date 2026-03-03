const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser")
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

// Connect to MongoDB
connectDB();
app.use(cookieParser());
// Middleware
app.use(cors({
  origin: "https://trip-mate-krishnesh1s-projects.vercel.app",
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
