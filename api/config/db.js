import { Sequelize } from "sequelize";
import config from "./config.js";
const environment = "development";
const dbConfig = config[environment];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
    }
);

export default sequelize;
