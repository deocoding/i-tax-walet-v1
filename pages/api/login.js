import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import db from "../../utils/db";
import { signToken } from "../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
  await db.connect();
  const user = await User.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(user);

    await db.disconnect();
    res.send({
      token,
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
    await db.disconnect();
  }
});

export default handler;
