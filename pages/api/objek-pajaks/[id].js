import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import ObjekPajak from "../../../models/ObjekPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const objekPajak = await ObjekPajak.findById(req.query.id);
  if (objekPajak) {
    await db.disconnect();
    res.send(objekPajak);
  } else {
    await db.disconnect();
    res.send({ pesan: "Objek Pajak not found" });
  }
});

export default handler;
