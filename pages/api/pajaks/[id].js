import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import Pajak from "../../../models/Pajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const pajak = await Pajak.findById(req.query.id);
  if (pajak) {
    await db.disconnect();
    res.send(pajak);
  } else {
    await db.disconnect();
    res.send({ pesan: "Pajak not found" });
  }
});

export default handler;
