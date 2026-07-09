import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { getMyCart, addItem } from "../controllers/cartController";

const router = Router();

router.get("/", protect, authorize("customer"), getMyCart);
router.post("/items", protect, authorize("customer"), addItem);

export default router;
