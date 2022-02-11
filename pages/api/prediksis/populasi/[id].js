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

  const prediksisPemilik = await ProyeksiPopulasi.aggregate([
    {
      $lookup: {
        from: "wajibpajaks",
        localField: "wajibPajak",
        foreignField: "_id",
        as: "fromWajibPajak",
      },
    },
    {
      $unwind: {
        path: "$fromWajibPajak",
        preserveNullAndEmptyArrays: true,
      },
    },
    // {
    //   $lookup: {
    //     from: "pajaks",
    //     localField: "fromWajibPajak._id",
    //     foreignField: "wajibPajak",
    //     as: "fromPajak",
    //   },
    // },
    // {
    //   $unwind: {
    //     path: "$fromPajak",
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    // {
    //   $group: {
    //     _id: {
    //       tahun: {
    //         $year: {
    //           date: "$tgglProyeksi",
    //           timezone: "Asia/Jakarta",
    //         },
    //       },
    //       bulan: {
    //         $month: {
    //           date: "$tgglProyeksi",
    //           timezone: "Asia/Jakarta",
    //         },
    //       },

    //       id: "$fromWajibPajak._id",
    //       nama_pemilik: "$fromWajibPajak.namaPemilik",
    //     },
    //     total_populasi: { $sum: "$fromPajak.jumBayar" },
    //     total_populasi: { $sum: "$jumBur" },
    //   },
    // },
    {
      $group: {
        _id: {
          id: "$fromWajibPajak._id",
          tahun: {
            $year: {
              date: "$tgglProyeksi",
              timezone: "Asia/Jakarta",
            },
          },
          bulan: {
            $month: {
              date: "$tgglProyeksi",
              timezone: "Asia/Jakarta",
            },
          },
        },
        total_populasi: { $sum: "$jumBur" },
        // total_bayar2: { $sum: "$fromPajak.jumBayar" },
      },
    },
    {
      $match: {
        $expr: {
          $eq: ["$_id.id", mongoose.Types.ObjectId(req.query.id)],
        },
      },
    },
    { $match: { $expr: { $eq: ["$_id.tahun", new Date().getFullYear()] } } },
    // {
    //   $project: {
    //     _id: 1,
    //     wajib_pajak_id: 1,
    //     total_populasi: {
    //       $filter: {
    //         input: "$fromPajak",
    //         as: "a",
    //         cond: { $ifNull: ["$$a.jumBur", false] },
    //       },
    //     },
    //   },
    // },
    {
      $sort: { _id: 1 },
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

    object.xy = object.total_populasi * object.x;
    object.x2 = object.x * object.x;
  });

  const totalY = prediksisPemilik.reduce(function (sum, current) {
    return sum + current.total_populasi;
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
  const yAkhir = prediksisPemilik[0].total_populasi;
  const prediksiPersen = ((prediksiRupiah / yAkhir) * 100) / 100;
  const prediksiBulat = prediksiPersen.toFixed(2);

  const bulans = prediksisPemilik.map(function (c) {
    c = c._id.bulan;
    return c;
  });
  const pendapatans = prediksisPemilik.map(function (d) {
    d = d.total_populasi;
    return d;
  });

  // await bulans.reverse();
  // await pendapatans.reverse();
  await prediksiPersen.toFixed(2);

  // console.log(prediksisPemilik);

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
