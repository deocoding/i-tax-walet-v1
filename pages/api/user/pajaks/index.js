import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";
import moment from "moment";
import mongoose from "mongoose";

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();

  let totJual = Number(req.body.volTon) * Number(req.body.nilJul);
  let totPajak = totJual * (10 / 100);
  let batBay = moment(req.body.tgglJul).add(14, "days");
  const newPajak = new Pajak({
    user: mongoose.Types.ObjectId(req.user._id),
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

export default handler;
