import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import WajibPajak from "../../../models/WajibPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const wajibPajaks = await WajibPajak.find({
    role: { $ne: 1 },
  });
  await db.disconnect();
  res.send(wajibPajaks);
});

export default handler;
