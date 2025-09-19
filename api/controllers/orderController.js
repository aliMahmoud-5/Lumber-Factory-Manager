import Order from "../models/orderModel.js";
import Cut from "../models/cutModel.js";
import Veneer from "../models/veneerModel.js";
import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import { errorHandler } from "../utils/error.js";
import { Op } from "sequelize";


export const createOrder = async (req, res, next) => {
    try {
        const { customer_id, user_id, cuts, veneers } = req.body;

        const order = await Order.create({
            customer_id,
            user_id,
            total_price: 0,
        });
        let total_price = 0;
        if (cuts && cuts.length > 0) {
            const cutPromises = cuts.map((cut) => {
                return Cut.create({
                    width: parseFloat(cut.width),
                    height: parseFloat(cut.height),
                    order_id: order.id,
                }).then((newCut) => (total_price += newCut.unit_price));
            });
            await Promise.all(cutPromises);
        }

        if (veneers && veneers.length > 0) {
            const veneerPromises = veneers.map((veneer) => {
                return Veneer.create({
                    ...veneer,
                    order_id: order.id,
                }).then(
                    (newVeneer) =>
                        (total_price +=
                            (newVeneer.width /100) *
                            (newVeneer.height / 100) *
                            newVeneer.meter_sqr_price)
                );
            });
            await Promise.all(veneerPromises);
        }
        await order.update({total_price });
        const estimated_delivery_date = await calculateEST(order.id);
        await order.update({ estimated_delivery_date });
        return res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

export const calculateEST = async (id) => {
    const EST = await Order.max('estimated_delivery_date');

    const cutTime = (await Cut.count({ where: { order_id: id } })) * (2 * 60 * 1000) ;
    const veneerTime =
        (await Veneer.count({ where: { order_id: id } })) * (3 * 60 * 1000);
    const est = cutTime + veneerTime
    const now = new Date();
    if (EST < now) {
        now.setTime(now.getTime() + est);
        return now;
    }
    EST.setTime(EST.getTime() + est);
    return EST;
};

export const displayOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    const cuts = await Cut.findAll({
        where: {
            order_id: req.params.id,
        },
    });
    const veneers = await Veneer.findAll({
        where: {
            order_id: req.params.id,
        },
    });
    const list = cuts.concat(veneers);
    res.status(200).json({ order, cuts, veneers });
};

export const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) {
            return next(errorHandler(404, "order not found!"));
        }
        if (order.start_cut !== null || order.start_veneer !== null) {
            return next(
                errorHandler(401, "order is in excution, it cant be deleted!!!")
            );
        }
        const cuts = await Cut.findAll({
            where: {
                order_id: req.params.id
            }
        });
        for (const cut of cuts) {
            await cut.destroy();
        }
        const veneers = await Veneer.findAll({
            where: {
                order_id: req.params.id
            }
        });
        for (const veneer of veneers) {
            veneer.destroy();
        }

        await Order.destroy({ where: { id: req.params.id } });
        res.status(200).json("Order has been deleted");
    } catch (err) {
        next(err);
    }
};

export const veneerQueue = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: {
                [Op.or]: [
                    { start_veneer: null },
                    { start_veneer: false }
                ]
            },
            order: [['order_date', 'ASC']],
            limit: 5,
        });
        let est = 0;
        let esd = new Date();
        const list = await Promise.all(
            orders.map(async (order) => {
                const veneerEST = await Veneer.count({
                    where: {
                        order_id: order.id
                    }
                });
                const cust = await Customer.findOne({
                    where: {
                        id : order.customer_id,
                    }
                });
                const veneers = await Veneer.findAll({
                    where: {
                        order_id : order.id
                    }
                })
                const name = cust.name;
                est += veneerEST * 2;
                esd.setTime(esd.getTime() + (est * 60 * 1000));
                return [order,veneers, est, esd, name];
            })
        );
        //console.log(list);


        res.status(200).json(list);
    }
    catch (error) {
        next(error)
    }
};


export const cutQueue = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            where: {
                [Op.or]: [
                    { start_cut: null },
                    { start_cut: false }
                ]
            },
            order: [['order_date', 'ASC']],
            limit: 5,
        });
        let est = 0;
        let esd = new Date();
        const list = await Promise.all(
            orders.map(async (order) => {
                const cutEST = await Cut.count({
                    where: {
                        order_id: order.id
                    }
                });
                const cust = await Customer.findOne({
                    where: {
                        id: order.customer_id,
                    }
                });
                const cuts = await Cut.findAll({
                    where: {
                        order_id: order.id
                    }
                });
                const name = cust.name;
                est += cutEST * 2;
                esd.setTime(esd.getTime() + (est * 60 * 1000));
                return [order, cuts, est, esd, name];
            })
        );


        res.status(200).json(list);
    }
    catch (error) {
        next(error)
    }
};

export const startCut = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);

        order.update({ start_cut: true });
        const veneer = await Veneer.findOne({
            where: {
                order_id: req.params.id,
            }
        });

        res.status(200).json("");
    }
    catch (e) {
        next(e);
    }
};

export const startVeneer = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        order.update({ start_veneer: true});
        res.status(200).json("");
    }
    catch (e) {
        next(e);
    }
};

export const cutEnd = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        const veneer = await Veneer.findAll({
            where: {
                order_id: order.id,
            }
        });
        if (veneer.length === 0) {
            order.update({ real_date: new Date() });
        }
        console.log("triggered");
        res.status(200).json("");
    } catch (e) {
        next(e);
    }
}

export const veneerEnd = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id);
        order.update({ real_date: new Date() });

        res.status(200).json("");
    } catch (e) {
        next(e);
    }
}
