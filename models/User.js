import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    namaLengkap: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    image: { type: String },
    hpTel: { type: String },
    npwpd: { type: String, index: true },
    alamat: {
      detail: { type: String, index: true },
      kec: { type: String },
      kabKot: { type: String, default: "Kota Palangka Raya" },
    },
    status: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  namaLengkap: "text",
  npwpd: "text",
  "alamat.detail": "text",
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;

// STATUS :
// 1 = Pendaftaran; 2 = Pendataan; 3 = Perubahan
