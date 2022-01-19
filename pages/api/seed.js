import nc from "next-connect";
import User from "../../models/User";
// import Pemilik from "../../models/Pemilik";
// import Bangunan from "../../models/Bangunan";
import db from "../../utils/db";
import data from "../../utils/data";

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  // await Pemilik.deleteMany();
  // await Pemilik.insertMany(data.pemiliks);
  // await Bangunan.deleteMany();
  // await Bangunan.insertMany(data.bangunans);
  await db.disconnect();
  res.send({ message: "seeded successfully" });
});

export default handler;
