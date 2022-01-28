import mongoose from "mongoose";

const proyeksiSchema = new mongoose.Schema(
  {
    bangunan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bangunan",
      required: true,
    },
    tahun: { type: String, required: true },
    bulan: { type: String, required: true },
    jumBur: { type: Number, required: true },
    jumSar: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Proyeksi =
  mongoose.models.Proyeksi || mongoose.model("Proyeksi", proyeksiSchema);
export default Proyeksi;
