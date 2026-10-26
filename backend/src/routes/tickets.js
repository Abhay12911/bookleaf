import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { analyzeTicket } from "../services/ai.js";

const router = Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const { subject, description, bookId } = req.body;

    if (!subject?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Subject and description are required",
      });
    }

    if (req.user.role !== "AUTHOR") {
      return res.status(403).json({
        message: "Only authors can create tickets",
      });
    }

    if (bookId) {
      const book = await prisma.book.findFirst({
        where: {
          id: bookId,
          authorId: req.user.id,
        },
      });

      if (!book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }
    }

    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        authorId: req.user.id,
        bookId: bookId || null,
        status: "OPEN",
        category: "GENERAL_INQUIRY",
        priority: "MEDIUM",
      },
    });

    // AI analysis is attempted after the ticket is saved.
    // If AI fails, the ticket still exists.
    try {
      const aiResult = await analyzeTicket({
        subject,
        description,
      });

      await prisma.ticket.update({
        where: { id: ticket.id },
        data: {
          category: aiResult.category,
          priority: aiResult.priority,
          aiDraft: aiResult.draftResponse || null,
        },
      });
    } catch (aiError) {
      console.error("Ticket AI analysis failed:", aiError);
    }

    const updatedTicket = await prisma.ticket.findUnique({
      where: { id: ticket.id },
    });

    res.status(201).json(updatedTicket);
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({ message: "Could not create ticket" });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where:
        req.user.role === "ADMIN"
          ? {}
          : { authorId: req.user.id },
      include: {
        book: true,
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { name: true, email: true, role: true } } },
        },
        ...(req.user.role === "ADMIN"
          ? {
              notes: {
                orderBy: { createdAt: "asc" },
                include: { author: { select: { name: true, email: true } } },
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tickets);
  } catch (error) {
    console.error("Fetch tickets error:", error);
    res.status(500).json({ message: "Could not fetch tickets" });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where:
        req.user.role === "ADMIN"
          ? { id: req.params.id }
          : {
              id: req.params.id,
              authorId: req.user.id,
            },
      include: {
        book: true,
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { name: true, email: true, role: true } } },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Fetch ticket error:", error);
    res.status(500).json({ message: "Could not fetch ticket" });
  }
});

router.post("/:id/messages", authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const ticket = await prisma.ticket.findFirst({
      where:
        req.user.role === "ADMIN"
          ? { id: req.params.id }
          : {
              id: req.params.id,
              authorId: req.user.id,
            },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const message = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: req.user.id,
        content,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Create message error:", error);
    res.status(500).json({ message: "Could not send message" });
  }
});

export default router;