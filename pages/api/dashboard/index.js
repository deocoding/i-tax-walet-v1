import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import Pajak from "../../../models/Pajak";
import ObjekPajak from "../../../models/ObjekPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const totalRealisasi = await Pajak.aggregate([
    {
      $group: {
        _id: 1,
        pajak: { $sum: "$jumBayar" },
      },
    },
    {
      $project: {
        _id: 0,
        total: { $sum: "$pajak" },
      },
    },
  ]);

  const totalRealisasiBerjalan = await Pajak.aggregate([
    {
      $addFields: {
        tahun: {
          $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
        },
      },
    },
    { $match: { $expr: { $eq: ["$tahun", new Date().getFullYear()] } } },
    {
      $group: {
        _id: 1,
        pajak: { $sum: "$jumBayar" },
      },
    },
    {
      $project: {
        _id: 0,
        total: { $sum: "$pajak" },
      },
    },
  ]);

  const totalLunas = await Pajak.count({ sttsPajak: { $eq: "LUNAS" } });
  const totalKurang = await Pajak.count({ sttsPajak: { $eq: "KURANG BAYAR" } });
  const totalDenda = await Pajak.count({ sttsPajak: { $eq: "DENDA" } });
  const totalBlmData = await ObjekPajak.count({ sdhData: { $eq: false } });
  const totalBlmSurvey = await ObjekPajak.count({
    sdhProyeksi: { $eq: false },
  });

  let prediksi = [];
  let prediksiRupiah;
  let prediksiPersenBulat;

  prediksi = await Pajak.aggregate([
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
      $sort: { tahun: 1, bulan: 1 },
    },
  ]);

  if (prediksi && prediksi.length > 0) {
    await prediksi.forEach((object, index) => {
      const count = prediksi.length;
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

    const totalY = prediksi.reduce(function (sum, current) {
      return sum + current.totBayar;
    }, 0);
    const totalYx = prediksi.reduce(function (sum, current) {
      return sum + current.xy;
    }, 0);
    const totalX2 = prediksi.reduce(function (sum, current) {
      return sum + current.x2;
    }, 0);
    const totalBaris = prediksi.length;
    const penambahX = totalBaris - 1;

    const a = totalY / totalBaris;
    const b = (totalYx / totalX2) * penambahX;
    prediksiRupiah = Math.floor(a + b);
    const yAkhir = prediksi[0].totBayar;
    const prediksiPersen = ((prediksiRupiah / yAkhir) * 100) / 100;
    prediksiPersenBulat = prediksiPersen.toFixed(2);
  }

  const sebaranKecamatan = await ObjekPajak.aggregate([
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
          $mergeObjects: [{ $arrayElemAt: ["$fromWajibPajak", 0] }, "$$ROOT"],
        },
      },
    },
    {
      $group: {
        _id: "$kec",
        // pajak: {
        //   $push: {
        //     totVolTon: { $sum: "$fromPajak.volTon" },
        //     totJual: { $sum: "$fromPajak.totJual" },
        //     totPajak: { $sum: "$fromPajak.totPajak" },
        //     totBayar: { $sum: "$fromPajak.jumBayar" },
        //   },
        // },
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
        kec: "$_id",
        bnykObjek: { $sum: "$objek.bnykObjek" },
        totPop: { $sum: "$objek.totPopulasi" },
        // volTon: { $first: "$pajak.totVolTon" },
        // totJual: { $first: "$pajak.totJual" },
        // totPajak: { $first: "$pajak.totPajak" },
        // totBayar: { $first: "$pajak.totBayar" },
      },
    },
  ]);

  let totalBangunan = 0;
  let totalPopulasi = 0;
  let hitungan = sebaranKecamatan;
  if (hitungan && hitungan.length > 0) {
    await hitungan.forEach((object, index) => {
      //   object.no = index + 1;
      totalBangunan += object.bnykObjek;
      totalPopulasi += object.totPop;
    });
  }

  console.log(totalPopulasi);

  res.send({
    totalRealisasi,
    totalRealisasiBerjalan,
    totalLunas,
    totalKurang,
    totalDenda,
    totalBlmData,
    totalBlmSurvey,
    prediksiRupiah,
    prediksiPersenBulat,
    sebaranKecamatan,
    totalBangunan,
    totalPopulasi,
  });

  await db.disconnect();
});

export default handler;
