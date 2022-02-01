import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true, default: 1 },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  username: "text",
  email: "text",
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

// STATUS :
// 1 = Pendaftaran; 2 = Pendataan; 3 = Perubahan
