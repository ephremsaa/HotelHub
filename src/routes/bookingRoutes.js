const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authorize(['customer']), bookingController.createBooking);
router.get('/my-bookings', authorize(['customer']), bookingController.getMyBookings);
router.get('/hotel/:hotelId', authorize(['hotel_owner', 'admin']), bookingController.getHotelBookings);
router.put('/:id', authorize(['hotel_owner', 'admin', 'customer']), bookingController.updateBookingStatus);

module.exports = router;
