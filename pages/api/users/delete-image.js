import nc from "next-connect";
import User from "../../../models/User";
import db from "../../../utils/db";
import { v2 as cloudinary } from "cloudinary";
import { signToken } from "../../../utils/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.body.userId);
  if (user) {
    user.image = "";
    await user.save();

    const token = signToken(user);
    const almt = user.alamat.detail ? "ok" : null;
    await db.disconnect();
    cloudinary.uploader.destroy(req.body.namaFile, function (error, result) {
      if (result) {
        res.send({
          token,
          _id: user._id,
          namaLengkap: user.namaLengkap,
          email: user.email,
          isAdmin: user.isAdmin,
          alamat: almt,
          image: user.image,
          pesan: "Gambar berhasil dihapus",
          // bangunan: bangunan,
        });
      }
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "User Not Found" });
  }
});

export default handler;
