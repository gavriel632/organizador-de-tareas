
import { Router } from "express";

// Asegurarse de que el import sea desde la ruta correcta
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);

export default router;