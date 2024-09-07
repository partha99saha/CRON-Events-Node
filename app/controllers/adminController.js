const { Op, Sequelize } = require('sequelize');
const Event = require('../models').Event;
const logger = require('../utils/logger');

/**
 * List all events with pagination
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.listEvents = async (req, res, next) => {
    const { page = 1, limit = 10, search = '', filterDate = '', filterCity = '' } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    try {
        const queryOptions = {
            limit: parseInt(limit, 10),
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
            totalPages: Math.ceil(events.count / parseInt(limit, 10))
        });
    } catch (error) {
        logger.error('Error listing events:', error);
        next(error);
    }
};

/**
 * Change event status
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.changeEventStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // Expected to be 'active' or 'inactive'

    try {
        const event = await Event.findByPk(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (status !== 'active' && status !== 'inactive') {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await event.update({ displayStatus: status });
        res.json({ event });
    } catch (error) {
        logger.error('Error changing event status:', error);
        next(error);
    }
};

/**
 * Generate reports for paid and unpaid events
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.generateReports = async (req, res, next) => {
    const { startDate, endDate } = req.query;

    try {
        const reports = await Event.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN "paidStatus" = true THEN 1 ELSE 0 END')), 'paidEvents'],
                [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN "paidStatus" = false THEN 1 ELSE 0 END')), 'unpaidEvents']
            ],
            where: {
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            }
        });

        res.json({ reports });
    } catch (error) {
        logger.error('Error generating reports:', error);
        next(error);
    }
};
