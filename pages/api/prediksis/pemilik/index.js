import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const prediksiPemiliks = await Pajak.aggregate([
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
          nama_pemilik: "$namaPemilik",
          npwpd: "$npwpd",
          id: "$wajibPajak",
        },
        total_penjualan: { $sum: "$totJual" },
        total_pajak: { $sum: "$totPajak" },
        total_bayar: { $sum: "$jumBayar" },
        count: { $sum: 1 },
      },
    },
    // { $match: { $expr: { $gte: ["$count", 5] } } },
  ]);

  if (prediksiPemiliks && prediksiPemiliks.length > 0) {
    await prediksiPemiliks.forEach((object, index) => {
      const count = prediksiPemiliks.length;
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

    const totalY = prediksiPemiliks.reduce(function (sum, current) {
      return sum + current.total_bayar;
    }, 0);
    const totalYx = prediksiPemiliks.reduce(function (sum, current) {
      return sum + current.xy;
    }, 0);
    const totalX2 = prediksiPemiliks.reduce(function (sum, current) {
      return sum + current.x2;
    }, 0);
    const totalBaris = prediksiPemiliks.length;
    const penambahX = totalBaris - 1;

    const a = totalY / totalBaris;
    const b = (totalYx / totalX2) * penambahX;
    const prediksiRupiah = a + b;
    const yAkhir = prediksiPemiliks[0].total_bayar;
    const prediksiPersen = ((prediksiRupiah / yAkhir) * 100) / 100;
    const prediksiBulat = prediksiPersen.toFixed(2);

    const bulans = prediksiPemiliks.map(function (c) {
      c = c._id.bulan;
      return c;
    });
    const pendapatans = prediksiPemiliks.map(function (d) {
      d = d.total_bayar;
      return d;
    });

    await bulans.reverse();
    await pendapatans.reverse();
    await prediksiPersen.toFixed(2);

    console.log(
      bulans + " " + yAkhir + " " + prediksiPersen + " " + totalBaris
    );
    res.send({ prediksiPemiliks });
  } else {
    console.log({ pesan: "Pajak not found" });
  }
  await db.disconnect();
});

export default handler;
