import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth";
import prisma from "../config/prisma";

/**
 * POST /api/users/login
 * Public
 * Body: { email, password }
 */
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Intentionally vague — don't reveal whether email exists
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        homeAddress: user.homeAddress,
        officeId: user.officeId,
        officeEntryTime: user.officeEntryTime,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 