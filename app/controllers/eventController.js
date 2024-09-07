const fs = require('fs');
const path = require('path');
const Event = require('../models').Event;
const logger = require('../config/logger')
const { validationResult } = require('express-validator');

/**
 * Add a new event
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addEvent = async (req, res) => {
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
        res.status(201).json({ event });
    } catch (error) {
        logger.error('Error adding event:', error);
        next(error);
    }
};

/**
 * View all events
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.json({ events });
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
exports.editEvent = async (req, res) => {
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
exports.deleteEvent = async (req, res) => {
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

