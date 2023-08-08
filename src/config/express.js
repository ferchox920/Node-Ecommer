import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import productRouter from "../routes/products.js";
import categoryRouter from "../routes/category.js";
import userRouter from "../routes/user.js";
import authRoutes from "../routes/auth.js";
import authJwt from "../helper/jwt.js";
import errorHandler from "../helper/error-handler.js";
import orderRouter from "../routes/orders.js";

config();

const expressApp = express();

// Middlewares
// Middlewares
expressApp.use(
  cors({
    origin: ["http://localhost:5173", process.env.URL_FRONT],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "reset",
      "pos",
      "confirm",
    ],
    methods: ["GET", "PUT", "POST", "DELETE"], // agregamos los métodos permitidos
  })
);

expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());
expressApp.use(cookieParser());
expressApp.use(morgan("dev"));
expressApp.use(authJwt());
expressApp.use(errorHandler);

//ROUTAS
expressApp.use(`${process.env.API_URL}/products`, productRouter);
expressApp.use(`${process.env.API_URL}/category`, categoryRouter);
expressApp.use(`${process.env.API_URL}/user`, userRouter);
expressApp.use(`${process.env.API_URL}/auth`, authRoutes);
expressApp.use(`${process.env.API_URL}/orders`, orderRouter);

expressApp.get(`${process.env.API_URL}/`, (req, res) => {
  res.send("Hello World!");
});

expressApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "*");
  next();
});

export default expressApp;
