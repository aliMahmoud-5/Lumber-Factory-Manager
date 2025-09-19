import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./orderModel.js";

const Veneer = sequelize.define(
    "Veneer",
    {
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Order,
                key: "id",
            },
            onDelete: "CASCADE",

        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        meter_sqr_price: {
            type: DataTypes.FLOAT,
            defaultValue: 3,
        },
        veneer_time: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
        }
    },
    {
        timestamps: true,
    }
);


export default Veneer;
