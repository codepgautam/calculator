const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const CalculatorInstances = sequelize.define('calculator_instances', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    result: { 
        type: DataTypes.NUMERIC, 
        allowNull: false 
    },
    totalOps: { 
        type: DataTypes.INTEGER, 
        field: 'total_ops', 
        allowNull: false 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.fn('now'), 
        field: 'created_at', 
        allowNull: false 
    },
    updatedAt: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.fn('now'), 
        field: 'updated_at', 
        allowNull: false 
    }
  });
  
  const CalculatorOperation = sequelize.define('calculator_operations', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    calculatorId: { 
        type: DataTypes.INTEGER, 
        field: 'calculator_id', 
        allowNull: false 
    },
    operator: { 
        type: DataTypes.ENUM('ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE'), 
        allowNull: false 
    },
    num: { 
        type: DataTypes.NUMERIC, 
        allowNull: false 
    },
    createdAt: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.fn('now'), 
        field: 'created_at', 
        allowNull: false 
    },
    updatedAt: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.fn('now'), 
        field: 'updated_at', 
        allowNull: false 
    }
  });
  
  CalculatorInstances.hasMany(CalculatorOperation, { foreignKey: 'calculator_id' });
  
  sequelize.sync();
  
  module.exports = {
    CalculatorInstances,
    CalculatorOperation,
  };
