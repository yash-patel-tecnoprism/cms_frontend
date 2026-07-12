const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../utils/supabase');
const auth = require('../middleware/auth');

const router = express.Router();

const mapUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.created_at,
});

const isUniqueViolation = (error) => error?.code === '23505';

// Register route - creates a new user
router.post(
  '/register',
  // Validation: email must be valid, password at least 6 chars
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      // Check if user already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existingUserError) {
        throw existingUserError;
      }
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password before storing (NEVER store plain text passwords!)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user in database
      const { data: user, error: createUserError } = await supabase
        .from('users')
        .insert({
          email,
          password: hashedPassword,
          name: name || null,
        })
        .select('id')
        .single();
      if (createUserError) {
        if (isUniqueViolation(createUserError)) {
          return res.status(400).json({ message: 'User already exists' });
        }
        throw createUserError;
      }

      // Create JWT token - expires in 1 day
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login route - authenticates existing user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (userError) {
        throw userError;
      }
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create and return JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', req.userId)
      .maybeSingle();
    if (userError) {
      throw userError;
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(mapUser(user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update current user profile
router.put(
  '/profile',
  auth,
  [
    body('email').isEmail().withMessage('Please enter a valid email').optional(),
    body('name').optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, name } = req.body;

      // Check if email is already taken by another user
      if (email) {
        const { data: existingUser, error: existingUserError } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .neq('id', req.userId)
          .maybeSingle();
        if (existingUserError) {
          throw existingUserError;
        }
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      const updates = {};
      if (email !== undefined) {
        updates.email = email;
      }
      if (name !== undefined) {
        updates.name = name || null;
      }

      const { data: updatedUser, error: updateUserError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.userId)
        .select('id, email, name, created_at')
        .maybeSingle();
      if (updateUserError) {
        if (isUniqueViolation(updateUserError)) {
          return res.status(400).json({ message: 'Email already in use' });
        }
        throw updateUserError;
      }
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(mapUser(updatedUser));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
