import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import User from "../../../../models/User";
import db from "../../../../utils/db";
import bcrypt from "bcryptjs";

const handler = nc();
handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    namaLengkap: req.body.namaLengkap,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
    hpTel: req.body.hpTel,
    npwpd: req.body.npwpd,
    alamat: {
      detail: req.body.alamatDetail,
      kec: req.body.alamatKec,
    },
    status: req.body.status,
  });
  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send("User berhasil dibuat");
});

export default handler;
