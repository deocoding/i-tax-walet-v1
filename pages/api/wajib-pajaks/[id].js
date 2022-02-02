import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import WajibPajak from "../../../models/WajibPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const wajibPajak = await WajibPajak.findById(req.query.id);
  if (wajibPajak) {
    await db.disconnect();
    res.send(wajibPajak);
  } else {
    await db.disconnect();
    res.send({ pesan: "Wajib Pajak not found" });
  }
});

export default handler;
