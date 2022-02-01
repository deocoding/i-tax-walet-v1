import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const pajak = await Pajak.findById(req.query.id);
  res.send(pajak);
  await db.disconnect();
});

handler.delete(async (req, res) => {
  await db.connect();
  const pajak = await Pajak.findById(req.query.id);

  if (pajak) {
    await pajak.remove();
    await db.disconnect();
    res.send({ message: "Pajak berhasil dihapus" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Pajak tidak ditemukan" });
  }
});

export default handler;
