import express, { response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import sequelize from "./config/db.js";
import authRouter from "./routes/authRouter.js";
import customerRouter from "./routes/customerRouter.js";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

await sequelize.authenticate();
console.log("connected to db");
await sequelize.sync();
console.log("migrated");


const app = express();

app.listen(process.env.PORT || 3080);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/order", orderRouter);
app.use("/api/customer", customerRouter);
