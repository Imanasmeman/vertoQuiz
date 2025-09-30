const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "organization", "student"],
    default: "student"
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
