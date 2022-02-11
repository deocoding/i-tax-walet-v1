import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  res.send(user);
  await db.disconnect();
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.password = bcrypt.hashSync(req.body.password);
    await user.save();
    await db.disconnect();
    res.send({ pesan: "Password berhasil diubah" });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
