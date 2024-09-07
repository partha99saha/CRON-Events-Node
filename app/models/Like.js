module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: { // 'like' or 'dislike'
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Like.belongsTo(sequelize.models.User, { foreignKey: 'userId' });
    Like.belongsTo(sequelize.models.Event, { foreignKey: 'eventId' });

    return Like;
};
