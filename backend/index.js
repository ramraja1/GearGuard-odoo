import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";

import teamRoutes from "./routes/team.routes.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import requestRoutes from "./routes/request.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/teams", teamRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/requests", requestRoutes);

app.listen(5000, () => console.log("Server running on 5000"));
