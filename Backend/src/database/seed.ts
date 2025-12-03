import { Database } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

const sampleProperties = [
    {
        id: '1',
        title: 'Appartement lumineux avec balcon',
        city: 'Paris',
        price: 485000,
        surface: 65,
        bedrooms: 2,
        bathrooms: 1,
        type: 'apartment',
        image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
    },
    {
        id: '2',
        title: 'Maison familiale avec jardin',
        city: 'Lyon',
        price: 720000,
        surface: 145,
        bedrooms: 4,
        bathrooms: 2,
        type: 'house',
        image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
    },
    {
        id: '3',
        title: 'Studio moderne centre-ville',
        city: 'Bordeaux',
        price: 195000,
        surface: 28,
        bedrooms: 1,
        bathrooms: 1,
        type: 'studio',
        image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
    },
    {
        id: '4',
        title: 'Villa contemporaine vue mer',
        city: 'Nice',
        price: 1250000,
        surface: 220,
        bedrooms: 5,
        bathrooms: 3,
        type: 'villa',
        image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'
    },
    {
        id: '5',
        title: 'Loft industriel rénové',
        city: 'Nantes',
        price: 380000,
        surface: 95,
        bedrooms: 2,
        bathrooms: 1,
        type: 'apartment',
        image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
    }
];

async function seed() {
    console.log('🌱 Starting database seeding...');

    const connection = await Database.getConnection();

    try {
        // Vider les tables
        await connection.execute('DELETE FROM favorites');
        await connection.execute('DELETE FROM properties');

        // Insérer les propriétés
        for (const prop of sampleProperties) {
            await connection.execute(
                `INSERT INTO properties (id, title, city, price, surface, bedrooms, bathrooms, type, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    prop.id,
                    prop.title,
                    prop.city,
                    prop.price,
                    prop.surface,
                    prop.bedrooms,
                    prop.bathrooms,
                    prop.type,
                    prop.image_url
                ]
            );
        }

     
        await connection.execute(
            `INSERT INTO favorites (id, property_id, user_id)
       VALUES (UUID(), ?, 'user123')`,
            ['1']
        );

        await connection.execute(
            `INSERT INTO favorites (id, property_id, user_id)
       VALUES (UUID(), ?, 'user123')`,
            ['3']
        );

        console.log('✅ Database seeded successfully!');
        console.log(`📊 Inserted ${sampleProperties.length} properties`);
        console.log('⭐ Added 2 sample favorites for user123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        connection.release();
        await Database.close();
        process.exit(0);
    }
}

seed();