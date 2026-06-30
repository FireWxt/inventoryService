import "dotenv/config";
import type { NextFunction, Request, Response } from "express";

const HOST_TOKEN = process.env.HOST_TOKEN ?? "tp-secret-host-token";

export function requireHostToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.header("x-host-token") !== HOST_TOKEN) {
    return res.status(401).json({ error: "Missing or invalid host token" });
  }
  next();
}
