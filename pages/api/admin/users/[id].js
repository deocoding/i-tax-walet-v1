import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import User from "../../../../models/User";
import Bangunan from "../../../../models/Bangunan";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);

  if (user) {
    await Bangunan.deleteMany({ user: req.query.id });
    await user.remove();
    await db.disconnect();
    res.send({ message: "User Deleted" });
    console.log("User dihapus");
  } else {
    await db.disconnect();
    res.status(404).send({ message: "User Not Found" });
    console.log("User tidak ditemukan");
  }
});

export default handler;
