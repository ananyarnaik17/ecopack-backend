const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'supply_chain') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.status(200).json({
        message: `Welcome ${req.session.user.name} to the Supply Chain Dashboard`,
        features: [
            'Submit Packaging Recommendation',
            'View 3D Model',
            'Review Feedback',
            'Analyze Packaging Data'
        ]
    });
});

module.exports = router;
