import { Request, Response } from "express";
import User from "../models/User";
import PartnerProfile from "../models/PartnerProfile";
import Product from "../models/Product";

// PATCH /api/admin/partners/:userId/approve
// Admin approves a pending partner registration.
export const approvePartner = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.role !== "partner") {
    return res.status(404).json({ message: "Partner account not found" });
  }
  user.status = "active";
  await user.save();
  res.json({ message: `${user.name} approved`, status: user.status });
};

// PATCH /api/admin/users/:userId/freeze
// Admin freezes a customer or partner account.
export const freezeUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.role === "admin") {
    return res.status(404).json({ message: "User not found" });
  }
  user.status = "frozen";
  await user.save();
  res.json({ message: `${user.name} frozen`, status: user.status });
};

// PATCH /api/admin/users/:userId/unfreeze
export const unfreezeUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.role === "admin") {
    return res.status(404).json({ message: "User not found" });
  }
  user.status = "active";
  await user.save();
  res.json({ message: `${user.name} reactivated`, status: user.status });
};

// DELETE /api/admin/users/:userId
// Admin deletes a customer or partner account (cascades their partner profile).
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.userId);
  if (!user || user.role === "admin") {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.role === "partner") {
    await PartnerProfile.deleteOne({ userId: user._id });
  }
  await user.deleteOne();
  res.json({ message: "User deleted" });
};

// GET /api/admin/products
// Admin monitors all products across every partner (read-only, per the BRD).
export const monitorAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find().populate("partnerId");
  res.json(products);
};

// GET /api/admin/customers
export const listCustomers = async (req: Request, res: Response) => {
  const customers = await User.find({ role: "customer" }).select("name email phone status createdAt");
  res.json(customers);
};

// GET /api/admin/partners
// Joins users (for status/approval) with partner_profiles (for store info).
export const listPartnersForAdmin = async (req: Request, res: Response) => {
  const partnerUsers = await User.find({ role: "partner" }).select("name email status");
  const profiles = await PartnerProfile.find({ userId: { $in: partnerUsers.map((u) => u._id) } });

  const merged = partnerUsers.map((u) => {
    const profile = profiles.find((p) => p.userId.toString() === u._id.toString());
    return {
      _id: u._id,
      name: u.name,
      status: u.status,
      storeName: profile?.storeName,
      address: profile?.address,
      phoneNumber: profile?.phoneNumber,
    };
  });

  res.json(merged);
};
