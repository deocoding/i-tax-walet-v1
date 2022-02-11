import nc from "next-connect";
import mongoose from "mongoose";
import db from "../../../../utils/db";
import { isAuth } from "../../../../utils/auth";
import { onError } from "../../../../utils/error";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import ObjekPajak from "../../../../models/ObjekPajak";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb", // Set desired value here
    },
  },
};

const handler = nc({ onError });
// const upload = multer();
// handler.use(isAuth, upload.single("file")).post(async (req, res) => {
//   const streamUpload = (req) => {
//     return new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         { folder: "i-tax-walet", width: 800, crop: "scale" },
//         (error, result) => {
//           if (result) {
//             resolve(result);
//           } else {
//             reject(error);
//           }
//         }
//       );
//       streamifier.createReadStream(req).pipe(stream);
//     });
//   };
//   const result = await streamUpload(req);
//   res.send(result);
// });

handler.post(async (req, res) => {
  const { images } = req.body;
  let promises = [];
  images.forEach(async (image) => {
    promises.push(
      cloudinary.uploader.upload(image, {
        folder: "i-tax-walet",
        width: 840,
        crop: "scale",
      })
    );
  });
  const response = await Promise.all(promises);
  await db.connect();
  const objekPajak = await ObjekPajak.findById(
    mongoose.Types.ObjectId(req.body.objekPajakId)
  );
  response.forEach(async (espon) => {
    await objekPajak.kumpFoto.push({ image: espon.public_id });
  });
  const berhasil = await objekPajak.save();
  await db.disconnect();
  res.send(berhasil);
});

export default handler;
