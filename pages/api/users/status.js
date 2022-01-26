import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.userId);
  if (user) {
    user.status = req.body.status;
    await user.save();
    res.send({ pesan: "Status berhasil diubah", status: user.status });
    await db.disconnect();
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
