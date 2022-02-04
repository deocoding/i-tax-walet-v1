import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find({
    role: { $ne: 1 },
  });
  await db.disconnect();
  res.send(users);
});

handler.post(async (req, res) => {
  await db.connect();
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    role: req.body.role,
  });
  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send(user);
});

handler.delete(async (req, res) => {
  await db.connect();

  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const user = await User.deleteMany({
    _id: { $in: temp },
  });

  if (user) {
    res.send({ pesan: "User berhasil dihapus" });
  } else {
    res.status(404).send({ pesan: "User not found" });
  }
  await db.disconnect();
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.userId);
  if (user) {
    user.image = req.body.gambar;
    const updatedUser = await user.save();

    await db.disconnect();
    res.send({
      message: "User updated",
      user: updatedUser,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
