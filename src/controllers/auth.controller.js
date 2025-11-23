import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as UserModel from '../models/users.model.js';

const EXPIRATION_TIME = "1h"; // Token válido por 1 hora

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación básica
        if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        // Buscar usuario en Firestore
        const user = await UserModel.getUserByEmail(email);

        if (!user) {
        return res.status(401).json({ error: "Email o contraseña incorrectos." });
        }

        // Verificar contraseña (bcrypt.compare)
        const isPasswordValid = await bcrypt.compare(password, user.contraseña);

        if (!isPasswordValid) {
        return res.status(401).json({ error: "Email o contraseña incorrectos." });
        }

        // Crear payload seguro (NO incluir contraseña ni datos sensibles)
        const payload = {
        id: user.id,
        email: user.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRATION_TIME });

        // Respuesta exitosa (puede enviarse token y datos básicos)
        res.json({
        message: "Login exitoso",
        token,
        user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Error del servidor" });
    }
};
