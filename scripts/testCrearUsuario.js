import "dotenv/config";
import { createUser } from "../src/models/users.model.js";

await createUser({
  nombre: "Admin",
  email: "admin@example.com",
  password: "123456"
});

console.log("Usuario creado!");