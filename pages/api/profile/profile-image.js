import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from "../../../models/User";
import { signToken } from "../../../utils/auth";
import db from "../../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.userId);
  if (user) {
    user.image = req.body.gambar;
    await user.save();

    const token = signToken(user);

    await db.disconnect();
    res.send({
      token,
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
      pesan: "Data berhasil ditambahkan",
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
