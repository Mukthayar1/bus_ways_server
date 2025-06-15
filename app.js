import dontenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./config/connect.js";
import { PORT } from "./config/config.js";

import userRoutes from "./routes/user.js";
import busRoutes from "./routes/bus.js";
import ticketRoutes from "./routes/ticket.js";
import { buildAdminJS } from "./config/setup.js";

dontenv.config();
const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "POST", "DELETE", "PUT", "MATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/bus", busRoutes);
app.use("/ticket", ticketRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await buildAdminJS(app)
    app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
      if (err) {
        console.log("Failed to listen server", err);
      } else {
        console.log(
          `server started successfully started: http://localhost:${PORT}/admin`
        );
      }
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

start();
