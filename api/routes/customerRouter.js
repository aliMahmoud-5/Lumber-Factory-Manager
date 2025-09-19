import express from "express";
import {
    createCustomer,
    updateCustomer,
    getCustomerOrders,
    getCustomer,
    getAllCustomers,
    getLatestOrder,
    getCustomerByPhone,

} from "../controllers/customerController.js";
const router = express.Router();

router.post("/create", createCustomer);
router.post("/update/:dep/:id", updateCustomer);
router.get("/get-latest/:id", getLatestOrder);
router.get("/get-orders/:id", getCustomerOrders);
router.get("/get/:id", getCustomer);
router.get("/getAll/", getAllCustomers);
router.post("/get", getCustomerByPhone);

export default router;
