'use strict';
const Sequelize = require('sequelize')
const sequelize = require('../db')

  const Event = sequelize.define('event', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    startDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }, {
    tableName: 'events',
    timestamps: false
  })

module.exports = Event
