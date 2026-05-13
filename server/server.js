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

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

const db = new sqlite3.Database(join(__dirname, 'repflow.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      is_premium INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      completed_workouts INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS workout_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      workout_type TEXT,
      duration INTEGER,
      calories INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name || email.split('@')[0]],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
    
    const token = generateToken(result, email);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result,
        email,
        name: name || email.split('@')[0],
        isPremium: false,
        streakDays: 0,
        completedWorkouts: 0
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = generateToken(user.id, user.email);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isPremium: user.is_premium === 1,
        streakDays: user.streak_days,
        completedWorkouts: user.completed_workouts
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT id, email, name, is_premium, streak_days, completed_workouts FROM users WHERE id = ?',
        [req.user.userId],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.is_premium === 1,
      streakDays: user.streak_days,
      completedWorkouts: user.completed_workouts
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/workouts/complete', authenticateToken, async (req, res) => {
  const { workoutType, duration, calories } = req.body;
  const userId = req.user.userId;
  
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO workout_history (user_id, workout_type, duration, calories) VALUES (?, ?, ?, ?)',
        [userId, workoutType, duration, calories],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET completed_workouts = completed_workouts + 1, streak_days = streak_days + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
    
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        'SELECT streak_days, completed_workouts FROM users WHERE id = ?',
        [userId],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
    
    res.json({
      message: 'Workout completed!',
      streakDays: updatedUser.streak_days,
      completedWorkouts: updatedUser.completed_workouts
    });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/workouts/history', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const history = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM workout_history WHERE user_id = ? ORDER BY completed_at DESC LIMIT 20',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
    
    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/premium/upgrade', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET is_premium = 1 WHERE id = ?',
        [userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
    
    res.json({ message: 'Successfully upgraded to Premium!', isPremium: true });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Ready to accept requests from React app`);
});

export default app;