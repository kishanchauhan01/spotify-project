import { Router } from "express";
import {
  addSong,
  listSong,
  removeSong,
} from "../controllers/song.controller.js";
import { upload } from "../middlewares/multer.midlleware.js";


const router = Router();

router.route("/add").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "audio",
      maxCount: 1,
    },
  ]),
  addSong
);

router.route("/list").get(listSong);
router.route("/remove/:id").post(removeSong);

export default router;
