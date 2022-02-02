import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import { v2 as cloudinary } from "cloudinary";
import { isAuth } from "../../../utils/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = nc();
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.userId);
  if (user) {
    user.image = "";
    const updatedUser = await user.save();
    await db.disconnect();
    cloudinary.uploader.destroy(req.body.namaFile, function (error, result) {
      if (result) {
        res.send({
          pesan: "User updated",
        });
      }
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
