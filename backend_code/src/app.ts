import express from "express";
import { config } from "./config/config";
import "./config/dbConnection"; // Ensure DB connection is established
import authRoutes from "./routes/auth/auth.route";
import categoryRoutes from "./routes/category/category.route";
import errorHandler from "./middleware/errorHandler";
import courseRoutes from "./routes/course/course.route";
import enrollmentRoutes from "./routes/enrollment/enrollment.route";
import userRoutes from './routes/user/user.route'
import configCloudinary from "./config/cloudinaryConfig";
import cors from "cors"

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser middleware
app.use(express.json());
configCloudinary();

// Halth check route
app.get("/", (req, res) => {
  res.status(200).json({
    name: "GyanamritLMS Server",
    description: " This is the backend server for Gyanamrit application",
    status: "Running",
    port: config.port,
    company: "Gyanamrit",
    version: "1.0.0",
    developer: {
      name: "Mero Technology",
      website: "https://merotechnology.com",
      developer_name: "Farindra Bdr. Bhandari",
      developer_website: "https://fbb.com.np",
    },
  });
});

// auth route
app.use(`/v1/api/auth`, authRoutes);

// category route
app.use("/v1/api/category", categoryRoutes);

// courseRoute
app.use("/v1/api/course", courseRoutes);

// enrollmenRoute
app.use("/v1/api/enrollment", enrollmentRoutes);

// userRoute
app.use("/v1/api/user", userRoutes)

app.use(errorHandler);

export default app;
