import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from "bcryptjs";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await db.disconnect();
    res.send(user);
  } else {
    await db.disconnect();
    res.send({ pesan: "User not found" });
  }
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.password = bcrypt.hashSync(req.body.password);
    await user.save();
    await db.disconnect();
    res.send({ pesan: "User updated" });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
