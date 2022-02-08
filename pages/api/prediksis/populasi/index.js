import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import WajibPajak from "../../../../models/WajibPajak";
import ProyeksiPopulasi from "../../../../models/ProyeksiPopulasi";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const prediksisPopulasi = await WajibPajak.aggregate([
    {
      $lookup: {
        from: "objekpajaks",
        localField: "_id",
        foreignField: "wajibPajak",
        as: "fromObjekPajak",
      },
    },
    {
      $lookup: {
        from: "pajaks",
        localField: "_id",
        foreignField: "wajibPajak",
        as: "getPajaks",
      },
    },
    {
      $lookup: {
        from: "proyeksipopulasis",
        localField: "fromObjekPajak._id",
        foreignField: "objekPajak",
        as: "proyeksiPopulasi",
      },
    },
    {
      $group: {
        _id: "$_id",
        nama_pemilik: { $first: "$namaPemilik" },
        npwpd: { $first: "$npwpd" },
        total_populasi: { $first: { $sum: "$proyeksiPopulasi.jumBur" } },
        total_bayar: { $first: { $sum: "$getPajaks.jumBayar" } },
        objekId: { $first: "$fromObjekPajak._id" },
        populasiId: { $first: "$proyeksiPopulasi._id" },
        pajakId: { $first: "$getPajaks._id" },
      },
    },
  ]);

  if (prediksisPopulasi) {
    res.send({ prediksisPopulasi });
  } else {
    res.status(404).send({ pesan: "Prediksi not found" });
  }
  await db.disconnect();
});

export default handler;
