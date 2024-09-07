const { Event } = require('../models');
const logger = require('../utils/logger');

/**
 * Schedule a cron job to run at 12 PM every day
 */
exports.cronService = async (req) => {
    try {
        logger.log('Running cron job at 12 PM');
        // Fetch events that need to be created or updated
        const eventsToCreate = await getEventsToCreate(req);

        // Create new events based on fetched data
        for (const eventData of eventsToCreate) {
            await Event.create(eventData);
            logger.log(`New event created: ${eventData.title}`);
        }
        // Activate events that need to be updated
        const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
        await Event.update(
            { displayStatus: true },
            {
                where: {
                    displayStatus: false,
                    date: today
                }
            }
        );
        logger.log('Events updated successfully');
    } catch (error) {
        logger.error('Error running cron job:', error);
    }
}

/**
 * Get Events details
 * @param {*} req 
 * @returns 
 */
async function getEventsToCreate(req) {
    const { title, description, email, phone, city, organizerDetails, paidStatus, displayStatus } = req.body;
    const eventImage = req.file;
    return [
        {
            title: title || 'Scheduled Event Example',
            description: description || 'Automatically scheduled event',
            city: city || 'New Delhi',
            email: email,
            phone: phone,
            organizerDetails: organizerDetails,
            date: new Date(),
            paidStatus: paidStatus || false,
            displayStatus: displayStatus || true,
            eventImage: eventImage ? eventImage.path : ''
        }
    ];
}
