const { Event } = require('../models');
const logger = require('../config/logger');

/**
 * Schedule a cron job to run at 12 PM every day
 */
exports.cronService = async () => {
    try {
        logger.log('Running cron job at 12 PM');
        // Fetch events that need to be created or updated
        const eventsToCreate = await getEventsToCreate();

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
        console.log('Events updated successfully');
    } catch (error) {
        console.error('Error running cron job:', error);
    }
}

/**
 * Fetch events to be created or updated
 * @returns {Array} List of event objects
 */
async function getEventsToCreate() {
    return [
        {
            title: 'Scheduled Event Example',
            description: 'Automatically scheduled event',
            city: 'New Delhi',
            date: new Date(),
            paidStatus: false,
            displayStatus: true,
            eventImage: ''
        }
    ];
}
