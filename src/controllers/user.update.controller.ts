import { Request, Response } from "express";
import prisma from "../config/prisma";

/**
 * PUT /api/users/:id
 * Protected — update own profile only
 * Body: any subset of { name, phone, homeAddress, officeAddress, officeEntryTime }
 * NOTE: email + password changes should be separate, dedicated endpoints later
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Users can only update their own profile
    if (req.params.id !== req.user!.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { firstName, lastName, phone, homeAddress, officeId, officeEntryTime } =
      req.body;

    const updated = await prisma.user.update({
      where: { id: req.params.id as string },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(homeAddress && { homeAddress }),
        ...(officeId && { officeId }),
        ...(officeEntryTime && { officeEntryTime }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        homeAddress: true,
        officeId: true,
        officeEntryTime: true,
        updatedAt: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Profile updated", user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};