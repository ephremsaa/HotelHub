const db = require('./src/config/db');
const Room = require('./src/models/Room');
const Hotel = require('./src/models/Hotel');

async function test() {
    try {
        await new Promise(r => setTimeout(r, 1000));
        
        const u = await db.query("INSERT INTO users (name, email, password_hash, role) VALUES ('test', 'test2@test.com', 'test', 'hotel_owner') RETURNING *");
        const user_id = u.rows[0].id;
        
        const h = await Hotel.create(user_id, 'My Hotel', 'desc', 'addr', 'city', 'country', 'phone', 'email', 5, '');
        
        const rt = await Room.createRoomType(h.id, 'Deluxe', undefined, '2', '5000', '1', undefined);
        console.log('RoomType:', rt);
        
        const r = await Room.createRoom(h.id, rt.id, '101', '1', undefined);
        console.log('Room:', r);
        
        console.log('Success!');
    } catch(err) {
        console.log('DB Error:', err);
    } finally {
        process.exit(0);
    }
}
test();
