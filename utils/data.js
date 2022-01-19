import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      namaLengkap: "John Sander",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin"),
      isAdmin: true,
    },
    {
      namaLengkap: "Jane Price",
      email: "user@example.com",
      password: bcrypt.hashSync("user"),
    },
  ],

  bangunans: [
    {
      user: "61e475513eda4f7956fc4ddd",
      alamat: "Jl. GG No. 102 RT. 1 RW. 2",
      kec: "Pahandut",
      kabKot: "Kota Palangka Raya",
      hpTel: "123412341234",
      lat: "-2.243112008996988",
      long: "113.92772312454537",
      tipe: "Permanen",
      jumLan: 5,
      jumBur: 50,
      imb: "no surat IMB",
      itu: "no surat SITU",
      status: 1,
    },
    {
      user: "61e475513eda4f7956fc4ddd",
      alamat: "Jl. ABC No. 12 RT. 21 RW. 6",
      kec: "Menteng",
      kabKot: "Kota Palangka Raya",
      hpTel: "123412341234",
      lat: "-2.235139092730634",
      long: "113.89580709058862",
      tipe: "Semi Permanen",
      jumLan: 7,
      jumBur: 100,
      imb: "no surat IMB",
      itu: "no surat SITU",
      status: 1,
    },
  ],
};
export default data;
