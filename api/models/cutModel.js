import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./orderModel.js";

const Cut = sequelize.define(
    "Cut",
    {
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Order,
                key: "id",
                onDelete: "CASCADE",
            },
            

        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        unit_price: {
            type: DataTypes.FLOAT,
            defaultValue: 2,
        },
        cut_time: {
            type: DataTypes.INTEGER,
            defaultValue: 2,
        },
    },
    {
        timestamps: true,
    }
);


export default Cut;
