import nc from "next-connect";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const pajak = await Pajak.findById(req.body.pajakId);
  if (pajak) {
    pajak.fotoJual = "";
    await pajak.save();
    await db.disconnect();
    cloudinary.uploader.destroy(req.body.namaFile, function (error, result) {
      if (result) {
        res.send({
          pesan: "Gambar berhasil dihapus",
          // bangunan: bangunan,
        });
      }
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Pajak Not Found" });
  }
});

export default handler;
