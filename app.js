import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/connect.js";
import { PORT } from "./config/config.js";

import userRoutes from "./routes/user.js";
import busRoutes from "./routes/bus.js";
import ticketRoutes from './routes/ticket.js';

dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "POST", "DELETE", "PUT", "MATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Bus Ways API");
});

app.use("/user", userRoutes);
app.use("/bus", busRoutes);
app.use("/ticket", ticketRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);

    // ✅ Initialize AdminJS
    // await buildAdminJS(app);

    // ✅ Start the server
    app.listen(PORT, "0.0.0.0", (err) => {
      if (err) {
        console.log("Failed to start server", err);
      } else {
        console.log(`Server running on http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

start();
