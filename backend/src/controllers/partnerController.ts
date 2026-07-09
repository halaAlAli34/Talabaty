import { Request, Response } from "express";
import PartnerProfile from "../models/PartnerProfile";
import User from "../models/User";

// POST /api/partners/me — a partner completes their store profile after registering
export const createMyProfile = async (req: Request, res: Response) => {
  const { storeName, description, address, phoneNumber } = req.body;

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
  });

  res.status(201).json(profile);
};

// GET /api/partners/me
export const getMyProfile = async (req: Request, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  if (!profile) return res.status(404).json({ message: "Partner profile not found" });
  res.json(profile);
};

// GET /api/partners — public storefront listing (only approved/active partners)
export const listPartners = async (req: Request, res: Response) => {
  const activePartnerUserIds = await User.find({ role: "partner", status: "active" }).distinct("_id");
  const partners = await PartnerProfile.find({ userId: { $in: activePartnerUserIds } });
  res.json(partners);
};
