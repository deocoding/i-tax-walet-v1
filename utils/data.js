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
};
export default data;
