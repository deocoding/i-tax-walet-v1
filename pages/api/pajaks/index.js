import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import Pajak from "../../../models/Pajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const pajaks = await Pajak.aggregate([
    {
      $lookup: {
        from: "wajibpajaks",
        localField: "wajibPajak",
        foreignField: "_id",
        as: "fromWajibPajak",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$fromWajibPajak", 0] }, "$$ROOT"],
        },
      },
    },
    { $project: { fromWajibPajak: 0 } },
  ]);

  if (pajaks) {
    res.send(pajaks);
  } else {
    res.status(404).send({ pesan: "Pajak not found" });
  }
  await db.disconnect();
});

handler.post(async (req, res) => {
  await db.connect();
  const newPajak = new Pajak({
    wajibPajak: req.body.wajibPajak,
    volTon: req.body.volTon,
    nilJual: req.body.nilJual,
    tgglJual: req.body.tgglJual,
    totJual: req.body.totJual,
    totPajak: req.body.totPajak,
    jumBayar: req.body.jumBayar,
    tgglBayar: req.body.tgglBayar,
    sttsPajak: req.body.sttsPajak,
  });
  const pajak = await newPajak.save();
  await db.disconnect();
  res.status(201).send(pajak);
});

handler.delete(async (req, res) => {
  await db.connect();

  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const pajak = await Pajak.deleteMany({
    _id: { $in: temp },
  });

  if (pajak) {
    res.send({ pesan: "Pajak berhasil dihapus" });
  } else {
    res.status(404).send({ pesan: "Pajak not found" });
  }
  await db.disconnect();
});

handler.put(async (req, res) => {
  await db.connect();
  const pajak = await Pajak.findById(req.body.pajakId);
  if (pajak) {
    pajak.wajibPajak = req.body.wajibPajak;
    pajak.volTon = req.body.volTon;
    pajak.nilJual = req.body.nilJual;
    pajak.tgglJual = req.body.tgglJual;
    pajak.totJual = req.body.totJual;
    pajak.totPajak = req.body.totPajak;
    pajak.jumBayar = req.body.jumBayar;
    pajak.tgglBayar = req.body.tgglBayar;
    pajak.sttsPajak = req.body.sttsPajak;
    const updatedPajak = await pajak.save();

    await db.disconnect();
    res.send({
      message: "Pajak updated",
      pajak: updatedPajak,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Pajak Not Found" });
  }
});

export default handler;
