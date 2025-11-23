// Importa la librería JSON Web Token (JWT).
import jwt from "jsonwebtoken";

/**
 * Middleware para validar la autenticidad y vigencia de un JSON Web Token (JWT)
 * presente en el encabezado 'Authorization: Bearer <token>'.
 * Si es válido, adjunta el payload del usuario (id, email) a req.user y continúa.
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware o controlador.
 */
export const validarToken = (req, res, next) => {
    try {
        // 1. Obtener el Header Authorization
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            // 401: Unauthorized (Acceso no autorizado)
            return res.status(401).json({ error: "Acceso denegado. Token requerido." });
        }

        // 2. Extraer el token (espera formato: "Bearer <token>")
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado." });
        }

        // 3. Verificar token
        // Usa la clave secreta del servidor para validar la firma y expiración del token.
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                // 403: Forbidden (El servidor entendió la petición, pero se niega a autorizarla. Ej: token inválido o expirado).
                return res.status(403).json({ error: "Token inválido o expirado." });
            }

            // 4. Guardar datos del usuario autenticado en el objeto request
            // Estos datos estarán disponibles en los controladores posteriores (ej: req.user.id).
            req.user = {
                id: payload.id,
                email: payload.email
            };

            // 5. Continuar con la ruta protegida
            next();
        });

    } catch (error) {
        // Manejo de errores genéricos (ej: el formato del header no es "Bearer ...")
        console.error("Error en validación de token:", error);
        return res.status(500).json({ error: "Error en autenticación del servidor." });
    }
};