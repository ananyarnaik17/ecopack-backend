/* // backend/routes/recommendationRoutes.js

const express = require('express');
const axios = require('axios');
const Submission = require('../models/Submission');
const router = express.Router();

// ================= POST API =================
router.post('/', async (req, res) => {
    const formData = req.body;

    console.log('Received formData:', formData);

    // Validation
    if (
        !formData.productName ||
        !formData.productType || formData.productType.length === 0 ||
        !formData.dimensions ||
        !formData.dimensions.length ||
        !formData.dimensions.width ||
        !formData.dimensions.height ||
        !formData.weight ||
        !formData.durability || formData.durability.length === 0 ||
        !formData.shippingMethod || formData.shippingMethod.length === 0
    ) {
        console.error('Validation Error: Missing required fields.');
        return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    try {
        // Send to Python API
        console.log('Sending request to Python API...');
        const pythonRes = await axios.post(process.env.PYTHON_API_URL, formData);

        console.log('Response from Python API:', pythonRes.data);

        const recommendedPackage = pythonRes.data.recommendation;

        // Save to MongoDB
        const submission = new Submission({
            ...formData,
            recommendedPackage
        });

        console.log('Saving submission to MongoDB...');
        await submission.save();

        res.json({ recommendation: recommendedPackage });
    } catch (err) {
        console.error('Error during submission process:', err.message);
        if (err.response) {
            console.error('Python API Error:', err.response.data);
        }
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ================= GET API =================
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching recommendations:', err.message);
        res.status(500).json({ error: 'Server error while fetching recommendations.' });
    }
});

module.exports = router;
 */
// backend/routes/recommendationRoutes.js

const express = require('express');
const axios = require('axios');
const Submission = require('../models/Submission');
const router = express.Router();

// ================= POST API =================
router.post('/', async (req, res) => {
    const formData = req.body;

    console.log('Received formData:', formData);

    // Validation
    if (
        !formData.productName ||
        !formData.productType ||
        !formData.dimensions ||
        !formData.dimensions.length ||
        !formData.dimensions.width ||
        !formData.dimensions.height ||
        !formData.weight ||
        !formData.durability ||
        !formData.shippingMethod
    ) {
        console.error('Validation Error: Missing required fields.');
        return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    try {
        // Send to Python API
        console.log('Sending request to Python API...');
        const pythonRes = await axios.post(process.env.PYTHON_API_URL, formData);

        console.log('Response from Python API:', pythonRes.data);

        const recommendedPackage = pythonRes.data.recommendation;

        // Save to MongoDB
        const submission = new Submission({
            productName: formData.productName,
            productType: formData.productType,
            dimensions: {
                length: formData.dimensions.length,
                width: formData.dimensions.width,
                height: formData.dimensions.height
            },
            weight: formData.weight,
            durability: formData.durability,
            shippingMethod: formData.shippingMethod,
            additionalRequirements: formData.additionalRequirements,
            recommendedPackage: recommendedPackage
        });

        console.log('Saving submission to MongoDB...');
        await submission.save();

        res.json({ recommendation: recommendedPackage });
    } catch (err) {
        console.error('Error during submission process:', err.message);
        if (err.response) {
            console.error('Python API Error:', err.response.data);
        }
        res.status(500).json({ error: 'Server error. Please try again.' });
    }
});

// ================= GET API =================
router.get('/', async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching recommendations:', err.message);
        res.status(500).json({ error: 'Server error while fetching recommendations.' });
    }
});

module.exports = router;
