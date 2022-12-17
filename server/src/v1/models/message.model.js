const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    message: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "chat",
    },
  },
  {
    collection: "message",
    timestamps: true,
  }
);

module.exports = model("message", messageSchema);
