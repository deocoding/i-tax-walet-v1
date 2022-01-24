import nc from "next-connect";
import Bangunan from "../../../models/Bangunan";
import { signToken, isAuth } from "../../../utils/auth";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const bangunan = await Bangunan.findOne({ user: req.user._id })
    .sort({ _id: -1 })
    .limit(1);
  if (bangunan) {
    res.status(200).json({ latAkhir: bangunan.lat, longAkhir: bangunan.long });
  }
  await db.disconnect();
});

export default handler;
