import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { config } from "dotenv";


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

const api= process.env.API_URL;
console.log(api);
//ROUTAS
expressApp.get(`${api}/`, (req, res) => {
  res.send("Hello World!");
});

expressApp.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "*");
  next();
});

export default expressApp;
