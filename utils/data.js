import bcrypt from "bcryptjs";
const data = {
  users: [
    {
      username: "Superadmin",
      email: "superadmin@example.com",
      password: bcrypt.hashSync("superadmin"),
      role: 1,
    },
    {
      username: "Admin Bapenda",
      email: "admin@example.com",
      password: bcrypt.hashSync("admin"),
      role: 2,
    },
    {
      username: "Surveyor Bapenda",
      email: "surveyor@example.com",
      password: bcrypt.hashSync("surveyor"),
      role: 3,
    },
    {
      username: "Operator Bapenda",
      email: "operator@example.com",
      password: bcrypt.hashSync("operator"),
      role: 4,
    },
  ],
};
export default data;
