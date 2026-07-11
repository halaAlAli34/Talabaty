import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { createOrder, getMyOrders, getOrderById, getPartnerOrders } from "../controllers/orderController";

const router = Router();

router.post("/", protect, authorize("customer"), createOrder);
router.get("/mine", protect, authorize("customer"), getMyOrders);
router.get("/partner-mine", protect, authorize("partner"), getPartnerOrders);
router.get("/:id", protect, authorize("customer"), getOrderById);

export default router;
