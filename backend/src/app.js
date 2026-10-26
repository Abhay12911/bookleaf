import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import ticketRoutes from "./routes/tickets.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    message: "BookLeaf API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/dashboard", dashboardRoutes);

export default app;