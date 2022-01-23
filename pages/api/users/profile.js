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
    user.namaLengkap = req.body.namaLengkap;
    user.email = req.body.email;
    user.hpTel = req.body.hpTel;
    user.alamat.detail = req.body.alamatDetail;
    user.alamat.kec = req.body.alamatKec;
    user.alamat.kabKot = req.body.alamatKabKot;
    await user.save();
    const token = signToken(user);
    const almt = user.alamat.detail ? "ok" : null;

    await db.disconnect();
    res.send({
      token,
      _id: user._id,
      namaLengkap: user.namaLengkap,
      email: user.email,
      isAdmin: user.isAdmin,
      alamat: almt,
      image: user.image,
      pesan: "Data berhasil ditambahkan",
      // bangunan: bangunan,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
