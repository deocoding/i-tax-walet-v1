import mongoose from "mongoose";

const pajakSchema = new mongoose.Schema(
  {
    wajibPajak: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WajibPajak",
      required: true,
    },
    volTon: { type: Number, required: true },
    nilJual: { type: Number, required: true },
    tgglJual: { type: Date, required: true },
    totJual: { type: Number, required: true },
    totPajak: { type: Number, required: true },
    jumBayar: { type: Number },
    tgglBayar: { type: Date },
    sttsPajak: { type: String },
  },
  {
    timestamps: true,
  }
);

pajakSchema.index({
  wajibPajak: "text",
});

const Pajak = mongoose.models.Pajak || mongoose.model("Pajak", pajakSchema);
export default Pajak;
