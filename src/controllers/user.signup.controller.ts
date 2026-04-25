import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/auth";
import { SALT_ROUNDS } from "../constants";
import prisma from "../config/prisma";

/**
 * POST /api/users/register
 * Public
 * Body: { name, email, password, phone, homeAddress, officeAddress, officeEntryTime }
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      homeAddress,
      homeLat,
      homeLng,
      officeId,
      officeEntryTime,
      officeExitTime,
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "firstName, lastName, email and password are required" });
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password — NEVER store plain text
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        homeAddress,
        homeLat,
        homeLng,
        officeId,
        officeEntryTime,
        officeExitTime,
      },
      // Never return the password field in any response
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

    const token = generateToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};