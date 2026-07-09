import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import PartnerProfile from "../models/PartnerProfile";
import User from "../models/User";

// POST /api/partners/me — a partner completes their store profile after registering
export const createMyProfile = async (req: AuthRequest, res: Response) => {
  const { storeName, description, address, phoneNumber, category, deliveryTime } = req.body;

  const existing = await PartnerProfile.findOne({ userId: req.user!.id });
  if (existing) {
    return res.status(400).json({ message: "Partner profile already exists" });
  }

  const profile = await PartnerProfile.create({
    userId: req.user!.id,
    storeName,
    description,
    address,
    phoneNumber,
    category,
    deliveryTime,
  });

  res.status(201).json(profile);
};

// GET /api/partners/me
export const getMyProfile = async (req: AuthRequest, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  if (!profile) return res.status(404).json({ message: "Partner profile not found" });
  res.json(profile);
};

// GET /api/partners — public storefront listing (only approved/active partners)
export const listPartners = async (req: Request, res: Response) => {
  const { category } = req.query;
  const activePartnerUserIds = await User.find({ role: "partner", status: "active" }).distinct("_id");
  const filter: Record<string, unknown> = { userId: { $in: activePartnerUserIds } };
  if (category) filter.category = category;
  const partners = await PartnerProfile.find(filter);
  res.json(partners);
};
