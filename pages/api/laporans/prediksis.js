import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import Pajak from "../../../models/Pajak";
import db from "../../../utils/db";
import fs from "fs";
import path from "path";

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  const tipe = req.body.tipe;

  let laporans = [];

  await db.connect();

  if (tipe && tipe == "bulan") {
    laporans = await Pajak.aggregate([
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
      {
        $group: {
          _id: {
            tahun: {
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
          },
          pajak: {
            $push: {
              totVolTon: { $sum: "$volTon" },
              totJual: { $sum: "$totJual" },
              totPajak: { $sum: "$totPajak" },
              totBayar: { $sum: "$jumBayar" },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          no: { $add: ["$no", 1] },
          tahun: "$_id.tahun",
          bulan: "$_id.bulan",
          volTon: { $sum: "$pajak.totVolTon" },
          totJual: { $sum: "$pajak.totJual" },
          totPajak: { $sum: "$pajak.totPajak" },
          totBayar: { $sum: "$pajak.totBayar" },
        },
      },
      {
        $sort: { tahun: -1, bulan: -1 },
      },
    ]);
  } else if (tipe && tipe == "tahun") {
    laporans = await Pajak.aggregate([
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
      {
        $group: {
          _id: {
            tahun: {
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
          },
          pajak: {
            $push: {
              totVolTon: { $sum: "$volTon" },
              totJual: { $sum: "$totJual" },
              totPajak: { $sum: "$totPajak" },
              totBayar: { $sum: "$jumBayar" },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          no: { $add: ["$no", 1] },
          tahun: "$_id.tahun",
          volTon: { $sum: "$pajak.totVolTon" },
          totJual: { $sum: "$pajak.totJual" },
          totPajak: { $sum: "$pajak.totPajak" },
          totBayar: { $sum: "$pajak.totBayar" },
        },
      },
      {
        $sort: { tahun: -1 },
      },
    ]);
  }

  if (laporans && laporans.length > 0) {
    await laporans.forEach((object, index) => {
      const count = laporans.length;
      const countOdd = count % 2 == 1 && true;
      let x_awal = Math.floor(count / 2);
      object.no = index + 1;
      if (countOdd) {
        for (let i = 0; i < count; i++) {
          if (index == i) {
            object.x = x_awal;
          }
          x_awal--;
        }
      } else {
        for (let i = 0; i < count; i++) {
          if (i == count / 2) {
            x_awal = 1;
          }
          if (index == i) {
            object.x = x_awal - 1;
          }

          x_awal--;
        }
      }

      object.xy = object.totBayar * object.x;
      object.x2 = object.x * object.x;
    });

    const totalY = laporans.reduce(function (sum, current) {
      return sum + current.totBayar;
    }, 0);
    const totalYx = laporans.reduce(function (sum, current) {
      return sum + current.xy;
    }, 0);
    const totalX2 = laporans.reduce(function (sum, current) {
      return sum + current.x2;
    }, 0);
    const totalBaris = laporans.length;
    const penambahX = totalBaris - 1;

    const a = totalY / totalBaris;
    const b = (totalYx / totalX2) * penambahX;
    const prediksiRupiah = Math.floor(a + b);
    const yAkhir = laporans[0].totBayar;
    const prediksiPersen = ((prediksiRupiah / yAkhir) * 100) / 100;
    const prediksiBulat = prediksiPersen.toFixed(2);

    const filePath = path.resolve(".", "public/images/kota-praya.png");
    const imageBuffer = fs.readFileSync(filePath);
    const imageString = imageBuffer.toString("base64");
    // console.log(imageString);

    res.setHeader("Content-Type", "image/png");
    res.send({
      laporans,
      imageString,
      tipe,
      prediksiRupiah,
      prediksiBulat,
    });
  } else {
    res.send({ pesan: "Laporan tidak ada" });
  }
  await db.disconnect();
});

export default handler;
