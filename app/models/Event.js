/**
 * Event Model
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    organizerDetails: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paidStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    displayStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    eventImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });
  return Event;
};

