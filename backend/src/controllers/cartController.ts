import { Request, Response } from "express";
import Cart from "../models/Cart";

// GET /api/cart
export const getMyCart = async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ customerId: req.user!.id }).populate("items.productId");
  if (!cart) {
    cart = await Cart.create({ customerId: req.user!.id, items: [] });
  }
  res.json(cart);
};

// POST /api/cart/items
export const addItem = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ customerId: req.user!.id });
  if (!cart) {
    cart = await Cart.create({ customerId: req.user!.id, items: [] });
  }

  const existingItem = cart.items.find((i) => i.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
};
