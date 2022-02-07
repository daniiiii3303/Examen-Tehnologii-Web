const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Participant = sequelize.define('Participants', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nume: {
    type: DataTypes.STRING,
    validate: {
      len: [5, 255],
    },
  },
});

module.exports = Participant;
