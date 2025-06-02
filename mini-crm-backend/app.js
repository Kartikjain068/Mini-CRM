// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./auth/passport');
const path = require("path");



const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to React dashboard after successful login
    res.redirect('http://localhost:5173/dashboard');
  }
);
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});


app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173/');
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use("/api/vendor", require("./routes/vendor"));
app.use("/api/delivery-receipt", require("./routes/delivery"));
app.use("/api/campaigns", require("./routes/campaign"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/customers", require("./routes/customers"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/segments", require("./routes/segments"));
app.use("/api/ai", require("./routes/ai"));


const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);


module.exports = app;
