import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Bangunan from "../../../../models/Bangunan";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const bangunans = await Bangunan.find({ isAdmin: false });
  await db.disconnect();
  res.send(bangunans);
});

export default handler;
