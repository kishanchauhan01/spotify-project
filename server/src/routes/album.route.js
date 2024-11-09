import { Router } from "express";
import {
  addAlbum,
  listAlbum,
  removeAlbum,
} from "../controllers/album.controller.js";
import { upload } from "../middlewares/multer.midlleware.js";

const router = Router();

router.route("/add").post(upload.single("image"), addAlbum);

router.route("/list").get(listAlbum);
router.route("/remove/:id").post(removeAlbum);

export default router;
