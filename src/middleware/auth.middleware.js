import jwt from "jsonwebtoken";

export const validarToken = (req, res, next) => {
  try {
    // 1. Obtener el Header Authorization
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Acceso denegado. Token requerido." });
    }

    // 2. Extraer el token (formato: "Bearer <token>")
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado." });
    }

    // 3. Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido o expirado." });
      }

      // 4. Guardar datos del usuario autenticado
      // ⚠️ Importante: nunca guardamos info sensible como contraseña.
      req.user = {
        id: payload.id,
        email: payload.email
      };

      // 5. Continuar con la ruta protegida
      next();
    });

  } catch (error) {
    return res.status(500).json({ error: "Error en autenticación." });
  }
};
