const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "image",
};

exports.uploadImage = (image) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        console.log("[[[[[[image url]]]]]]]]", result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

module.exports.uploadMultipleImages = (images) => {
  return new Promise((resolve, reject) => {
    const uploads = images.map((base) => uploadImage(base));
    Promise.all(uploads)
      .then((values) => resolve(values))
      .catch((err) => reject(err));
  });
};

exports.deleteImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const publicId = imageUrl.split("/").pop().split(".")[0];
    cloudinary.uploader.destroy(publicId, (error, result) => {
      console.log("result", result);
      if (result && result.result === "ok") {
        console.log("[[[[[[image deleted]]]]]]]]", result);
        return resolve(result);
      }
      console.log("error deleting image", error);
      return reject({ message: error.message });
    });
  });
};

exports.updateImage = async (newImage, oldImageUrl) => {
  await this.deleteImage(oldImageUrl);
  return await this.uploadImage(newImage);
};
//export uploadImage function as default
