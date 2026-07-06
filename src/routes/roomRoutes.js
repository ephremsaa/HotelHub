const express = require('express');
const roomController = require('../controllers/roomController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authorize(['hotel_owner', 'admin']), roomController.createRoom);
router.post('/type', authorize(['hotel_owner', 'admin']), roomController.createRoomType);
router.get('/hotel/:hotelId', roomController.getRoomsByHotel);
router.put('/:id', authorize(['hotel_owner', 'admin']), roomController.updateRoomStatus);

module.exports = router;
