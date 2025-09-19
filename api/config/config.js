import dotenv from "dotenv";

dotenv.config();

export default {
    development: {
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "database_name",
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        logging: false,
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql",
        logging: false,
    },
    production: {
        username: "root",
        password: null,
        database: "database_production",
        host: "127.0.0.1",
        dialect: "mysql",
        logging: false,
    },
};
