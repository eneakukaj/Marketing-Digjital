import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import audienceRoutes from './routes/audienceRoutes.js';

const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api", routes);

app.use('/api/audiences', audienceRoutes);

export default app;