import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";
import mongoose from "mongoose";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const pajakLimit = await Pajak.find({
    user: mongoose.Types.ObjectId(req.user._id),
  });
  if (pajakLimit) {
    res.send(pajakLimit);
  }
  await db.disconnect();
});

export default handler;
