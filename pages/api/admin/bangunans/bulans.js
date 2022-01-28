import nc from "next-connect";
import mongoose from "mongoose";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Proyeksi from "../../../../models/Proyeksi";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const proyeksis = await Proyeksi.find({
    bangunan: mongoose.Types.ObjectId(req.query.id),
  });

  const bulans = proyeksis.map(function (c) {
    c = c.bulan;
    return c;
  });
  const burungs = proyeksis.map(function (d) {
    d = d.jumBur;
    return d;
  });
  const sarangs = proyeksis.map(function (e) {
    e = e.jumSar;
    return e;
  });

  await db.disconnect();
  res.send({ bulans: bulans, burungs: burungs, sarangs: sarangs });
});

export default handler;
