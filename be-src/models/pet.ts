import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Pet extends Model { }

Pet.init({
  name: DataTypes.STRING,
  lost: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  picture_URL: DataTypes.STRING,
  location: DataTypes.STRING,
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT,
},
  {
    sequelize, modelName: 'pet'
  });