import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const where =
      req.user.role === "ADMIN"
        ? {}
        : { authorId: req.user.id };

    const [total, open, inProgress, resolved, books] = await Promise.all([
      prisma.ticket.count({ where }),
      prisma.ticket.count({
        where: { ...where, status: "OPEN" },
      }),
      prisma.ticket.count({
        where: { ...where, status: "IN_PROGRESS" },
      }),
      prisma.ticket.count({
        where: { ...where, status: "RESOLVED" },
      }),
      prisma.book.findMany({
        where: req.user.role === "ADMIN" ? {} : { authorId: req.user.id },
        select: {
          totalCopiesSold: true,
          totalRoyaltyEarned: true,
          royaltyPaid: true,
          royaltyPending: true,
        },
      }),
    ]);

    res.json({
      total,
      open,
      inProgress,
      resolved,
      books: books.length,
      copiesSold: books.reduce((sum, book) => sum + book.totalCopiesSold, 0),
      royaltyEarned: books.reduce((sum, book) => sum + book.totalRoyaltyEarned, 0),
      royaltyPaid: books.reduce((sum, book) => sum + book.royaltyPaid, 0),
      royaltyPending: books.reduce((sum, book) => sum + book.royaltyPending, 0),
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Could not load dashboard",
    });
  }
});

export default router;