import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      where:
        req.user.role === "ADMIN"
          ? {}
          : { authorId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
          },
        },
      },
    });

    res.json(books);
  } catch (error) {
    console.error("Fetch books error:", error);
    res.status(500).json({ message: "Could not fetch books" });
  }
});

export default router;