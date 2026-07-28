const cors = require('cors');
const express = require('express');
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
<<<<<<< HEAD
  origin: "https://trip-mate-git-main-krishnesh1s-projects.vercel.app",    
=======
  origin: "https://trip-mate-git-main-krishnesh1s-projects.vercel.app",
>>>>>>> 704390a (Add trip management and Google authentication)
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
