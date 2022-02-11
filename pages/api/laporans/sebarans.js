import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import Pajak from "../../../models/Pajak";
import ObjekPajak from "../../../models/ObjekPajak";
import db from "../../../utils/db";
import fs from "fs";
import path from "path";

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  const tahun = req.body.tahun;

  let laporans = [];

  await db.connect();

  if (tahun) {
    if (tahun == "semua") {
      laporans = await ObjekPajak.aggregate([
        {
          $lookup: {
            from: "proyeksipopulasis",
            localField: "_id",
            foreignField: "objekPajak",
            as: "fromObjekPop",
          },
        },
        {
          $lookup: {
            from: "wajibpajaks",
            localField: "kec",
            foreignField: "kec",
            as: "fromWajibPajak",
          },
        },
        {
          $lookup: {
            from: "pajaks",
            localField: "fromWajibPajak._id",
            foreignField: "wajibPajak",
            as: "fromPajak",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                { $arrayElemAt: ["$fromWajibPajak", 0] },
                "$$ROOT",
              ],
            },
          },
        },
        {
          $group: {
            _id: "$kec",
            pajak: {
              $push: {
                totVolTon: { $sum: "$fromPajak.volTon" },
                totJual: { $sum: "$fromPajak.totJual" },
                totPajak: { $sum: "$fromPajak.totPajak" },
                totBayar: { $sum: "$fromPajak.jumBayar" },
              },
            },
            objek: {
              $push: {
                totPopulasi: { $sum: "$fromObjekPop.jumBur" },
                bnykObjek: { $sum: 1 },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            kec: "$_id",
            totPop: { $sum: "$objek.totPopulasi" },
            bnykObjek: { $sum: "$objek.bnykObjek" },
            volTon: { $first: "$pajak.totVolTon" },
            totJual: { $first: "$pajak.totJual" },
            totPajak: { $first: "$pajak.totPajak" },
            totBayar: { $first: "$pajak.totBayar" },
          },
        },
        // {
        //   $sort: { tahun: 1, bulan: 1 },
        // },
      ]);
    } else {
      laporans = await ObjekPajak.aggregate([
        {
          $lookup: {
            from: "proyeksipopulasis",
            localField: "_id",
            foreignField: "objekPajak",
            as: "fromObjekPop",
          },
        },

        {
          $unwind: {
            path: "$fromObjekPop",
            includeArrayIndex: "no",
          },
        },
        {
          $lookup: {
            from: "wajibpajaks",
            localField: "kec",
            foreignField: "kec",
            as: "fromWajibPajak",
          },
        },
        {
          $lookup: {
            from: "pajaks",
            localField: "fromWajibPajak._id",
            foreignField: "wajibPajak",
            as: "fromPajak",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                { $arrayElemAt: ["$fromWajibPajak", 0] },
                "$$ROOT",
              ],
            },
          },
        },

        {
          $addFields: {
            tahun: {
              $year: {
                date: "$fromObjekPop.tgglProyeksi",
                timezone: "Asia/Jakarta",
              },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        {
          $group: {
            _id: "$kec",
            pajak: {
              $push: {
                totVolTon: { $sum: "$fromPajak.volTon" },
                totJual: { $sum: "$fromPajak.totJual" },
                totPajak: { $sum: "$fromPajak.totPajak" },
                totBayar: { $sum: "$fromPajak.jumBayar" },
              },
            },
            objek: {
              $push: {
                totPopulasi: { $sum: "$fromObjekPop.jumBur" },
                tgglProyeksi: "$fromObjekPop.tgglProyeksi",
                bnykObjek: { $sum: 1 },
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            kec: "$_id",
            totPop: { $sum: "$objek.totPopulasi" },
            bnykObjek: { $sum: "$objek.bnykObjek" },
            volTon: { $first: "$pajak.totVolTon" },
            totJual: { $first: "$pajak.totJual" },
            totPajak: { $first: "$pajak.totPajak" },
            totBayar: { $first: "$pajak.totBayar" },
          },
        },
      ]);
    }
  }

  if (laporans && laporans.length > 0) {
    await laporans.forEach((object, index) => {
      object.no = index + 1;
    });

    const filePath = path.resolve(".", "public/images/kota-praya.png");
    const imageBuffer = fs.readFileSync(filePath);
    const imageString = imageBuffer.toString("base64");
    // console.log(imageString);

    res.setHeader("Content-Type", "image/png");
    res.send({
      laporans,
      imageString,
      tahun,
    });
  } else {
    res.send({ pesan: "Laporan tidak ada" });
  }
  await db.disconnect();
});

export default handler;
