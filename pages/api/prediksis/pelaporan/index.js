import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  //   const prediksis = await Pajak.aggregate([
  //     {
  //       $lookup: {
  //         from: "wajibpajaks",
  //         localField: "wajibPajak",
  //         foreignField: "_id",
  //         as: "fromWajibPajak",
  //       },
  //     },
  //     {
  //       $replaceRoot: {
  //         newRoot: {
  //           $mergeObjects: [{ $arrayElemAt: ["$fromWajibPajak", 0] }, "$$ROOT"],
  //         },
  //       },
  //     },
  //     { $project: { fromWajibPajak: 0 } },
  //     {
  //       $group: {
  //         _id: { nama_pemilik: "$namaPemilik", npwpd: "$npwpd" },
  //         total_penjualan: { $sum: "$totJual" },
  //         total_pajak: { $sum: "$totPajak" },
  //         total_bayar: { $sum: "$jumBayar" },
  //         count: { $sum: 1 },
  //       },
  //     },
  //     { $match: { $expr: { $gte: ["$count", 5] } } },
  //   ]);

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
      $sort: { tgglBayar: -1 },
    },
    // {
    //   $group: {
    //     _id: {
    //       year_document: {
    //         $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
    //       },
    //       month_document: {
    //         $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
    //       },
    //       nama_pemilik: "$namaPemilik",
    //       npwpd: "$npwpd",
    //     },
    //     total_penjualan: { $sum: "$totJual" },
    //     total_pajak: { $sum: "$totPajak" },
    //     total_bayar: { $sum: "$jumBayar" },
    //     count: { $sum: 1 },
    //   },
    // },
    // { $match: { $expr: { $eq: ["$_id.nama_pemilik", "Joni Esmod"] } } },
    // {
    //   $addFields: {
    //     angkaX: {
    //       $function: {
    //         body: function (_id) {
    //           let total = Array.sum(_id);
    //           return total;
    //         },
    //         args: ["$_id"],
    //         lang: "js",
    //       },
    //     },
    //   },
    // },
  ]);

  if (prediksis) {
    // const count = prediksis.length;
    // const countOdd = count % 2 == 1 && true;
    // let x_awal = Math.floor(count / 2);
    // let x = [];
    // if (countOdd) {
    //   for (let i = 0; i < count; i++) {
    //     x.push({ x: x_awal });
    //     x_awal--;
    //   }
    // } else {
    //   for (let i = 0; i < count / 2; i++) {
    //     x.push(x_awal - 1);
    //     x_awal--;
    //   }
    //   x_awal = 1;
    //   for (let i = 0; i < count / 2; i++) {
    //     x.push(x_awal - 1);
    //     x_awal--;
    //   }
    // }
    // const myObject = [
    //   { a: 1, b: 2, c: 3 },
    //   { a: 1, b: 2, c: 3 },
    // ];
    // const mapped = prediksis.map((element) => ({
    //   x: prediksis.length,
    //   ...element,
    // }));

    // const xTambahan = prediksis.map((item, index) => {
    //   const container = {};
    //   container._id = item._id;
    //   const count = prediksis.length;
    //   const countOdd = count % 2 == 1 && true;
    //   let x_awal = Math.floor(count / 2);
    //   if (countOdd) {
    //     for (let i = 0; i < count; i++) {
    //       if (index == i) {
    //         container.x = x_awal;
    //       }
    //       x_awal--;
    //     }
    //   } else {
    //     for (let i = 0; i < count; i++) {
    //       if (i == count / 2) {
    //         x_awal = 1;
    //       }
    //       if (index == i) {
    //         container.x = x_awal - 1;
    //       }

    //       x_awal--;
    //     }
    //   }
    //   return container;
    // });

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
    });

    // console.log(prediksis);
    res.send(prediksis);
  } else {
    res.status(404).send({ pesan: "Pajak not found" });
  }
  await db.disconnect();
});

export default handler;
