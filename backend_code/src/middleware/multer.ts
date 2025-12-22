import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, //2MB
  fileFilter(req, file, callback) {
    const filetype = ["image/jpg", "image/png", "image/jpeg", "image/webp"];
    if (filetype.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Invalid file type. Only JPG, JPEG, PNG, and WEBP are supported."
        )
      );
    }
  },
});
