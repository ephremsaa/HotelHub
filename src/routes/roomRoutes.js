const express = require('express');
const multer = require('multer');
const path = require('path');
const roomController = require('../controllers/roomController');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads/'));
    },
    filename: function(req, file, cb) {
        cb(null, 'room-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', authorize(['hotel_owner', 'admin']), roomController.createRoom);
router.post('/type', authorize(['hotel_owner', 'admin']), upload.single('image_url'), roomController.createRoomType);
router.get('/hotel/:hotelId', roomController.getRoomsByHotel);
router.get('/types/:hotelId', roomController.getRoomTypesByHotel);
router.put('/:id', authorize(['hotel_owner', 'admin']), roomController.updateRoom);
router.put('/status/:id', authorize(['hotel_owner', 'admin']), roomController.updateRoomStatus);
router.delete('/:id', authorize(['hotel_owner', 'admin']), roomController.deleteRoom);
router.delete('/type/:id', authorize(['hotel_owner', 'admin']), roomController.deleteRoomType);
router.put('/type/:id', authorize(['hotel_owner', 'admin']), upload.single('image_url'), roomController.updateRoomType);

module.exports = router;
