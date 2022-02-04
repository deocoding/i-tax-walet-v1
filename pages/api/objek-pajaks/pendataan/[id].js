import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import ObjekPajak from "../../../../models/ObjekPajak";
import WajibPajak from "../../../../models/WajibPajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const objekPajak = await ObjekPajak.findById(req.query.id);
  if (objekPajak) {
    const wajibPajak = await WajibPajak.findById(objekPajak.wajibPajak);
    const objPajaks = await ObjekPajak.find({ wajibPajak: wajibPajak._id });
    const last = await ObjekPajak.findOne({ wajibPajak: wajibPajak._id })
      .sort({ _id: -1 })
      .limit(1);
    await db.disconnect();
    res.send({
      objekPajak,
      wajibPajak,
      objPajaks,
      latAkhir: last.lat,
      longAkhir: last.long,
    });
  } else {
    await db.disconnect();
    res.send({ pesan: "Objek Pajak not found" });
  }
});

export default handler;
