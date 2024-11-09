import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Song } from "../models/song.model.js";

const addSong = asyncHandler(async (req, res) => {
  const { name, desc, album } = req.body;
  const imageFilePath = req.files?.image[0].path;
  const audoFilePath = req.files?.audio[0].path;

  if ([name, desc, album].some((field) => field?.trim() == "")) {
    throw new ApiError(400, "All fiels are required");
  }

  if (!imageFilePath) {
    throw new ApiError(400, "Image is required");
  }
  if (!addSong) {
    throw new ApiError(400, "Audio is required");
  }

  const filesPath = [imageFilePath, audoFilePath];
  const filesType = ["image", "video"];

  //uploading files
  let files = [];
  for (let i = 0; i < 2; i++) {
    const cloudinaryResponse = await uploadOnCloudinary(
      filesPath[i],
      filesType[i]
    );
    files.push(cloudinaryResponse);
  }

  const duration = `${Math.floor(files[1].duration / 60)}:${Math.floor(files[1].duration % 60)}`;

  //create song object and create an entry in db
  const song = await Song.create({
    name,
    desc,
    album,
    image: files[0].secure_url,
    file: files[1].secure_url,
    duration,
  });

  //check song is added or not
  const addedSong = await Song.findById(song._id).select("-image -file");

  files.length = 0;
  console.log(files);

  return res.status(200).json(new ApiResponse(200, addedSong, "Song Added"));
});

//listsongs
const listSong = asyncHandler(async (req, res) => {
  const allSongs = await Song.find({});

  return res.status(200).json(new ApiResponse(200, allSongs, "allSongs"));
});

const removeSong = asyncHandler(async (req, res) => {
  
})

export { addSong, listSong };
