import express from "express";
import {
    createOrder,
    displayOrder,
    cancelOrder,
    cutQueue,
    veneerQueue,
    startCut,
    startVeneer,
    cutEnd,
    veneerEnd,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/display/:id", displayOrder);
router.delete("/cancel/:id", cancelOrder);
router.get("/cut-queue", cutQueue);
router.get("/veneer-queue", veneerQueue);
router.get("/start-cut/:id", startCut);
router.get("/start-veneer/:id", startVeneer);
router.get("/cut-end/:id", cutEnd);
router.get("/veneer-end/:id", veneerEnd);


export default router;
