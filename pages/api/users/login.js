import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import Bangunan from "../../../models/Bangunan";
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);
    const almt = user.alamat.detail ? "ok" : null;
    const bangunan = (await Bangunan.findOne({ user: user._id })) ? "ok" : null;
    res.send({
      token,
      _id: user._id,
      namaLengkap: user.namaLengkap,
      email: user.email,
      isAdmin: user.isAdmin,
      alamat: almt,
      bangunan: bangunan,
    });

    await db.disconnect();
  } else {
    res.status(401).send({ message: "Invalid email or password" });
    await db.disconnect();
  }
});

export default handler;
