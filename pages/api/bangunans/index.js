import nc from "next-connect";
import Bangunan from "../../../models/Bangunan";
import { signToken, isAuth } from "../../../utils/auth";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";

const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  const bangunan = await Bangunan.find({ user: req.user._id });
  res.status(200).json(bangunan);
  // res.send(bangunan);
  await db.disconnect();
});

handler.post(async (req, res) => {
  await db.connect();
  const newBangunan = new Bangunan({
    user: req.user._id,
    alamat: req.body.alamat,
    kec: req.body.kec,
    kabKot: req.body.kabKot,
    lat: req.body.lat,
    long: req.body.long,
    tipe: req.body.tipe,
    jumLan: req.body.jumLan,
    jumBur: req.body.jumBur,
    imb: req.body.simb,
    itu: req.body.situ,
  });

  const bangunan = await newBangunan.save();
  res.status(201).send(bangunan);
});

export default handler;
