import express from "express";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(express.json()); // parse JSON request bodies

app.use("/api/users", userRoutes);

// Health check — always useful
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app;
