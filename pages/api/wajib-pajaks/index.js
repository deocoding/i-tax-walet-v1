import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import WajibPajak from "../../../models/WajibPajak";
import db from "../../../utils/db";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  let wajibPajaks;

  if (req.query.cari) {
    wajibPajaks = await WajibPajak.find({
      $text: { $search: req.query.cari },
      role: { $ne: 1 },
    });
    await db.disconnect();
    res.send(wajibPajaks);
  } else {
    wajibPajaks = await WajibPajak.find({
      role: { $ne: 1 },
    });
    await db.disconnect();
    res.send(wajibPajaks);
  }
});

handler.post(async (req, res) => {
  await db.connect();
  const newWajibPajak = new WajibPajak({
    namaPemilik: req.body.namaPemilik,
    npwpd: req.body.npwpd,
    alamatLengkap: req.body.alamatLengkap,
    kec: req.body.kec,
    hpTel: req.body.hpTel,
  });
  const wajibPajak = await newWajibPajak.save();
  await db.disconnect();
  res.status(201).send(wajibPajak);
});

handler.delete(async (req, res) => {
  await db.connect();

  let str = req.query.ids;
  let temp = new Array();

  temp = str.split(",");

  const wajibPajak = await WajibPajak.deleteMany({
    _id: { $in: temp },
  });

  if (wajibPajak) {
    res.send({ pesan: "Wajib Pajak berhasil dihapus" });
  } else {
    res.status(404).send({ pesan: "Wajib Pajak not found" });
  }
  await db.disconnect();
});

handler.put(async (req, res) => {
  await db.connect();
  const wajibPajak = await WajibPajak.findById(req.body.wajibPajakId);
  if (wajibPajak) {
    wajibPajak.namaPemilik = req.body.namaPemilik;
    wajibPajak.npwpd = req.body.npwpd;
    wajibPajak.alamatLengkap = req.body.alamatLengkap;
    wajibPajak.kec = req.body.kec;
    wajibPajak.hpTel = req.body.hpTel;
    const updatedWajibPajak = await wajibPajak.save();

    await db.disconnect();
    res.send({
      message: "Wajib Pajak updated",
      wajibPajak: updatedWajibPajak,
    });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Wajib Pajak Not Found" });
  }
});

export default handler;
