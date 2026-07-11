import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import adminRoutes from "./routes/adminRoutes";
import addressRoutes from "./routes/addressRoutes";
import paymentMethodRoutes from "./routes/paymentMethodRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
