import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.BD_POSTGRES_ADRRESS)
