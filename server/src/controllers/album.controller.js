import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Album } from "../models/album.model.js";
import { extractPublicId } from "cloudinary-build-url";

const addAlbum = asyncHandler(async (req, res) => {
  const { name, desc, bgColor } = req.body;
  const imageFilePath = req.file?.path;

  if ([name, desc, bgColor].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "All fiels are required");
  }

  if (!imageFilePath) {
    throw new ApiError(400, "Image is required");
  }

  //uploading files
  const cloudinaryResponse = await uploadOnCloudinary(imageFilePath, "image");

  //create album object and create an entry in db
  const album = await Album.create({
    name,
    desc,
    bgColor,
    image: cloudinaryResponse.secure_url,
  });

  //check album is added or not
  const addedAlbum = await Album.findById(album._id).select("-image");

  return res.status(200).json(new ApiResponse(200, addedAlbum, "Album Added"));
});

//listAlbums
const listAlbum = asyncHandler(async (req, res) => {
  const allAlbum = await Album.find({});

  return res.status(200).json(new ApiResponse(200, allAlbum, "allAlbums"));
});

const removeAlbum = asyncHandler(async (req, res) => {
  const { id } = req.params;
  //first delete files from the cloudinary
  const { image } = await Album.findById(id);

  const deletedImage = await deleteFromCloudinary(
    extractPublicId(image),
    "image"
  );

  const deletedAlbum = await Album.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedAlbum, "album deleted!"));
});

export { addAlbum, listAlbum, removeAlbum };
