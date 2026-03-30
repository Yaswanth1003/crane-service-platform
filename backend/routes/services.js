const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching services', error: error.message });
    }
});

// Seed basic services if empty
router.post('/seed', async (req, res) => {
    try {
        const count = await Service.countDocuments();
        if (count === 0) {
            const seedData = [
                { name: 'Hydra Cranes', model: '12 Ton', pricePerHour: 1600, pricePerDay: 8000, category: 'Hydra' },
                { name: 'Hydra Cranes', model: '14 Ton', pricePerHour: 1600, pricePerDay: 8000, category: 'Hydra' },
                { name: 'Farana Cranes', model: 'F15', pricePerHour: 2000, pricePerDay: 15000, category: 'Farana' },
                { name: 'Farana Cranes', model: 'F17', pricePerHour: 2000, pricePerDay: 15000, category: 'Farana' },
                { name: 'Towing Services', model: 'Accident Recovery', pricePerHour: 1500, pricePerDay: 10000, category: 'Towing' },
                { name: 'Towing Services', model: 'Emergency Towing', pricePerHour: 1500, pricePerDay: 10000, category: 'Towing' }
            ];
            await Service.insertMany(seedData);
            return res.json({ message: 'Services seeded successfully' });
        }
        res.json({ message: 'Services already exist' });
    } catch (error) {
        res.status(500).json({ message: 'Error seeding services', error: error.message });
    }
});

module.exports = router;
