const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with environment variables (ensure these are set in your environment)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dx5gwfetc",  // Use environment variables for sensitive data
  api_key: process.env.CLOUDINARY_API_KEY || "575799595654388",
  api_secret: process.env.CLOUDINARY_API_SECRET || "AiaeeqA62Ir-lw5VyFbPGIwSyss",
}); 

// Function to upload a file to Cloudinary
const uploadMediaToCloudinary = async (filePath) => {
  try {
    // console.log("Uploading file from path:", filePath);  // Log the file path being uploaded
    
    // Upload the file to Cloudinary with resource_type: 'auto' to handle images, videos, or other types automatically
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // console.log("File uploaded successfully to Cloudinary:", result.url);  // Log the uploaded file URL
    
    // Return the result object, which contains the URL of the uploaded file
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);  // Log the error details
    throw new Error(`Error uploading to Cloudinary: ${error.message}`);  // Throw a more detailed error
  }
};

// Function to delete a media file from Cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    console.log("Deleting media with publicId:", publicId);  // Log the media ID being deleted
    
    // Delete the file from Cloudinary using its publicId
    await cloudinary.uploader.destroy(publicId);
    console.log(`Media with publicId: ${publicId} has been deleted from Cloudinary.`);
  } catch (error) {
    console.error("Error deleting asset from Cloudinary:", error);  // Log the error details
    throw new Error("Failed to delete asset from Cloudinary");  // Throw a detailed error
  }
};

// Export the functions to be used in other files
module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };