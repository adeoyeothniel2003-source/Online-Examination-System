const bcrypt = require('bcryptjs');
const db = require('./config/db');


// =========================================
// ADMIN DETAILS
// =========================================

const adminName = 'System Administrator';
const adminEmail = 'admin@examsystem.com';
const adminPassword = 'Admin@12345';


// =========================================
// CREATE ADMIN
// =========================================

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        const [existingAdmin] = await db.query(
            `SELECT id
             FROM users
             WHERE email = ?`,
            [adminEmail]
        );

        if (existingAdmin.length > 0) {
            console.log('Admin account already exists.');
            process.exit(0);
        }

        await db.query(
            `INSERT INTO users
            (
                name,
                email,
                password,
                role,
                status
            )
            VALUES (?, ?, ?, 'admin', 'active')`,
            [
                adminName,
                adminEmail,
                hashedPassword
            ]
        );

        console.log('Admin account created successfully.');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        process.exit(0);

    } catch (error) {
        console.error('Error creating admin:', error.message);

        process.exit(1);
    }
}


createAdmin();
