import { Router } from "express";
import { prisma } from "../config/prisma.js";
import {
  authenticate,
  authorize,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/tickets", async (req, res) => {
  try {
    const { status, priority, category, from, to } = req.query;
    const dateFilter =
      from || to
        ? {
            createdAt: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(`${to}T23:59:59.999Z`) } : {}),
            },
          }
        : {};

    const tickets = await prisma.ticket.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(category ? { category } : {}),
        ...dateFilter,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            city: true,
          },
        },
        book: true,
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { name: true, email: true, role: true } } },
        },
        notes: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tickets);
  } catch (error) {
    console.error("Admin tickets error:", error);
    res.status(500).json({ message: "Could not fetch tickets" });
  }
});

router.patch("/tickets/:id", async (req, res) => {
  try {
    const { status, priority, category, assignedToId } = req.body;

    const allowedStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "WAITING_FOR_AUTHOR",
      "RESOLVED",
      "CLOSED",
    ];

    const allowedPriorities = ["CRITICAL", "LOW", "MEDIUM", "HIGH"];
    const allowedCategories = [
      "ROYALTY_PAYMENTS",
      "ISBN_METADATA",
      "PRINTING_QUALITY",
      "DISTRIBUTION_AVAILABILITY",
      "BOOK_STATUS_PRODUCTION",
      "GENERAL_INQUIRY",
    ];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(category ? { category } : {}),
        ...(assignedToId !== undefined ? { assignedToId } : {}),
      },
    });

    res.json(ticket);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ message: "Could not update ticket" });
  }
});

router.post("/tickets/:id/reply", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Reply content is required",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
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

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: "WAITING_FOR_AUTHOR" },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Admin reply error:", error);
    res.status(500).json({ message: "Could not send reply" });
  }
});

router.post("/tickets/:id/notes", async (req, res) => {
  const content = req.body.content?.trim();

  if (!content) {
    return res.status(400).json({ message: "Note content is required" });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const note = await prisma.ticketNote.create({
      data: { content, ticketId: ticket.id, authorId: req.user.id },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Admin note error:", error);
    res.status(500).json({ message: "Could not add internal note" });
  }
});

export default router;