import mongoose from "mongoose";

const objekPajakSchema = new mongoose.Schema(
  {
    wajibPajak: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WajibPajak",
      required: true,
    },
    alamatLengkap: { type: String, required: true, index: true },
    kec: { type: String, required: true, index: true },
    kabKot: { type: String, required: true, default: "Kota Palangka Raya" },
    simb: { type: String },
    situ: { type: String },
    lat: { type: String },
    long: { type: String },
    tipe: { type: String },
    jumLan: { type: Number },
    usia: { type: Number },
  },
  {
    timestamps: true,
  }
);

objekPajakSchema.index({
  namaPemilik: "text",
  alamatLengkap: "text",
  kec: "text",
});

const ObjekPajak =
  mongoose.models.ObjekPajak || mongoose.model("ObjekPajak", objekPajakSchema);
export default ObjekPajak;
