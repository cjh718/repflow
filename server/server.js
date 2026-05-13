import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

console.log('Starting server...');

// Connect to database
const db = new sqlite3.Database(join(__dirname, 'repflow.db'));

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    is_premium INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    completed_workouts INTEGER DEFAULT 0
  )
`, (err) => {
  if (err) {
    console.error('Table creation error:', err.message);
  } else {
    console.log('Database ready');
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log('Signup request received');
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Query error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    db.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name || email.split('@')[0]],
      function(err) {
        if (err) {
          console.error('Insert error:', err.message);
          return res.status(500).json({ error: 'Failed to create user' });
        }
        
        const token = jwt.sign({ id: this.lastID, email }, 'secretkey123');
        
        res.json({
          success: true,
          token,
          user: {
            email,
            name: name || email.split('@')[0],
            isPremium: false,
            streakDays: 0,
            completedWorkouts: 0
          }
        });
      }
    );
  });
});

// Login endpoint
app.post('/login', async (req, res) => {
  console.log('Login request received');
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email }, 'secretkey123');
    
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        isPremium: user.is_premium === 1,
        streakDays: user.streak_days,
        completedWorkouts: user.completed_workouts
      }
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Test: http://localhost:${PORT}/test`);
});