import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);
handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.userId);
  if (user) {
    user.username = req.body.username;
    user.email = req.body.email;
    user.role = req.body.role;
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
