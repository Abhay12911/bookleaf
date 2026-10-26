import jwt from "jsonwebtoken";

import { prisma } from "../config/prisma.js";

export async function authenticate(
    req,
    res,
    next
) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },

            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

export function authorize(...roles) {
    return (req, res, next) => {
        if (
            !req.user ||
            !roles.includes(req.user.role)
        ) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    };
}