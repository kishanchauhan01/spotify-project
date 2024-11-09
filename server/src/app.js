import express from "express";
import cors from "cors";

//app config
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello I'm root !!!");
});

//initializing routes
import songRouter from "./routes/song.route.js";

app.use("/api/v1/song", songRouter);

export { app };
