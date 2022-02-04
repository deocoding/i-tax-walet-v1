import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import ObjekPajak from "../../../models/ObjekPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const objekPajaks = await ObjekPajak.aggregate([
    {
      $lookup: {
        from: "wajibpajaks",
        localField: "wajibPajak", // field in the orders collection
        foreignField: "_id", // field in the items collection
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
  await db.disconnect();
  res.send(objekPajaks);
});

handler.post(async (req, res) => {
  await db.connect();
  const newObjekPajak = new ObjekPajak({
    wajibPajak: req.body.wajibPajak,
    alamatLengkap: req.body.alamatLengkap,
    kec: req.body.kec,
    simb: req.body.simb,
    situ: req.body.situ,
  });
  const objekPajak = await newObjekPajak.save();
  await db.disconnect();
  res.status(201).send(objekPajak);
});

handler.delete(async (req, res) => {
  await db.connect();

  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const objekPajak = await ObjekPajak.deleteMany({
    _id: { $in: temp },
  });

  if (objekPajak) {
    res.send({ pesan: "Objek Pajak berhasil dihapus" });
  } else {
    res.status(404).send({ pesan: "Objek Pajak not found" });
  }
  await db.disconnect();
});

handler.put(async (req, res) => {
  await db.connect();
  const objekPajak = await ObjekPajak.findById(req.body.objekPajakId);
  if (objekPajak) {
    objekPajak.wajibPajak = req.body.wajibPajak;
    objekPajak.kec = req.body.kec;
    objekPajak.alamatLengkap = req.body.alamatLengkap;
    objekPajak.simb = req.body.simb;
    objekPajak.situ = req.body.situ;
    const updatedObjekPajak = await objekPajak.save();

    await db.disconnect();
    res.send({
      message: "Wajib Pajak updated",
      objekPajak: updatedObjekPajak,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Wajib Pajak Not Found" });
  }
});

export default handler;
