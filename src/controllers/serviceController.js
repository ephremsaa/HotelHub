const Service = require('../models/Service');

exports.createService = async (req, res) => {
    try {
        const { name, description, duration_minutes, price } = req.body;
        const provider_id = req.user.id; 

        const service = await Service.create(provider_id, name, description, duration_minutes, price);
        res.status(201).json({ message: 'Service created successfully', service });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create service' });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get services' });
    }
};
