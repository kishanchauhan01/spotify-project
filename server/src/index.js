import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { connectCloudinary } from "./utils/cloudinary.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    connectCloudinary()
      .then(() => {
        app.on("error", (error) => {
          console.log("ERROR before listening: ", error);
          throw error;
        });

        app.listen(process.env.PORT || 4000, () => {
          console.log(
            `app is listening on http://localhost:${process.env.PORT}`
          );
        });
      })
      .catch((err) => {
        console.log("Cloudinary connection failed !!! ", err);
      });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });
