import { Response } from "express";
import { AuthRequest } from "../types/authRequest";
import PaymentMethod from "../models/PaymentMethod";

// GET /api/payment-methods
export const getMyPaymentMethods = async (req: AuthRequest, res: Response) => {
  const methods = await PaymentMethod.find({ customerId: req.user!.id }).sort({ isDefault: -1, createdAt: -1 });
  res.json(methods);
};

// POST /api/payment-methods — the first saved method becomes the default automatically
export const addPaymentMethod = async (req: AuthRequest, res: Response) => {
  const { type, label, phoneNumber, isDefault } = req.body;

  if (type === "Whish" && !phoneNumber) {
    return res.status(400).json({ message: "A phone number is required for Whish" });
  }

  const existingCount = await PaymentMethod.countDocuments({ customerId: req.user!.id });
  const shouldBeDefault = isDefault || existingCount === 0;

  if (shouldBeDefault) {
    await PaymentMethod.updateMany({ customerId: req.user!.id }, { isDefault: false });
  }

  const method = await PaymentMethod.create({
    customerId: req.user!.id,
    type,
    label,
    phoneNumber: type === "Whish" ? phoneNumber : undefined,
    isDefault: shouldBeDefault,
  });

  res.status(201).json(method);
};

// PATCH /api/payment-methods/:id/default
export const setDefaultPaymentMethod = async (req: AuthRequest, res: Response) => {
  const method = await PaymentMethod.findOne({ _id: req.params.id, customerId: req.user!.id });
  if (!method) return res.status(404).json({ message: "Payment method not found" });

  await PaymentMethod.updateMany({ customerId: req.user!.id }, { isDefault: false });
  method.isDefault = true;
  await method.save();

  res.json(method);
};

// DELETE /api/payment-methods/:id
export const deletePaymentMethod = async (req: AuthRequest, res: Response) => {
  const method = await PaymentMethod.findOneAndDelete({ _id: req.params.id, customerId: req.user!.id });
  if (!method) return res.status(404).json({ message: "Payment method not found" });

  if (method.isDefault) {
    const next = await PaymentMethod.findOne({ customerId: req.user!.id }).sort({ createdAt: -1 });
    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  res.json({ message: "Payment method deleted" });
};
