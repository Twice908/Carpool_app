import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * GET /api/users/me
 * Protected — returns the logged-in user's own profile
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        homeAddress: true,
        officeId: true,
        officeEntryTime: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/users
 * Protected — list all users (useful during dev; restrict later)
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        homeAddress: true,
        officeId: true,
        officeEntryTime: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ count: users.length, users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /api/users/:id
 * Protected — get a specific user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id as string },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        homeAddress: true,
        officeId: true,
        officeEntryTime: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};