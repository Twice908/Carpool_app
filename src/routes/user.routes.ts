import express from "express";
import { signup } from "../controllers/user.signup.controller";
import { signin } from "../controllers/user.signin.controller";
import { getMe, getAllUsers, getUserById } from "../controllers/user.get.controller";
import { updateUser } from "../controllers/user.update.controller";
import { deleteUser } from "../controllers/user.delete.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// ── AUTH ──────────────────────────────────────────────────────────

/**
 * POST /api/users/register
 */
router.post("/register", signup);

/**
 * POST /api/users/login
 */
router.post("/login", signin);

// ── PROTECTED ROUTES (JWT required from here) ────────────────────

/**
 * GET /api/users/me
 */
router.get("/me", authenticateToken, getMe);

/**
 * GET /api/users
 */
router.get("/", authenticateToken, getAllUsers);

/**
 * GET /api/users/:id
 */
router.get("/:id", authenticateToken, getUserById);

/**
 * PUT /api/users/:id
 */
router.put("/:id", authenticateToken, updateUser);

/**
 * DELETE /api/users/:id
 */
router.delete("/:id", authenticateToken, deleteUser);

export default router;