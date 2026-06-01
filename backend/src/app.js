import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import channelRoutes from "./routes/channel.routes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import audienceRoutes from './routes/audienceRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import dashboardRoutes from "./routes/dashboard.routes.js";
import abTestRoutes from "./routes/abtest.routes.js";
import abFeedbackRoutes from "./routes/abfeedback.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);
app.use("/api/channels", channelRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/audiences', audienceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/ab-tests", abTestRoutes);
app.use("/api/ab-feedbacks", abFeedbackRoutes);

export default app;