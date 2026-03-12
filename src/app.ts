import { toNodeHandler } from "better-auth/node";
import express, { Application } from "express";
import path from "path";
import { auth } from "./libs/auth";
import { indexRoutes } from "./routes/index";

const app: Application = express();

// Enable urlencoded body parsing
app.use(express.urlencoded({ extended: true }));

// Enable JSON body parsing
app.use(express.json());

// better-auth routes
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Use the index routes
app.use("/api/v1", indexRoutes);

// Root route renders an HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

export default app;
