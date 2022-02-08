import nc from "next-connect";
import mongoose from "mongoose";
import { isAuth } from "../../../../utils/auth";
import ProyeksiPopulasi from "../../../../models/ProyeksiPopulasi";
import ObjekPajak from "../../../../models/ObjekPajak";
import db from "../../../../utils/db";
import moment from "moment-timezone";
import "moment/locale/id";

const handler = nc();
handler.use(isAuth);

// handler.get(async (req, res) => {
//   await db.connect();
//   const proyPopuls = await ProyeksiPopulasi.aggregate([
//     {
//       $lookup: {
//         from: "objekpajaks",
//         localField: "objekPajak", // field in the orders collection
//         foreignField: "_id", // field in the items collection
//         as: "fromObjekPajak",
//       },
//     },
//     {
//       $replaceRoot: {
//         newRoot: {
//           $mergeObjects: [{ $arrayElemAt: ["$fromObjekPajak", 0] }, "$$ROOT"],
//         },
//       },
//     },
//     { $project: { fromObjekPajak: 0 } },
//   ]);
//   await db.disconnect();
//   res.send(proyPopuls);
// });

handler.post(async (req, res) => {
  await db.connect();

  const zone = "Asia/Jakarta";

  const tahun2 = moment(new Date(req.body.tgglProyeksi)).format();
  const bulan2 = moment(new Date(req.body.tgglProyeksi)).format();
  const hari2 = moment(new Date(req.body.tgglProyeksi)).format();
  const tahun = moment(req.body.tgglProyeksi, zone).get("year");
  const bulan = moment(req.body.tgglProyeksi).get("months") + 1;
  const hari = moment(req.body.tgglProyeksi).get("date");

  const cekProyeksi = await ProyeksiPopulasi.aggregate([
    {
      $match: { objekPajak: mongoose.Types.ObjectId(req.body.objekPajakId) },
    },
    {
      $addFields: {
        year_document: {
          $year: { date: "$tgglProyeksi", timezone: "Asia/Jakarta" },
        },
        month_document: {
          $month: { date: "$tgglProyeksi", timezone: "Asia/Jakarta" },
        },
        day_document: {
          $dayOfMonth: { date: "$tgglProyeksi", timezone: "Asia/Jakarta" },
        },
      },
    },
    {
      $match: { $expr: { $eq: ["$year_document", tahun] } },
    },
    {
      $match: { $expr: { $eq: ["$month_document", bulan] } },
    },
    {
      $match: { $expr: { $eq: ["$day_document", hari] } },
    },
  ]);

  console.log(cekProyeksi);

  if (cekProyeksi.length > 0) {
    await db.disconnect();
    res.send({ pesan: "Tanggal, bulan dan tahun sudah ada." });
  } else {
    const newProyeksiPopulasi = await new ProyeksiPopulasi({
      objekPajak: req.body.objekPajakId,
      wajibPajak: req.body.wajibPajakId,
      tgglProyeksi: req.body.tgglProyeksi,
      jumBur: req.body.jumBur,
    });
    const result = await newProyeksiPopulasi.save();

    if (result) {
      const objekPajak = await ObjekPajak.findById(req.body.objekPajakId);
      if (objekPajak.sdhProyeksi == false) {
        objekPajak.sdhProyeksi = true;
        await objekPajak.save();
      }
      await db.disconnect();
      res.status(201).send(result);
    }
  }
});

handler.delete(async (req, res) => {
  await db.connect();

  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const proyPopuls = await ProyeksiPopulasi.deleteMany({
    _id: { $in: temp },
  });

  if (proyPopuls) {
    res.send({ pesan: "Proyeksi Populasi berhasil dihapus" });
  } else {
    res.status(404).send({ pesan: "Proyeksi Populasi not found" });
  }
  await db.disconnect();
});

// handler.put(async (req, res) => {
//   await db.connect();
//   const usia = moment(new Date())
//     .diff(req.body.tgglSimb, "years", true)
//     .toFixed(1);
//   const objekPajak = await ObjekPajak.findById(req.body.objekPajakId);
//   if (objekPajak) {
//     objekPajak.alamatLengkap = req.body.alamatLengkap;
//     objekPajak.simb = req.body.simb;
//     objekPajak.tgglSimb = req.body.tgglSimb;
//     objekPajak.situ = req.body.situ;
//     objekPajak.tgglSitu = req.body.tgglSitu;
//     objekPajak.usia = usia;
//     objekPajak.lat = req.body.lat;
//     objekPajak.long = req.body.long;
//     objekPajak.tipe = req.body.tipe;
//     objekPajak.jumLan = req.body.jumLan;
//     objekPajak.sdhData = true;
//     const updatedObjekPajak = await objekPajak.save();

//     await db.disconnect();
//     res.send({
//       message: "Objek Pajak updated",
//       objekPajak: updatedObjekPajak,
//     });
//   } else {
//     await db.disconnect();
//     res.status(404).send({ pesan: "Objek Pajak Not Found" });
//   }
// });

export default handler;
