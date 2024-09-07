const { Op } = require('sequelize');

/**
 * Get paginated data with optional search and filter criteria
 * @param {Object} model - Sequelize model
 * @param {Object} options - Query options including pagination and filters
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Number of items per page
 * @param {string} [options.search] - Search term for filtering results
 * @param {Object} [options.filters] - Additional filters for querying data
 * @param {Array} [options.order] - Ordering of results (e.g., [['createdAt', 'DESC']])
 * @returns {Promise<Object>} - Paginated results including data, pagination metadata
 */
async function getPaginatedData(model, options) {
    const { page = 1, limit = 10, search = '', filters = {}, order = [['createdAt', 'DESC']] } = options;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Build the where clause dynamically
    const where = {
        [Op.and]: [
            search ? {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { city: { [Op.iLike]: `%${search}%` } }
                ]
            } : {},
            ...Object.entries(filters).map(([key, value]) => ({ [key]: value }))
        ]
    };

    // Query options
    const queryOptions = {
        limit: parseInt(limit, 10),
        offset,
        where,
        order
    };

    try {
        const result = await model.findAndCountAll(queryOptions);

        return {
            data: result.rows,
            total: result.count,
            page: parseInt(page, 10),
            totalPages: Math.ceil(result.count / parseInt(limit, 10))
        };
    } catch (error) {
        throw new Error('Error fetching paginated data: ' + error.message);
    }
}

module.exports = getPaginatedData;
