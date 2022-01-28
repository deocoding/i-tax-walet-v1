import mongoose from "mongoose";
import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Proyeksi from "../../../../models/Proyeksi";
import db from "../../../../utils/db";
import moment from "moment";

const handler = nc();
handler.use(isAuth);

// let bulanKata;

handler.use(isAuth).post(async (req, res) => {
  await db.connect();

  const bulan = moment(new Date(req.body.bulTah)).format("MMMM");
  const tahun = moment(new Date(req.body.bulTah)).format("YYYY");
  const jumSar = Number(req.body.jumBur) / 2;
  const proyeksi = await Proyeksi.find({
    bangunan: mongoose.Types.ObjectId(req.body.bangunanId),
    tahun: tahun,
    bulan: bulan,
  });
  if (proyeksi.length > 0) {
    return res.send({ pesan: "Proyeksi sudah ada" });
  } else {
    const newProyeksi = new Proyeksi({
      bangunan: mongoose.Types.ObjectId(req.body.bangunanId),
      tahun: tahun,
      bulan: bulan,
      jumBur: req.body.jumBur,
      jumSar: Math.floor(jumSar),
    });

    await newProyeksi.save();
  }
  await db.disconnect();

  res.send({ pesan: "Proyeksi berhasil disimpan" });
  // res.send(proyeksi);
});

export default handler;
