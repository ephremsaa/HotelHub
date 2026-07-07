const db = require('../config/db');

const Hotel = {
    create: async (owner_id, hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url) => {
        const query = `
            INSERT INTO hotels (owner_id, hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`;
        const values = [owner_id, hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    findAll: async () => {
        const query = `
            SELECT h.*, 
                   COALESCE(json_agg(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '[]') as amenities,
                   COALESCE((SELECT json_agg(json_build_object('id', hi.id, 'url', hi.image_url)) FROM hotel_images hi WHERE hi.hotel_id = h.id), '[]') as gallery_images
            FROM hotels h
            LEFT JOIN amenities a ON h.id = a.hotel_id
            GROUP BY h.id
            ORDER BY h.created_at DESC
        `;
        const result = await db.query(query);
        return result.rows;
    },

    findById: async (id) => {
        const query = `
            SELECT h.*, 
                   COALESCE(json_agg(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '[]') as amenities,
                   COALESCE((SELECT json_agg(json_build_object('id', hi.id, 'url', hi.image_url)) FROM hotel_images hi WHERE hi.hotel_id = h.id), '[]') as gallery_images
            FROM hotels h
            LEFT JOIN amenities a ON h.id = a.hotel_id
            WHERE h.id = $1
            GROUP BY h.id
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    },

    findByOwnerId: async (owner_id) => {
        const query = `
            SELECT h.*, 
                   COALESCE(json_agg(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL), '[]') as amenities,
                   COALESCE((SELECT json_agg(json_build_object('id', hi.id, 'url', hi.image_url)) FROM hotel_images hi WHERE hi.hotel_id = h.id), '[]') as gallery_images
            FROM hotels h
            LEFT JOIN amenities a ON h.id = a.hotel_id
            WHERE h.owner_id = $1
            GROUP BY h.id
            ORDER BY h.created_at DESC
        `;
        const result = await db.query(query, [owner_id]);
        return result.rows;
    },

    update: async (id, hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url) => {
        const query = `
            UPDATE hotels
            SET hotel_name = $1, description = $2, address = $3, city = $4, country = $5, phone = $6, email = $7, star_rating = $8, base_price = $9, cover_image = $10, pool_image_url = $11
            WHERE id = $12 RETURNING *`;
        const values = [hotel_name, description, address, city, country, phone, email, star_rating, base_price, cover_image, pool_image_url, id];
        const result = await db.query(query, values);
        return result.rows[0];
    },

    setAmenities: async (hotel_id, amenitiesList) => {
        // Clear existing
        await db.query('DELETE FROM amenities WHERE hotel_id = $1', [hotel_id]);
        
        // Insert new
        if (amenitiesList && amenitiesList.length > 0) {
            const values = [];
            const placeholders = amenitiesList.map((name, idx) => {
                values.push(hotel_id, name);
                return `($${idx * 2 + 1}, $${idx * 2 + 2})`;
            }).join(', ');
            
            const query = `INSERT INTO amenities (hotel_id, name) VALUES ${placeholders}`;
            await db.query(query, values);
        }
    },

    setGalleryImages: async (hotel_id, imageUrls) => {
        if (imageUrls && imageUrls.length > 0) {
            const values = [];
            const placeholders = imageUrls.map((url, idx) => {
                values.push(hotel_id, url);
                return `($${idx * 2 + 1}, $${idx * 2 + 2})`;
            }).join(', ');
            
            const query = `INSERT INTO hotel_images (hotel_id, image_url) VALUES ${placeholders}`;
            await db.query(query, values);
        }
    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM hotels WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    deleteGalleryImage: async (imageId) => {
        const result = await db.query('DELETE FROM hotel_images WHERE id = $1 RETURNING *', [imageId]);
        return result.rows[0];
    }
};

module.exports = Hotel;
