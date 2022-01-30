import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import User from "../../../../models/User";
import Bangunan from "../../../../models/Bangunan";
import db from "../../../../utils/db";
import mongoose from "mongoose";

const handler = nc();
handler.use(isAuth);

handler.delete(async (req, res) => {
  await db.connect();

  //   const userIds = req.query.ids.toArray();

  //   res.send(req.query.ids);
  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const user = await User.remove({
    _id: { $in: temp },
  });

  if (user) {
    //         await Bangunan.deleteMany({ user: req.query.id });
    //         await user.remove();
    //     await db.disconnect();
    res.send({ pesan: "User berhasil dihapus" });
    //         console.log("User dihapus");
  } else {
    res.send({ pesan: "User gagal dihapus" });
    //         console.log("User tidak ditemukan");
  }
  await db.disconnect();
});

export default handler;
