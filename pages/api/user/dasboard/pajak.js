import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";
import moment from "moment";
import mongoose from "mongoose";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const countPajak = await Pajak.find({
    user: req.user._id,
  }).count();
  const totBay = await Pajak.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.user._id) } },
    {
      $group: {
        _id: "$user",
        total: {
          $sum: "$totBay",
        },
      },
    },
  ]);
  await db.disconnect();
  res.send({ countPajak, totBay });
});

export default handler;
