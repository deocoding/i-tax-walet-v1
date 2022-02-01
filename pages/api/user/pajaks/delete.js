import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.delete(async (req, res) => {
  await db.connect();

  //   const userIds = req.query.ids.toArray();

  //   res.send(req.query.ids);
  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const pajak = await Pajak.remove({
    _id: { $in: temp },
  });

  if (pajak) {
    res.send({ pesan: "Pajak berhasil dihapus" });
  } else {
    res.send({ pesan: "Pajak gagal dihapus" });
  }
  await db.disconnect();
});

export default handler;
