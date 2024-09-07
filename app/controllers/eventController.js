const fs = require('fs');
const path = require('path');
const Event = require('../models').Event;
const logger = require('../config/logger');
const { validationResult } = require('express-validator');

/**
 * Add a new event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, email, phone, address, city, organizerDetails, paidStatus, displayStatus } = req.body;
    const eventImage = req.file; // Assuming file upload middleware is used

    if (!eventImage) {
        return res.status(400).json({ message: 'Event image is required' });
    }

    try {
        const event = await Event.create({
            title,
            description,
            email,
            phone,
            address,
            city,
            organizerDetails,
            paidStatus,
            displayStatus,
            eventImage: eventImage.path // Save the image path or URL
        });
        
        const eventUrl = `${req.protocol}://${req.get('host')}/events/${event.id}`;
        res.status(201).json({ event, eventUrl });
    } catch (error) {
        logger.error('Error adding event:', error);
        next(error);
    }
};

/**
 * View all events with pagination
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getEvents = async (req, res, next) => {
    const { page = 1, limit = 10, search = '', filterDate = '', filterCity = '' } = req.query;
    const offset = (page - 1) * limit;

    try {
        const queryOptions = {
            limit,
            offset,
            where: {
                [Op.and]: [
                    search ? {
                        [Op.or]: [
                            { title: { [Op.iLike]: `%${search}%` } },
                            { city: { [Op.iLike]: `%${search}%` } }
                        ]
                    } : {},
                    filterDate ? { createdAt: { [Op.gte]: new Date(filterDate) } } : {},
                    filterCity ? { city: { [Op.iLike]: `%${filterCity}%` } } : {}
                ]
            },
            order: [['createdAt', 'DESC']]
        };

        const events = await Event.findAndCountAll(queryOptions);

        res.json({
            events: events.rows,
            total: events.count,
            page: parseInt(page, 10),
            totalPages: Math.ceil(events.count / limit)
        });
    } catch (error) {
        logger.error('Error fetching events:', error);
        next(error);
    }
};

/**
 * Edit an event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.editEvent = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, email, phone, address, city, organizerDetails, paidStatus, displayStatus } = req.body;
    const eventImage = req.file; // Assuming file upload middleware is used

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update fields
        await event.update({
            title: title || event.title,
            description: description || event.description,
            email: email || event.email,
            phone: phone || event.phone,
            address: address || event.address,
            city: city || event.city,
            organizerDetails: organizerDetails || event.organizerDetails,
            paidStatus: paidStatus !== undefined ? paidStatus : event.paidStatus,
            displayStatus: displayStatus !== undefined ? displayStatus : event.displayStatus,
            eventImage: eventImage ? eventImage.path : event.eventImage // Update image if provided
        });

        res.json({ event });
    } catch (error) {
        logger.error('Error editing event:', error);
        next(error);
    }
};

/**
 * Delete an event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteEvent = async (req, res, next) => {
    const { id } = req.params;

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Optionally, delete the event image from the filesystem
        if (event.eventImage && fs.existsSync(event.eventImage)) {
            fs.unlinkSync(event.eventImage);
        }

        await event.destroy();
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting event:', error);
        next(error);
    }
};

/**
 * Like an event
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.likeEvent = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const existingLike = await Like.findOne({
            where: { userId, eventId: id, type: 'like' }
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Event already liked' });
        }

        await Like.create({ userId, eventId: id, type: 'like' });
        res.status(200).send('Event liked successfully');
    } catch (error) {
        logger.error('Error liking event:', error);
        next(error);
    }
};

/**
 * Dislike an event
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.dislikeEvent = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const existingLike = await Like.findOne({
            where: { userId, eventId: id, type: 'dislike' }
        });

        if (existingLike) {
            return res.status(400).json({ message: 'Event already disliked' });
        }

        await Like.create({ userId, eventId: id, type: 'dislike' });
        res.status(200).send('Event disliked successfully');
    } catch (error) {
        logger.error('Error disliking event:', error);
        next(error);
    }
};

