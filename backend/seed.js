const path = require('path');
const fs = require('fs');

// Load environment variables before requiring utils
require('dotenv').config();

const utils = require('./lib/utils');

const eventsPath = path.join(__dirname, 'data/events.db');
const usersPath = path.join(__dirname, 'data/users.db');

// Delete existing databases to start fresh each time
// We do this BEFORE requiring models so they initialize fresh files
if (fs.existsSync(eventsPath)) {
    fs.unlinkSync(eventsPath);
    console.log('Deleted existing events.db');
}
if (fs.existsSync(usersPath)) {
    fs.unlinkSync(usersPath);
    console.log('Deleted existing users.db');
}

const FamilyOrganiser = require('./models/foModel');
// userModel exports an INSTANCE, not a class
const userDB = require('./models/userModel');

// Initialize DAOs
// foModel exports class, requires path relative from the model file location? 
// Actually foModel constructor resolves path relative to itself ('..', dbFilePath).
const eventsDB = new FamilyOrganiser('./data/events.db');

// userDB is already initialized in its file, but we can call init to be sure (it checks count)
eventsDB.init();
userDB.init();

const DUMMY_USER = {
    username: 'admin',
    familyId: 'admin_family',
    password: 'admin',
    role: 'administrator'
};

const DUMMY_EVENTS = [
    {
        event: 'Swimming Lesson',
        date: '2025-12-15',
        startTime: '16:00',
        endTime: '17:00',
        location: 'Community Pool',
        requiredItems: 'Swimsuit, Towel, Goggles',
        username: 'admin',
        familyId: 'admin_family'
    },
    {
        event: 'Grocery Shopping',
        date: '2025-12-16',
        startTime: '10:00',
        endTime: '11:30',
        location: 'Supermarket',
        requiredItems: 'Shopping List, Bags',
        username: 'admin',
        familyId: 'admin_family'
    },
    {
        event: 'Family Dinner',
        date: '2025-12-17',
        startTime: '18:00',
        endTime: '20:00',
        location: 'Home',
        requiredItems: 'Food, Drinks',
        username: 'admin',
        familyId: 'admin_family'
    },
    {
        event: 'Dentist Appointment',
        date: '2025-12-20',
        startTime: '09:00',
        endTime: '10:00',
        location: 'Dentist Clinic',
        requiredItems: 'Insurance Card',
        username: 'admin',
        familyId: 'admin_family'
    }
];

function seed() {
    console.log('Starting seed process...');

    // 1. Create User
    const saltHash = utils.genPassword(DUMMY_USER.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = {
        username: DUMMY_USER.username,
        hash: hash,
        salt: salt,
        familyId: DUMMY_USER.familyId,
        role: DUMMY_USER.role,
        createdAt: new Date().toISOString(),
    };

    userDB.lookup(DUMMY_USER.username, DUMMY_USER.familyId, (err, existingUser) => {
        if (err) {
            console.error('Error looking up user:', err);
            return;
        }

        if (existingUser) {
            console.log(`User ${DUMMY_USER.username} already exists. Skipping user creation.`);
        } else {
            userDB.create(newUser, (err) => {
                if (err) {
                    console.error('Error creating user:', err);
                } else {
                    console.log(`User created: ${DUMMY_USER.username} (Password: ${DUMMY_USER.password})`);
                }
            });
        }

        // 2. Create Events
        console.log(`Seeding ${DUMMY_EVENTS.length} events...`);
        DUMMY_EVENTS.forEach(event => {
            eventsDB.addEvent(
                event.event,
                event.date,
                event.startTime,
                event.endTime,
                event.location,
                event.requiredItems,
                event.username,
                event.familyId
            );
        });

        // Give DB a moment to flush writes
        setTimeout(() => {
            console.log('Seeding completed.');
        }, 1000);
    });
}

seed();
