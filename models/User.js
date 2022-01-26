import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    namaLengkap: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    image: { type: String },
    hpTel: { type: String },
    npwpd: { type: String },
    alamat: {
      detail: { type: String },
      kec: { type: String },
      kabKot: { type: String, default: "Kota Palangka Raya" },
    },
    status: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

// STATUS :
// 1 = Pendaftaran; 2 = Pendataan; 3 = Perubahan
