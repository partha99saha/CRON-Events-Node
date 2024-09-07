/**
 * Like Model
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Ensure this matches the table name
                key: 'id'
            }
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Events', // Ensure this matches the table name
                key: 'id'
            }
        },
        type: { // 'like' or 'dislike'
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['like', 'dislike']]
            }
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['userId', 'eventId']
            }
        ]
    });

    Like.associate = models => {
        Like.belongsTo(models.User, { foreignKey: 'userId' });
        Like.belongsTo(models.Event, { foreignKey: 'eventId' });
    };

    return Like;
};
