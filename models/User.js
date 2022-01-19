import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    namaLengkap: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    npwpd: { type: String },
    alamat: {
      detail: { type: String },
      kec: { type: String },
      kabKot: { type: String },
      hpTel: { type: String },
    },
    status: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
