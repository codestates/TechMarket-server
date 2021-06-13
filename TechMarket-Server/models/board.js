'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  board.init({
    writerid: DataTypes.STRING,
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    registday: DataTypes.STRING,
    hit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'board',
  });
  return board;
};