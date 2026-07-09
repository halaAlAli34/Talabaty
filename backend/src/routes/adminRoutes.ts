import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { authorize } from "../middleware/roleMiddleware";
import {
  approvePartner,
  freezeUser,
  unfreezeUser,
  deleteUser,
  monitorAllProducts,
  listCustomers,
  listPartnersForAdmin,
} from "../controllers/adminController";

const router = Router();

// Every route below requires a valid JWT AND role === "admin".
router.use(protect, authorize("admin"));

router.get("/customers", listCustomers);
router.get("/partners", listPartnersForAdmin);
router.patch("/partners/:userId/approve", approvePartner);
router.patch("/users/:userId/freeze", freezeUser);
router.patch("/users/:userId/unfreeze", unfreezeUser);
router.delete("/users/:userId", deleteUser);
router.get("/products", monitorAllProducts);

export default router;
