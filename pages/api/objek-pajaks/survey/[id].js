import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import ObjekPajak from "../../../../models/ObjekPajak";
import WajibPajak from "../../../../models/WajibPajak";
import ProyeksiPopulasi from "../../../../models/ProyeksiPopulasi";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const objekPajak = await ObjekPajak.findById(req.query.id);

  if (objekPajak) {
    const wajibPajak = await WajibPajak.findById(objekPajak.wajibPajak);

    // const proyPopuls = await ProyeksiPopulasi.find({
    //   objekPajak: objekPajak._id,
    // });

    // const proyPopuls = await ProyeksiPopulasi.aggregate([
    //   {
    //     $match: { objekPajak: objekPajak._id },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         year: { $year: "$tgglProyeksi" },
    //         month: { $month: "$tgglProyeksi" },
    //       },
    //       total_populasi: { $sum: "$jumBur" },
    //     },
    //   },
    // ]);

    const proyPopuls = await ProyeksiPopulasi.aggregate([
      {
        $match: { objekPajak: objekPajak._id },
      },
      {
        $project: {
          day: {
            $dayOfMonth: { date: "$tgglProyeksi", timezone: "Asia/Jakarta" },
          },
          month: {
            $month: { date: "$tgglProyeksi", timezone: "Asia/Jakarta" },
          },
          year: { $year: { date: "$tgglProyeksi", timezone: "Asia/Jakarta" } },
          total_populasi: { $sum: "$jumBur" },
        },
      },
    ]);

    await db.disconnect();

    res.send({
      objekPajak,
      wajibPajak,
      proyPopuls,
    });
  } else {
    await db.disconnect();

    res.send({ pesan: "Objek Pajak not found" });
  }
});

export default handler;
