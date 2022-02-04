import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import ObjekPajak from "../../../models/ObjekPajak";
import WajibPajak from "../../../models/WajibPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const objekPajak = await ObjekPajak.findById(req.query.id);
  if (objekPajak) {
    await db.disconnect();
    res.send(objekPajak);
  } else {
    await db.disconnect();
    res.send({ pesan: "Objek Pajak not found" });
  }
});

// handler.get(async (req, res) => {
//   await db.connect();

//   const objekPajaks = await ObjekPajak.aggregate([
//     {
//       $lookup: {
//         from: "wajibpajaks",
//         localField: "wajibPajak", // field in the orders collection
//         foreignField: "_id", // field in the items collection
//         as: "fromWajibPajak",
//       },
//     },
//     { $match: { _id: req.query.id } },
//     {
//       $replaceRoot: {
//         newRoot: {
//           $mergeObjects: [{ $arrayElemAt: ["$fromWajibPajak", 0] }, "$$ROOT"],
//         },
//       },
//     },
//     { $project: { fromWajibPajak: 0 } },
//   ]);
//   await db.disconnect();
//   res.send(objekPajaks);
// });

export default handler;
