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
  const tahun = req.body.tahun;
  const bulan = req.body.bulan;
  const triwulan = req.body.triwulan;
  const semester = req.body.semester;

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
        $addFields: {
          tahun: {
            $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
          },
          bulan: {
            $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
          },
          tgglJual: {
            $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
          },
          tgglBayar: {
            $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
          },
        },
      },
      { $match: { $expr: { $eq: ["$tahun", tahun] } } },
      { $match: { $expr: { $eq: ["$bulan", bulan] } } },
      {
        $group: {
          _id: 1,
          pajak: {
            $push: {
              nama: "$namaPemilik",
              npwpd: "$npwpd",
              alamat: "$alamatLengkap",
              kec: "$kec",
              hpTel: "$hpTel",
              volTon: "$volTon",
              nilJual: "$nilJual",
              tgglJual: "$tgglJual",
              totJual: "$totJual",
              totPajak: "$totPajak",
              jumBayar: "$jumBayar",
              tgglBayar: "$tgglBayar",
              tgglBayar2: "$tgglBayar",
              sttsPajak: "$sttsPajak",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$pajak",
          includeArrayIndex: "no",
        },
      },
      {
        $project: {
          _id: 0,
          no: { $add: ["$no", 1] },
          nama: "$pajak.nama",
          npwpd: "$pajak.npwpd",
          alamat: "$pajak.alamat",
          kec: "$pajak.kec",
          hpTel: "$pajak.hpTel",
          volTon: "$pajak.volTon",
          nilJual: "$pajak.nilJual",
          tgglJual: "$pajak.tgglJual",
          totJual: "$pajak.totJual",
          totPajak: "$pajak.totPajak",
          jumBayar: "$pajak.jumBayar",
          tgglBayar: "$pajak.tgglBayar",
          sttsPajak: "$pajak.sttsPajak",
        },
      },
    ]);
  } else if (tipe && tipe == "triwulan") {
    if (triwulan == 1) {
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
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            tgglJual: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
            },
            tgglBayar: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        { $match: { $expr: { $gte: ["$bulan", 1] } } },
        { $match: { $expr: { $lte: ["$bulan", 3] } } },
        {
          $group: {
            _id: 1,
            pajak: {
              $push: {
                nama: "$namaPemilik",
                npwpd: "$npwpd",
                alamat: "$alamatLengkap",
                kec: "$kec",
                hpTel: "$hpTel",
                volTon: "$volTon",
                nilJual: "$nilJual",
                tgglJual: "$tgglJual",
                totJual: "$totJual",
                totPajak: "$totPajak",
                jumBayar: "$jumBayar",
                tgglBayar: "$tgglBayar",
                tgglBayar2: "$tgglBayar",
                sttsPajak: "$sttsPajak",
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pajak",
            includeArrayIndex: "no",
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            nama: "$pajak.nama",
            npwpd: "$pajak.npwpd",
            alamat: "$pajak.alamat",
            kec: "$pajak.kec",
            hpTel: "$pajak.hpTel",
            volTon: "$pajak.volTon",
            nilJual: "$pajak.nilJual",
            tgglJual: "$pajak.tgglJual",
            totJual: "$pajak.totJual",
            totPajak: "$pajak.totPajak",
            jumBayar: "$pajak.jumBayar",
            tgglBayar: "$pajak.tgglBayar",
            sttsPajak: "$pajak.sttsPajak",
          },
        },
      ]);
    }
    if (triwulan == 2) {
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
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            tgglJual: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
            },
            tgglBayar: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        { $match: { $expr: { $gte: ["$bulan", 4] } } },
        { $match: { $expr: { $lte: ["$bulan", 6] } } },
        {
          $group: {
            _id: 1,
            pajak: {
              $push: {
                nama: "$namaPemilik",
                npwpd: "$npwpd",
                alamat: "$alamatLengkap",
                kec: "$kec",
                hpTel: "$hpTel",
                volTon: "$volTon",
                nilJual: "$nilJual",
                tgglJual: "$tgglJual",
                totJual: "$totJual",
                totPajak: "$totPajak",
                jumBayar: "$jumBayar",
                tgglBayar: "$tgglBayar",
                tgglBayar2: "$tgglBayar",
                sttsPajak: "$sttsPajak",
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pajak",
            includeArrayIndex: "no",
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            nama: "$pajak.nama",
            npwpd: "$pajak.npwpd",
            alamat: "$pajak.alamat",
            kec: "$pajak.kec",
            hpTel: "$pajak.hpTel",
            volTon: "$pajak.volTon",
            nilJual: "$pajak.nilJual",
            tgglJual: "$pajak.tgglJual",
            totJual: "$pajak.totJual",
            totPajak: "$pajak.totPajak",
            jumBayar: "$pajak.jumBayar",
            tgglBayar: "$pajak.tgglBayar",
            sttsPajak: "$pajak.sttsPajak",
          },
        },
      ]);
    }
    if (triwulan == 3) {
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
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            tgglJual: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
            },
            tgglBayar: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        { $match: { $expr: { $gte: ["$bulan", 7] } } },
        { $match: { $expr: { $lte: ["$bulan", 9] } } },
        {
          $group: {
            _id: 1,
            pajak: {
              $push: {
                nama: "$namaPemilik",
                npwpd: "$npwpd",
                alamat: "$alamatLengkap",
                kec: "$kec",
                hpTel: "$hpTel",
                volTon: "$volTon",
                nilJual: "$nilJual",
                tgglJual: "$tgglJual",
                totJual: "$totJual",
                totPajak: "$totPajak",
                jumBayar: "$jumBayar",
                tgglBayar: "$tgglBayar",
                tgglBayar2: "$tgglBayar",
                sttsPajak: "$sttsPajak",
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pajak",
            includeArrayIndex: "no",
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            nama: "$pajak.nama",
            npwpd: "$pajak.npwpd",
            alamat: "$pajak.alamat",
            kec: "$pajak.kec",
            hpTel: "$pajak.hpTel",
            volTon: "$pajak.volTon",
            nilJual: "$pajak.nilJual",
            tgglJual: "$pajak.tgglJual",
            totJual: "$pajak.totJual",
            totPajak: "$pajak.totPajak",
            jumBayar: "$pajak.jumBayar",
            tgglBayar: "$pajak.tgglBayar",
            sttsPajak: "$pajak.sttsPajak",
          },
        },
      ]);
    }
    if (triwulan == 4) {
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
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            tgglJual: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
            },
            tgglBayar: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        { $match: { $expr: { $gte: ["$bulan", 10] } } },
        { $match: { $expr: { $lte: ["$bulan", 12] } } },
        {
          $group: {
            _id: 1,
            pajak: {
              $push: {
                nama: "$namaPemilik",
                npwpd: "$npwpd",
                alamat: "$alamatLengkap",
                kec: "$kec",
                hpTel: "$hpTel",
                volTon: "$volTon",
                nilJual: "$nilJual",
                tgglJual: "$tgglJual",
                totJual: "$totJual",
                totPajak: "$totPajak",
                jumBayar: "$jumBayar",
                tgglBayar: "$tgglBayar",
                tgglBayar2: "$tgglBayar",
                sttsPajak: "$sttsPajak",
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pajak",
            includeArrayIndex: "no",
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            nama: "$pajak.nama",
            npwpd: "$pajak.npwpd",
            alamat: "$pajak.alamat",
            kec: "$pajak.kec",
            hpTel: "$pajak.hpTel",
            volTon: "$pajak.volTon",
            nilJual: "$pajak.nilJual",
            tgglJual: "$pajak.tgglJual",
            totJual: "$pajak.totJual",
            totPajak: "$pajak.totPajak",
            jumBayar: "$pajak.jumBayar",
            tgglBayar: "$pajak.tgglBayar",
            sttsPajak: "$pajak.sttsPajak",
          },
        },
      ]);
    }
  } else if (tipe && tipe == "semester") {
    if (semester == 1) {
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
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            tgglJual: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
            },
            tgglBayar: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        { $match: { $expr: { $gte: ["$bulan", 1] } } },
        { $match: { $expr: { $lte: ["$bulan", 6] } } },
        {
          $group: {
            _id: 1,
            pajak: {
              $push: {
                nama: "$namaPemilik",
                npwpd: "$npwpd",
                alamat: "$alamatLengkap",
                kec: "$kec",
                hpTel: "$hpTel",
                volTon: "$volTon",
                nilJual: "$nilJual",
                tgglJual: "$tgglJual",
                totJual: "$totJual",
                totPajak: "$totPajak",
                jumBayar: "$jumBayar",
                tgglBayar: "$tgglBayar",
                tgglBayar2: "$tgglBayar",
                sttsPajak: "$sttsPajak",
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pajak",
            includeArrayIndex: "no",
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            nama: "$pajak.nama",
            npwpd: "$pajak.npwpd",
            alamat: "$pajak.alamat",
            kec: "$pajak.kec",
            hpTel: "$pajak.hpTel",
            volTon: "$pajak.volTon",
            nilJual: "$pajak.nilJual",
            tgglJual: "$pajak.tgglJual",
            totJual: "$pajak.totJual",
            totPajak: "$pajak.totPajak",
            jumBayar: "$pajak.jumBayar",
            tgglBayar: "$pajak.tgglBayar",
            sttsPajak: "$pajak.sttsPajak",
          },
        },
      ]);
    }
    if (semester == 2) {
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
              $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            bulan: {
              $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
            },
            tgglJual: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
            },
            tgglBayar: {
              $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
            },
          },
        },
        { $match: { $expr: { $eq: ["$tahun", tahun] } } },
        { $match: { $expr: { $gte: ["$bulan", 7] } } },
        { $match: { $expr: { $lte: ["$bulan", 12] } } },
        {
          $group: {
            _id: 1,
            pajak: {
              $push: {
                nama: "$namaPemilik",
                npwpd: "$npwpd",
                alamat: "$alamatLengkap",
                kec: "$kec",
                hpTel: "$hpTel",
                volTon: "$volTon",
                nilJual: "$nilJual",
                tgglJual: "$tgglJual",
                totJual: "$totJual",
                totPajak: "$totPajak",
                jumBayar: "$jumBayar",
                tgglBayar: "$tgglBayar",
                tgglBayar2: "$tgglBayar",
                sttsPajak: "$sttsPajak",
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pajak",
            includeArrayIndex: "no",
          },
        },
        {
          $project: {
            _id: 0,
            no: { $add: ["$no", 1] },
            nama: "$pajak.nama",
            npwpd: "$pajak.npwpd",
            alamat: "$pajak.alamat",
            kec: "$pajak.kec",
            hpTel: "$pajak.hpTel",
            volTon: "$pajak.volTon",
            nilJual: "$pajak.nilJual",
            tgglJual: "$pajak.tgglJual",
            totJual: "$pajak.totJual",
            totPajak: "$pajak.totPajak",
            jumBayar: "$pajak.jumBayar",
            tgglBayar: "$pajak.tgglBayar",
            sttsPajak: "$pajak.sttsPajak",
          },
        },
      ]);
    }
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
        $addFields: {
          tahun: {
            $year: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
          },
          bulan: {
            $month: { date: "$tgglBayar", timezone: "Asia/Jakarta" },
          },
          tgglJual: {
            $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
          },
          tgglBayar: {
            $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
          },
        },
      },
      { $match: { $expr: { $eq: ["$tahun", tahun] } } },
      {
        $group: {
          _id: 1,
          pajak: {
            $push: {
              nama: "$namaPemilik",
              npwpd: "$npwpd",
              alamat: "$alamatLengkap",
              kec: "$kec",
              hpTel: "$hpTel",
              volTon: "$volTon",
              nilJual: "$nilJual",
              tgglJual: "$tgglJual",
              totJual: "$totJual",
              totPajak: "$totPajak",
              jumBayar: "$jumBayar",
              tgglBayar: "$tgglBayar",
              tgglBayar2: "$tgglBayar",
              sttsPajak: "$sttsPajak",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$pajak",
          includeArrayIndex: "no",
        },
      },
      {
        $project: {
          _id: 0,
          no: { $add: ["$no", 1] },
          nama: "$pajak.nama",
          npwpd: "$pajak.npwpd",
          alamat: "$pajak.alamat",
          kec: "$pajak.kec",
          hpTel: "$pajak.hpTel",
          volTon: "$pajak.volTon",
          nilJual: "$pajak.nilJual",
          tgglJual: "$pajak.tgglJual",
          totJual: "$pajak.totJual",
          totPajak: "$pajak.totPajak",
          jumBayar: "$pajak.jumBayar",
          tgglBayar: "$pajak.tgglBayar",
          sttsPajak: "$pajak.sttsPajak",
        },
      },
    ]);
  } else {
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
          _id: 1,
          pajak: {
            $push: {
              nama: "$namaPemilik",
              npwpd: "$npwpd",
              alamat: "$alamatLengkap",
              kec: "$kec",
              hpTel: "$hpTel",
              volTon: "$volTon",
              nilJual: "$nilJual",
              tgglJual: "$tgglJual",
              totJual: "$totJual",
              totPajak: "$totPajak",
              jumBayar: "$jumBayar",
              tgglBayar: "$tgglBayar",
              sttsPajak: "$sttsPajak",
            },
          },
        },
      },
      {
        $unwind: {
          path: "$pajak",
          includeArrayIndex: "no",
        },
      },
      {
        $project: {
          _id: 0,
          no: { $add: ["$no", 1] },
          nama: "$pajak.nama",
          npwpd: "$pajak.npwpd",
          alamat: "$pajak.alamat",
          kec: "$pajak.kec",
          hpTel: "$pajak.hpTel",
          volTon: "$pajak.volTon",
          nilJual: "$pajak.nilJual",
          tgglJual: "$pajak.tgglJual",
          totJual: "$pajak.totJual",
          totPajak: "$pajak.totPajak",
          jumBayar: "$pajak.jumBayar",
          tgglBayar: "$pajak.tgglBayar",
          sttsPajak: "$pajak.sttsPajak",
        },
      },
      {
        $addFields: {
          tgglJual: {
            $dateToString: { format: "%d-%m-%Y", date: "$tgglJual" },
          },
          tgglBayar: {
            $dateToString: { format: "%d-%m-%Y", date: "$tgglBayar" },
          },
        },
      },
    ]);
  }

  if (laporans && laporans.length > 0) {
    const filePath = path.resolve(".", "public/images/kota-praya.png");
    const imageBuffer = fs.readFileSync(filePath);
    const imageString = imageBuffer.toString("base64");
    // console.log(imageString);

    res.setHeader("Content-Type", "image/png");
    res.send({ laporans, imageString, tipe, tahun, bulan, triwulan, semester });
  } else {
    res.send({ pesan: "Laporan tidak ada" });
  }
  await db.disconnect();
});

export default handler;
