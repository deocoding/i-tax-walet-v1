import mongoose from "mongoose";

const bangunanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    alamat: { type: String, required: true },
    kec: { type: String, required: true },
    kabKot: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    tipe: { type: String },
    jumLan: { type: Number },
    jumBur: { type: Number },
    imb: { type: String },
    itu: { type: String },
    status: { type: Number, required: true, default: 1 },
  },
  {
    timestamps: true,
  }
);

const Bangunan =
  mongoose.models.Bangunan || mongoose.model("Bangunan", bangunanSchema);
export default Bangunan;
