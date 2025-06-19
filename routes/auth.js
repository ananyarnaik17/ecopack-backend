/* // backend/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/login
// @desc    Login Supply Chain User
// @access  Public
router.post('/login', async (req, res) => {
    const { employeeId, password } = req.body;

    // Basic validation
    if (!employeeId || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    try {
        // Find user with matching employeeId and role
        const user = await User.findOne({ employeeId, role: 'supply_chain' });

        if (!user) {
            return res.status(404).json({ error: 'User not found or not authorized' });
        }

        // Password check (plaintext comparison — consider hashing for production)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Success — return user data
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                employeeId: user.employeeId,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
 */
// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/login
// @desc    Login Supply Chain User
// @access  Public
router.post('/login', async (req, res) => {
    const { employeeId, password } = req.body;

    // Basic validation
    if (!employeeId || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    try {
        // Find user with matching employeeId and role
        const user = await User.findOne({ employeeId, role: 'supply_chain' });

        if (!user) {
            return res.status(404).json({ error: 'User not found or not authorized' });
        }

        // Check password (in plaintext for now — not secure in production)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Success — return user data
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                employeeId: user.employeeId,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ error: 'Server error' });
    }
});

// ✅ TEMP: Test route to list all users from DB
router.get('/test-users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
