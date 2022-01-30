import mongoose from "mongoose";

const pajakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    volTon: { type: Number, required: true },
    nilJul: { type: Number, required: true },
    tgglJul: { type: Date, required: true },
    totJual: { type: Number, required: true },
    fotoJual: { type: String },
    totPajak: { type: Number, required: true },
    batBay: { type: Date, required: true },
    sudBay: { type: Boolean, required: true, default: false },
    totBay: { type: Number },
    fotoBayar: { type: String },
    sisBay: { type: Number },
    status: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: true,
  }
);

const Pajak = mongoose.models.Pajak || mongoose.model("Pajak", pajakSchema);
export default Pajak;
