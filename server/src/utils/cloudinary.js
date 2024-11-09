import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const connectCloudinary = async () => {
  try {
    await cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("cludinary connected !!! \n");
  } catch (error) {
    console.log("cloudinary connection error: ", error);
    process.exit(1);
  }
};

const uploadOnCloudinary = async (localFilePath, fileType) => {
  try {
    if (!localFilePath) return null;
    //upload local file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: fileType,
    });

    // console.log(response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("error while uploading on cloudinary: ", error);
    return null;
  }
};

const deleteFromCloudinary = async (public_id, fileType) => {
  try {
    const response = await cloudinary.api.delete_resources(public_id, {
      resource_type: fileType,
    });
    // console.log(`delete successfully for ${public_id}`, response.deleted);
    return response;
  } catch (error) {
    console.log("error while deletinf from cloudinary: ", error);
    return null;
  }
};

export { connectCloudinary, uploadOnCloudinary, deleteFromCloudinary };
