import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import companyRoutes from "./routes/companyRoutes"
import connectDB from "./config/db";

dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const app: Application = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Test route
    app.get("/", (_req: Request, res: Response) => {
      res.send("All systems active");
    });

    // API routes
    app.use("/api/companies", companyRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error while starting the server:", error);
    process.exit(1);
  }
};

startServer();
