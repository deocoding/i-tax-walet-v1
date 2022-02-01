import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";
import moment from "moment";
import mongoose from "mongoose";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const pajaks = await Pajak.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user", // field in the orders collection
        foreignField: "_id", // field in the items collection
        as: "user",
      },
    },
  ]);

  await db.disconnect();
  res.send(pajaks);
});

handler.post(async (req, res) => {
  await db.connect();

  let totJual = Number(req.body.volTon) * Number(req.body.nilJul);
  let totPajak = totJual * (10 / 100);
  let batBay = moment(req.body.tgglJul).add(14, "days");
  const newPajak = new Pajak({
    user: mongoose.Types.ObjectId(req.body.userId),
    volTon: req.body.volTon,
    nilJul: req.body.nilJul,
    tgglJul: req.body.tgglJul,
    totJual: totJual,
    totPajak: totPajak,
    batBay: batBay,
  });
  const pajak = await newPajak.save();

  if (pajak) {
    res.status(201).send(pajak);
  } else {
    res.status(400).send("Pajak gagal dibuat");
  }

  await db.disconnect();
});

handler.put(async (req, res) => {
  await db.connect();
  let totJual = Number(req.body.volTon) * Number(req.body.nilJul);
  let totPajak = totJual * (10 / 100);
  let batBay = moment(req.body.tgglJul).add(14, "days");
  const pajak = await Pajak.findById(req.body.pajakId);
  if (pajak) {
    pajak.user = mongoose.Types.ObjectId(req.body.userId);
    pajak.volTon = req.body.volTon;
    pajak.nilJul = req.body.nilJul;
    pajak.tgglJul = req.body.tgglJul;
    pajak.totJual = totJual;
    pajak.totPajak = totPajak;
    pajak.batBay = batBay;
    await pajak.save();

    await db.disconnect();
    res.send(pajak);
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Pajak tidak ditemukan" });
  }
});

export default handler;
