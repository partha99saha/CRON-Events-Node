const cron = require('node-cron');
const Event = require('../models').Event;  // Assuming you have an Event model set up

/**
 * Schedule a cron job to run at 12 PM every day
 */
cron.schedule('0 12 * * *', async () => {
    try {
        console.log('Running cron job at 12 PM');
        // Add a new event every day at 12 PM
        const newEvent = {
            title: 'Daily Scheduled Event',
            description: 'This event was created automatically at 12 PM IST',
            city: 'New Delhi',
            date: new Date(),
            paidStatus: false,
            eventImage: '',
        };
        // Add new event to the database
        await Event.create(newEvent);
        console.log('New event created successfully');

        // Activate any events that are marked inactive and are scheduled for today
        const today = new Date();
        await Event.update(
            { active: true },
            {
                where: {
                    active: false,
                    date: today
                }
            }
        );
        console.log('Events updated successfully');
    } catch (error) {
        console.error('Error running cron job:', error);
    }
});
