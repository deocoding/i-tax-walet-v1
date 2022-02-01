import nc from "next-connect";
import { isSuperAdmin, isAuth } from "../../../utils/auth";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth, isSuperAdmin);

handler.get(async (req, res) => {
  await db.connect();

  let users;

  if (req.query.cari) {
    users = await User.find({
      $text: { $search: req.query.cari },
      role: { $ne: 1 },
    });
    await db.disconnect();
    res.send(users);
  } else {
    users = await User.find({
      role: { $ne: 1 },
    });
    await db.disconnect();
    res.send(users);
  }
});

export default handler;
