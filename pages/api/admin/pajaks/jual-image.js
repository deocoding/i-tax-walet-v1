import nc from "next-connect";
import Pajak from "../../../../models/Pajak";
import db from "../../../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  await db.connect();
  const pajak = await Pajak.findById(req.body.pajakId);
  if (pajak) {
    pajak.fotoJual = req.body.gambar;
    await pajak.save();
    await db.disconnect();
    res.status(200).send({ pesan: "Nota Penjualan berhasil ditambahkan" });
  } else {
    await db.disconnect();
    res.status(404).send({ pesan: "Pajak Not Found" });
  }
});

export default handler;
