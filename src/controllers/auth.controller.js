// Importa la librería JSON Web Token (JWT) para crear tokens de sesión seguros.
import jwt from "jsonwebtoken";
// Importa la librería Bcryptjs para comparar el hash de la contraseña almacenada con la contraseña ingresada.
import bcrypt from "bcryptjs";
// Importa todas las funciones del modelo de usuario (users.model.js) para interactuar con Firestore.
import * as UserModel from '../models/users.model.js';

// Define la duración de validez del token JWT (1 hora).
const EXPIRATION_TIME = "1h"; 

// Define y exporta la función principal de inicio de sesión. Recibe la petición (req) y la respuesta (res) HTTP.
export const login = async (req, res) => {
    try {
        // Desestructura el email y la contraseña del cuerpo de la solicitud HTTP.
        const { email, password } = req.body;

        // Validación básica: comprueba que se hayan proporcionado ambos campos.
        if (!email || !password) {
        // Si falta alguno, responde con un error 400 (Bad Request).
        return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        // Buscar usuario en Firestore
        // Llama a la función del modelo para encontrar un usuario por el email.
        const user = await UserModel.getUserByEmail(email);

        // Si el usuario no existe en la base de datos.
        if (!user) {
        // Responde con un error 401 (Unauthorized) por credenciales incorrectas.
        return res.status(401).json({ error: "Email o contraseña incorrectos." });
        }

        // Verificar contraseña (bcrypt.compare)
        // Usa bcrypt para comparar la contraseña de texto plano ingresada con el hash almacenado en 'user.contraseña'.
        // Este proceso aplica el hash a la contraseña de entrada con el Salt del hash almacenado.
        const isPasswordValid = await bcrypt.compare(password, user.contraseña);

        // Si la comparación falla (las contraseñas no coinciden).
        if (!isPasswordValid) {
        // Responde con un error 401.
        return res.status(401).json({ error: "Email o contraseña incorrectos." });
        }

        // Crear payload seguro (NO incluir contraseña ni datos sensibles)
        // Define los datos que se incluirán dentro del token JWT.
        const payload = {
        id: user.id,
        email: user.email
        };

        // Genera el token JWT.
        // 1. payload: los datos a incrustar.
        // 2. process.env.JWT_SECRET: la clave secreta del servidor (debe ser una variable de entorno) para firmar el token.
        // 3. { expiresIn: EXPIRATION_TIME }: Opciones, establece el tiempo de expiración.
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRATION_TIME });

        // Respuesta exitosa (puede enviarse token y datos básicos)
        // Envía una respuesta HTTP 200 (OK) con el mensaje de éxito, el token, y la información básica del usuario.
        res.json({
        message: "Login exitoso",
        token, // El cliente usará este token para futuras peticiones autenticadas.
        user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }
        });

    } catch (error) {
        // Captura cualquier error inesperado del servidor o de la base de datos.
        console.error("Login error:", error);
        // Responde con un error 500 (Internal Server Error).
        return res.status(500).json({ error: "Error del servidor" });
    }
};