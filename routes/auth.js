const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
    const { employeeId, password } = req.body;

    try {
        const user = await User.findOne({ employeeId, role: 'supply_chain' });

        if (!user) return res.status(404).json({ message: 'User not found or not authorized' });
        if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

        req.session.user = { id: user._id, employeeId: user.employeeId, role: user.role };
        return res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;



