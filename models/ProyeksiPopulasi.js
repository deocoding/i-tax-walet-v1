import mongoose from "mongoose";

const proyeksiPopulasiSchema = new mongoose.Schema(
  {
    objekPajak: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ObjekPajak",
      required: true,
    },
    wajibPajak: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WajibPajak",
      required: true,
    },
    tgglProyeksi: { type: Date, required: true },
    jumBur: { type: Number, required: true },
    jumSar: { type: Number },
  },
  {
    timestamps: true,
  }
);

const ProyeksiPopulasi =
  mongoose.models.ProyeksiPopulasi ||
  mongoose.model("ProyeksiPopulasi", proyeksiPopulasiSchema);
export default ProyeksiPopulasi;
