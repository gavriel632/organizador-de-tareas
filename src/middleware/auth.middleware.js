// Importa la librería JSON Web Token (JWT) para firmar y verificar tokens.
import jwt from "jsonwebtoken";

/**
 * Middleware para validar la autenticidad y vigencia de un JSON Web Token (JWT)
 * presente en el encabezado 'Authorization: Bearer <token>'.
 * Si es válido, adjunta el payload del usuario (id, email) a req.user y continúa.
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express (contiene headers).
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente controlador.
 */
export const validarToken = (req, res, next) => {
    try {
        // Inicia el bloque try-catch para manejar errores de parsing o verificación.

        // 1. Obtener el Header Authorization
        // Extrae el valor del encabezado 'authorization', donde debe estar el token.
        const authHeader = req.headers["authorization"]; 

        // Si el encabezado 'authorization' no existe, el token está ausente.
        if (!authHeader) {
            // Responde con 401 (No autorizado) si no hay cabecera de autorización.
            return res.status(401).json({ error: "Acceso denegado. Token requerido." });
        }

        // 2. Extraer el token (espera formato: "Bearer <token>")
        // Divide el string "Bearer <token>" por el espacio y toma la segunda parte ([1]).
        const token = authHeader.split(" ")[1]; 

        // Si la segunda parte no existe (ej. solo dice "Bearer"), el token es nulo.
        if (!token) {
            // Responde con 401 si el token no se pudo extraer correctamente.
            return res.status(401).json({ error: "Token no proporcionado." });
        }

        // 3. Verificar token
        // Usa la función verify de jwt, pasando el token, la clave secreta y un callback.
        // El callback maneja el resultado de la verificación (error o payload).
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            // Si hay un error (err) durante la verificación (ej. firma inválida o expiración).
            if (err) {
                // Responde con 403 (Prohibido) si el token no es válido o está caducado.
                return res.status(403).json({ error: "Token inválido o expirado." });
            }

            // Si la verificación es exitosa, el 'payload' contiene los datos originales.

            // 4. Guardar datos del usuario autenticado en el objeto request
            // Se adjunta un nuevo objeto 'user' al 'req' para que los controladores lo usen.
            req.user = {
                // Extrae el ID del payload del token.
                id: payload.id,
                // Extrae el email del payload del token.
                email: payload.email
            };

            // 5. Continuar con la ruta protegida
            // Llama a 'next()' para permitir que la solicitud pase al siguiente controlador o middleware.
            next();
        });

    } catch (error) {
        // Captura cualquier error que ocurra fuera de jwt.verify (ej. falla en split o en la lectura del header).
        // Manejo de errores genéricos (ej: el formato del header no es "Bearer ...")
        
        // Muestra el error en la consola del servidor para fines de debugging.
        console.error("Error en validación de token:", error);
        
        // Responde con 500 (Error interno del servidor) al cliente.
        return res.status(500).json({ error: "Error en autenticación del servidor." });
    }
};