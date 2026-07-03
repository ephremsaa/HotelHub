const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

exports.bookAppointment = async (req, res) => {
    try {
        const { service_id, appointment_date } = req.body;
        const customer_id = req.user.id;

        const service = await Service.findById(service_id);
        if (!service) return res.status(404).json({ error: 'Service not found' });

        const appointment = await Appointment.create(customer_id, service_id, appointment_date);
        res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
};

exports.getMyCustomerAppointments = async (req, res) => {
    try {
        const customer_id = req.user.id;
        const appointments = await Appointment.findByCustomer(customer_id);
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get appointments' });
    }
};

exports.getMyProviderAppointments = async (req, res) => {
    try {
        const provider_id = req.user.id;
        const appointments = await Appointment.findByProvider(provider_id);
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get appointments' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await Appointment.updateStatus(id, status);
        res.json({ message: `Appointment status updated to ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update appointment status' });
    }
};
