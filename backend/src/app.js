import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import channelRoutes from "./routes/channel.routes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import audienceRoutes from './routes/audienceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api", routes);
app.use("/api/channels", channelRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/audiences', audienceRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;