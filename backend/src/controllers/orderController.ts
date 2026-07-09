import { Request, Response } from "express";
import Cart from "../models/Cart";
import Order from "../models/Order";
import Product from "../models/Product";
import PartnerProfile from "../models/PartnerProfile";

// POST /api/orders — checkout: snapshot cart items into an order
export const createOrder = async (req: Request, res: Response) => {
  const { paymentMethod } = req.body;

  const cart = await Cart.findOne({ customerId: req.user!.id }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const orderItems = [];
  let totalAmount = 0;
  let partnerId;

  for (const item of cart.items) {
    const product = item.productId as any;
    orderItems.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;
    partnerId = product.partnerId;
  }

  const order = await Order.create({
    customerId: req.user!.id,
    partnerId,
    items: orderItems,
    totalAmount,
    paymentMethod,
  });

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

// GET /api/orders/mine — customer's own order history
export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ customerId: req.user!.id }).sort({ createdAt: -1 });
  res.json(orders);
};

// GET /api/orders/partner-mine — orders placed with the logged-in partner's store
export const getPartnerOrders = async (req: Request, res: Response) => {
  const profile = await PartnerProfile.findOne({ userId: req.user!.id });
  if (!profile) return res.json([]);
  const orders = await Order.find({ partnerId: profile._id }).sort({ createdAt: -1 });
  res.json(orders);
};
