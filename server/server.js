import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple JSON file database
const DB_FILE = join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }));
}

// Helper functions
const readDB = () => {
  const data = fs.readFileSync(DB_FILE);
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log('Signup request:', req.body);
  const { email, password, name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  try {
    const db = readDB();
    
    // Check if user exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: Date.now(),
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      isPremium: false,
      streakDays: 0,
      completedWorkouts: 0
    };
    
    db.users.push(newUser);
    writeDB(db);
    
    // Generate token
    const token = jwt.sign({ id: newUser.id, email }, process.env.JWT_SECRET || 'secretkey123');
    
    res.json({
      success: true,
      token,
      user: {
        email: newUser.email,
        name: newUser.name,
        isPremium: newUser.isPremium,
        streakDays: newUser.streakDays,
        completedWorkouts: newUser.completedWorkouts
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  try {
    const db = readDB();
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'secretkey123');
    
    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        name: user.name,
        isPremium: user.isPremium,
        streakDays: user.streakDays,
        completedWorkouts: user.completedWorkouts
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
app.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const db = readDB();
    const user = db.users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      isPremium: user.isPremium,
      streakDays: user.streakDays,
      completedWorkouts: user.completedWorkouts
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Complete workout
app.post('/workouts/complete', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === decoded.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    db.users[userIndex].completedWorkouts += 1;
    db.users[userIndex].streakDays += 1;
    writeDB(db);
    
    res.json({
      streakDays: db.users[userIndex].streakDays,
      completedWorkouts: db.users[userIndex].completedWorkouts
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Upgrade to premium
app.post('/premium/upgrade', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === decoded.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    db.users[userIndex].isPremium = true;
    writeDB(db);
    
    res.json({ success: true, isPremium: true });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Test: http://localhost:${PORT}/test`);
});