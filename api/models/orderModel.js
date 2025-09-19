import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Customer from "./customerModel.js";
import User from "./userModel.js";

const Order = sequelize.define(
    "Order",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Customer,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE",
        },

        estimated_delivery_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        real_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        total_price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        start_cut: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        start_veneer: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        createdAt: "order_date",
    }

);


export default Order;
