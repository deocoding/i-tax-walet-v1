import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();

  const pajak = await Pajak.findById(req.body.pajakId);

  const sisBay = pajak.totPajak - req.body.totBay;
  if (pajak) {
    pajak.sudBay = true;
    pajak.tgglBay = req.body.tgglBay;
    pajak.totBay = req.body.totBay;
    if (sisBay !== 0 && sisBay > 0) {
      pajak.sisBay = sisBay;
      pajak.status = 2;
    } else {
      pajak.status = 4;
    }
    await pajak.save();

    await db.disconnect();
    res.send(pajak);
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Pajak tidak ditemukan" });
  }
});

export default handler;
