const { Schema, model } = require("mongoose");
const validator = require("validator");

let image =
  "https://res.cloudinary.com/dfxk0fqfp/image/upload/v1626342025/watchshopstorage/default-avatar-profile-icon-vector-social-media-user-portrait-176256935_ci9odi.jpg";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide Username"],
      trim: true,
      minlength: 4,
    },
    avatar: {
      type: String,
      default: image,
    },
    email: {
      type: String,
      required: [true, "Please Provide Email"],
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please Provide Email",
      },
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      minlength: 8,
      trim: true,
    },
    bio: {
      type: String,
      default: "Hello There!",
      minlength: 2,
      maxlength: 250,
    },
  },
  {
    collection: "user",
    timestamps: true,
  }
);

module.exports = model("user", userSchema);
