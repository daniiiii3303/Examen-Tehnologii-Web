const { DataTypes } = require('sequelize');
const Participant = require('./participant');
const sequelize = require('../sequelize');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descriere: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 255],
    },
  },
  url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
});

Meeting.hasMany(Participant, { onDelete: 'CASCADE' });
module.exports = Meeting;
