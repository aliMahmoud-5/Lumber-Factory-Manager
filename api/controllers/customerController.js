import Customer from "../models/customerModel.js";
import Order from "../models/orderModel.js";
import { errorHandler } from "../utils/error.js";

export const createCustomer = async (req, res, next) => {
    const { phone, name, address } = req.body;
    const checkCustomer = await Customer.findByPk(phone);
    if (!checkCustomer) {
        try {
            const customer = await Customer.create({
                phone,
                name,
                address,
            });
            res.status(201).json(customer);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(405).json("Customer already exists.");
    }
};

export const updateCustomer = async (req, res, next) => {
    if (req.params.dep !== "sales")
        return next(errorHandler(401, "not authorized"));

    try {
        const customer = await Customer.findByPk(req.params.id);

        if (customer) {
            customer.phone = req.body.phone;
            customer.name = req.body.name;
            customer.address = req.body.address;
            await customer.save();
            res.status(201).json(customer);
        } else {
            res.status(404).json("Customer not found");
        }
    } catch (error) {
        next(error);
    }
};

export const getCustomerOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: {
                customer_id: req.params.id,
            }
            });
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getCustomer = async (req, res, next) => {
    const customer = await Customer.findByPk(req.params.id);
    try {
        if (!customer) return next(errorHandler(404, "Customer not found!"));
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
};

export const getAllCustomers = async (req, res, next) => {
    const allCustomers = await Customer.findAll();
    try {
        if (!allCustomers) return next(errorHandler(404, "No Customers  found!"));
        res.status(200).json(allCustomers);

    } catch (error) {
        next(error);
    }
};

export const getLatestOrder = async (req, res, next) => {
    try {
        const order = await Order.FindOne({
            where: {
                Customer_id: req.params.id,
                order: [["order_date", "DESC"]],
            },
        });
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

export const getCustomerByPhone = async (req,res,next) => {
    const {phone} = req.body;
    try {
        const customer = await Customer.findOne({
            where: {phone}
        })
        if (!customer) {
            return  next(errorHandler(404, "Customer not found!"));
        };
        res.status(200).json(customer);
    }
    catch (error) {
        next(error);
    }
}
