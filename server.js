const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ======= Root route to confirm server is running =======
app.get('/', (req, res) => {
    res.send('🚀 Backend API is running on Render!');
});

// ======= MongoDB Connection =======
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
    });

// ======= Routes =======
app.use('/api/recommendations', recommendationRoutes);

// ======= User Schema =======
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    employeeId: String
});

const User = mongoose.model('User', userSchema);

// ======= Supply Chain Login Route =======
app.post('/api/supply-chain-login', async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({ error: 'Employee ID and password are required' });
        }

        const user = await User.findOne({ employeeId, password, role: 'supply_chain' });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials or unauthorized access' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ======= Feedback Schema =======
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

// ======= Submit Feedback =======
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

// ======= Get All Feedbacks =======
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
