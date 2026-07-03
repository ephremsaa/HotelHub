const express = require('express');
const { authorize } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');
const router = express.Router();

router.post('/', authorize(['customer']), appointmentController.bookAppointment);
router.get('/customer', authorize(['customer']), appointmentController.getMyCustomerAppointments);

router.get('/provider', authorize(['provider']), appointmentController.getMyProviderAppointments);
router.put('/:id/status', authorize(['provider', 'admin']), appointmentController.updateStatus);

module.exports = router;
