import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      namaLengkap: "Administrator",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin"),
      isAdmin: true,
    },
    {
      namaLengkap: "User 1",
      email: "user1@example.com",
      password: bcrypt.hashSync("user1"),
    },
    {
      namaLengkap: "User 2",
      email: "user2@example.com",
      password: bcrypt.hashSync("user2"),
    },
    {
      namaLengkap: "User 3",
      email: "user3@example.com",
      password: bcrypt.hashSync("user3"),
    },
  ],
};
export default data;
