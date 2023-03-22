import { Model, DataTypes } from "sequelize";
import { sequelize } from "./conn";

export class Report extends Model { }

Report.init({
  reporter: DataTypes.STRING,
  phone_number: DataTypes.TEXT,
  message: DataTypes.TEXT,
},
  {
    sequelize, modelName: 'report'
  });