import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import WajibPajak from "../../../../models/WajibPajak";
import ProyeksiPopulasi from "../../../../models/ProyeksiPopulasi";
import db from "../../../../utils/db";
import mongoose from "mongoose";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const wajibPajak = await WajibPajak.findById(req.query.id);

  const prediksisPemilik = await Pajak.aggregate([
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
    {
      $group: {
        _id: {
          tahun: {
            $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
          },
          bulan: {
            $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
          },
          nama_pemilik: "$namaPemilik",
          npwpd: "$npwpd",
          id: "$wajibPajak",
        },
        // total_penjualan: { $sum: "$totJual" },
        // total_pajak: { $sum: "$totPajak" },
        total_bayar: { $sum: "$jumBayar" },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        $expr: { $eq: ["$_id.id", mongoose.Types.ObjectId(req.query.id)] },
      },
    },
    { $match: { $expr: { $eq: ["$_id.tahun", new Date().getFullYear()] } } },
    {
      $sort: { _id: -1 },
    },
  ]);

  await prediksisPemilik.forEach((object, index) => {
    const count = prediksisPemilik.length;
    const countOdd = count % 2 == 1 && true;
    let x_awal = Math.floor(count / 2);
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

    object.xy = object.total_bayar * object.x;
    object.x2 = object.x * object.x;
  });

  const totalY = prediksisPemilik.reduce(function (sum, current) {
    return sum + current.total_bayar;
  }, 0);
  const totalYx = prediksisPemilik.reduce(function (sum, current) {
    return sum + current.xy;
  }, 0);
  const totalX2 = prediksisPemilik.reduce(function (sum, current) {
    return sum + current.x2;
  }, 0);
  const totalBaris = prediksisPemilik.length;
  const penambahX = totalBaris - 1;

  const a = totalY / totalBaris;
  const b = (totalYx / totalX2) * penambahX;
  const prediksiRupiah = Math.floor(a + b);
  const yAkhir = prediksisPemilik[0].total_bayar;
  const prediksiPersen = ((prediksiRupiah / yAkhir) * 100) / 100;
  const prediksiBulat = prediksiPersen.toFixed(2);

  const bulans = prediksisPemilik.map(function (c) {
    c = c._id.bulan;
    return c;
  });
  const pendapatans = prediksisPemilik.map(function (d) {
    d = d.total_bayar;
    return d;
  });

  await bulans.reverse();
  await pendapatans.reverse();
  await prediksiPersen.toFixed(2);

  console.log(bulans + " " + yAkhir + " " + prediksiPersen + " " + totalBaris);

  await db.disconnect();

  res.send({
    prediksisPemilik,
    wajibPajak,
    prediksiRupiah,
    prediksiBulat,
    bulans,
    pendapatans,
  });
});

export default handler;
