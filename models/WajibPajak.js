import mongoose from "mongoose";

const wajibPajakSchema = new mongoose.Schema(
  {
    namaPemilik: { type: String, required: true, index: true },
    npwpd: { type: String, required: true, unique: true },
    alamatLengkap: { type: String, required: true, index: true },
    kec: { type: String, required: true, index: true },
    kabKot: { type: String, required: true, default: "Kota Palangka Raya" },
    hpTel: { type: String },
  },
  {
    timestamps: true,
  }
);

wajibPajakSchema.index({
  namaPemilik: "text",
  npwpd: "text",
  alamatLengkap: "text",
  kec: "text",
});

const WajibPajak =
  mongoose.models.WajibPajak || mongoose.model("WajibPajak", wajibPajakSchema);
export default WajibPajak;
