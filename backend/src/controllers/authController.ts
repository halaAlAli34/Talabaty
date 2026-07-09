import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  const { name, email, password, role, phone, town } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Only "customer" or "partner" can self-register through this public
  // endpoint. Admin accounts are never created here, regardless of what
  // the client sends — this is enforced server-side, not just hidden in the UI.
  const safeRole = role === "partner" ? "partner" : "customer";
  const status = safeRole === "partner" ? "pending" : "active";

  const user = await User.create({ name, email, password, role: safeRole, status, phone, town });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    token: generateToken(user._id.toString(), user.role),
  });
};

// POST /api/auth/login
// body: { email, password, role } — "role" is which tab the person picked
// on the login screen (Customer / Partner / Admin). It's cosmetic on the
// frontend, but the backend uses it to reject a mismatch: correct password
// through the wrong tab is still rejected, so the Admin tab can't be used
// to probe whether an email belongs to an admin account.
export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ message: "This account is not registered as that account type" });
  }

  if (user.status === "frozen") {
    return res.status(403).json({ message: "This account has been frozen by an administrator" });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    token: generateToken(user._id.toString(), user.role),
  });
};
