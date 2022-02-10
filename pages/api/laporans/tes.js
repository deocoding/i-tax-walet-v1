import React from "react";
import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import Pajak from "../../../models/Pajak";
import db from "../../../utils/db";
import * as fs from "fs";

const handler = nc();
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();

  const tes = fs.readFileSync("images/kota-praya.png");
  console.log(tes);

  //   res.send({ tes });

  // export default ExportToExcel;
});

export default handler;
