import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import Product from "../models/Product";
import PartnerProfile from "../models/PartnerProfile";

// GET /api/products — public catalog browsing
export const listProducts = async (req: Request, res: Response) => {
  const { category } = req.query;
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter.category = category;
  const products = await Product.find(filter).limit(50);
  res.json(products);
};

// POST /api/products — partner creates a product listing
export const createProduct = async (req: AuthRequest, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  if (!profile) {
    return res.status(400).json({ message: "Complete your partner profile first" });
  }

  const { title, description, price, imageUrl, category } = req.body;
  const product = await Product.create({
    partnerId: profile._id,
    title,
    description,
    price,
    imageUrl,
    category,
  });

  res.status(201).json(product);
};

// GET /api/products/mine — partner's own products (any status, not just active)
export const listMyProducts = async (req: AuthRequest, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  if (!profile) return res.json([]);
  const products = await Product.find({ partnerId: profile._id }).sort({ createdAt: -1 });
  res.json(products);
};

// DELETE /api/products/:id — partner deletes their own product only
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  const product = await Product.findOneAndDelete({ _id: req.params.id, partnerId: profile?._id });
  if (!product) {
    return res.status(404).json({ message: "Product not found or not owned by you" });
  }
  res.json({ message: "Product deleted" });
};

// PATCH /api/products/:id — partner updates their own product only
export const updateProduct = async (req: AuthRequest, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  const product = await Product.findOne({ _id: req.params.id, partnerId: profile?._id });

  if (!product) {
    return res.status(404).json({ message: "Product not found or not owned by you" });
  }

  Object.assign(product, req.body);
  await product.save();
  res.json(product);
};
