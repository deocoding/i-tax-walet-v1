import mongoose from "mongoose";
import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Bangunan from "../../../../models/Bangunan";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.use(isAuth).post(async (req, res) => {
  await db.connect();
  const bangunan = await Bangunan.findById(req.body.bangunanId);
  if (bangunan) {
    bangunan.lat = req.body.lat;
    bangunan.long = req.body.long;
    bangunan.user = mongoose.Types.ObjectId(req.body.userBangunan);
    bangunan.kec = req.body.kec;
    bangunan.alamat = req.body.alamat;
    bangunan.tipe = req.body.tipe;
    bangunan.jumLan = req.body.jumLan;
    bangunan.imb = req.body.simb;
    bangunan.itu = req.body.situ;
    bangunan.status = req.body.status;

    // if (req.body.jumBur) {
    //   const jumSar = req.body.jumBur / 2;

    //   bangunan.totBur = req.body.jumBur;
    //   bangunan.totSar = jumSar;
    //   const proyeksi = {
    //     pendataanAt: Date.now(),
    //     jumBur: req.body.jumBur,
    //     jumSar: jumSar,
    //   };
    //   await bangunan.proyeksi.push(proyeksi);
    // }

    await bangunan.save();
    await db.disconnect();
    return res.send({ pesan: "Bangunan berhasil diupdate" });
  } else {
    const newBangunan = new Bangunan({
      user: mongoose.Types.ObjectId(req.body.userBangunan),
      alamat: req.body.alamat,
      kec: req.body.kec,
      lat: req.body.lat,
      long: req.body.long,
      tipe: req.body.tipe,
      jumLan: req.body.jumLan,
      imb: req.body.simb,
      itu: req.body.situ,
      status: req.body.status,
    });

    const bangunan = await newBangunan.save();

    // if (req.body.jumBur) {
    //   const jumSar = req.body.jumBur / 2;

    //   bangunan.totBur = req.body.jumBur;
    //   bangunan.totSar = jumSar;
    //   const proyeksi = {
    //     pendataanAt: Date.now(),
    //     jumBur: req.body.jumBur,
    //     jumSar: jumSar,
    //   };

    //   await bangunan.proyeksi.push(proyeksi);
    //   await bangunan.save();
    // }
    await db.disconnect();
    res.status(201).send({ pesan: "Bangunan berhasil dibuat" });
  }
});

export default handler;
