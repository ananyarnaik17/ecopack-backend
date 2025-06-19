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
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/login
// @desc    Login Supply Chain User
// @access  Public
router.post('/login', async (req, res) => {
    console.log("🔍 Incoming login request body:", req.body); // ✅ Debug log

    const { employeeId, password } = req.body;

    // Basic validation
    if (!employeeId || !password) {
        return res.status(400).json({ error: 'Employee ID and password are required' });
    }

    try {
        // Find user with employeeId and role = supply_chain
        const user = await User.findOne({ employeeId: employeeId, role: 'supply_chain' });

        if (!user) {
            console.log("❌ No user found with employeeId and role supply_chain");
            return res.status(404).json({ error: 'User not found or not authorized' });
        }

        // Password check (plain text - use hashing in real projects)
        if (user.password !== password) {
            console.log("❌ Password mismatch");
            return res.status(401).json({ error: 'Invalid password' });
        }

        // ✅ Success
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
        console.error('❌ Login error:', error.message);
        return res.status(500).json({ error: 'Server error' });
    }
});

// ✅ TEMP: Route to view all users (for debugging only — remove later)
router.get('/test-users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;
