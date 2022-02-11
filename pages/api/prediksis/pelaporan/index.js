import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const prediksis = await Pajak.aggregate([
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
        },
        total_bayar: { $sum: "$jumBayar" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    { $match: { $expr: { $eq: ["$_id.tahun", new Date().getFullYear()] } } },
  ]);

  if (prediksis) {
    await prediksis.forEach((object, index) => {
      const count = prediksis.length;
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

    const totalY = prediksis.reduce(function (sum, current) {
      return sum + current.total_bayar;
    }, 0);
    const totalYx = prediksis.reduce(function (sum, current) {
      return sum + current.xy;
    }, 0);
    const totalX2 = prediksis.reduce(function (sum, current) {
      return sum + current.x2;
    }, 0);
    const totalBaris = prediksis.length;
    const penambahX = totalBaris - 1;

    const a = totalY / totalBaris;
    const b = (totalYx / totalX2) * penambahX;
    const prediksiRupiah = Math.floor(a + b);
    const yAkhir = prediksis[0].total_bayar;
    const prediksiPersen = ((prediksiRupiah / yAkhir) * 100) / 100;
    const prediksiBulat = prediksiPersen.toFixed(2);

    const bulans = prediksis.map(function (c) {
      c = c._id.bulan;
      return c;
    });
    const pendapatans = prediksis.map(function (d) {
      d = d.total_bayar;
      return d;
    });

    // await bulans.reverse();
    // await pendapatans.reverse();
    await prediksiPersen.toFixed(2);

    console.log(
      bulans + " " + yAkhir + " " + prediksiPersen + " " + totalBaris
    );
    res.send({ prediksis, prediksiRupiah, prediksiBulat, bulans, pendapatans });
  } else {
    res.status(404).send({ pesan: "Pajak not found" });
  }
  await db.disconnect();
});

export default handler;
