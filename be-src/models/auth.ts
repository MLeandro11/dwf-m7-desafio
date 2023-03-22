import { sequelize} from './conn';
import {DataTypes, Model } from 'sequelize';


export class Auth extends Model {}

Auth.init({
  fullname: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  user_id: DataTypes.INTEGER
}, {
  sequelize, modelName: 'auth'
});