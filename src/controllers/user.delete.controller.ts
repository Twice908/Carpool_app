import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * DELETE /api/users/:id
 * Protected — delete own account only
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (req.params.id !== req.user!.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.user.delete({ where: { id: req.params.id as string } });

    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};