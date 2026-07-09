import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import { createMyProfile, getMyProfile, listPartners } from "../controllers/partnerController";

const router = Router();

router.get("/", listPartners);
router.post("/me", protect, authorize("partner"), createMyProfile);
router.get("/me", protect, authorize("partner"), getMyProfile);

export default router;
