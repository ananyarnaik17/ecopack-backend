const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======= Middleware =======
app.use(cors());
app.use(express.json()); // ✅ Required to parse JSON bodies

// ======= Import Routes =======
const recommendationRoutes = require('./routes/recommendationRoutes');
const authRoutes = require('./routes/auth'); // ✅ Your login/logout routes

// ======= Connect MongoDB =======
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

// ======= Root Route =======
app.get('/', (req, res) => {
    res.send('🚀 Backend API is running on Render!');
});

// ======= Route Use =======
app.use('/api', authRoutes); // ✅ /api/login, /api/logout
app.use('/api/recommendations', recommendationRoutes);

// ======= Feedback Schema & Routes =======
const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    overallRating: { type: Number, required: true },
    accuracyRating: { type: Number, required: true },
    packagingRating: { type: Number, required: true },
    deliveryRating: { type: Number, required: true },
    suggestions: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'feedbacks' });

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Submit Feedback
app.post('/api/submit-feedback', async (req, res) => {
    try {
        const { name, overallRating, accuracyRating, packagingRating, deliveryRating, suggestions } = req.body;

        if (!name || !overallRating || !accuracyRating || !packagingRating || !deliveryRating) {
            return res.status(400).json({ error: 'All ratings and name are required' });
        }

        const newFeedback = new Feedback({
            name,
            overallRating,
            accuracyRating,
            packagingRating,
            deliveryRating,
            suggestions
        });

        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Get All Feedbacks
app.get('/api/get-feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        console.error('Error fetching feedbacks:', err);
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

// ======= Shipping Cost Calculation =======
app.post('/api/get-shipping-cost', (req, res) => {
    const { weight, shippingMethod } = req.body;

    if (!weight || !shippingMethod) {
        return res.status(400).json({ error: 'Weight and shipping method are required' });
    }

    const shippingRates = {
        'Air': { baseCost: 500, costPerKg: 50, deliveryTime: '1-2 Days' },
        'Sea': { baseCost: 300, costPerKg: 20, deliveryTime: '7-10 Days' },
        'Land': { baseCost: 200, costPerKg: 30, deliveryTime: '3-5 Days' },
        'Local': { baseCost: 100, costPerKg: 10, deliveryTime: 'Same Day' }
    };

    if (!shippingRates[shippingMethod]) {
        return res.status(400).json({ error: 'Invalid shipping method' });
    }

    const rate = shippingRates[shippingMethod];
    const estimatedCost = rate.baseCost + (weight * rate.costPerKg);

    res.json({
        estimatedCost: parseFloat(estimatedCost.toFixed(2)),
        deliveryTime: rate.deliveryTime
    });
});
