// //*=======================================================
// //todo:  MIDDLEWARE DE REGISTRO GENERAL
// //*=======================================================

/**
 * Middleware de registro (logger) que imprime información detallada
 * de cada solicitud y respuesta en la consola del servidor.
 * Se salta en entornos de producción (process.env.NODE_ENV === "production").
 *
 * @param {import('express').Request} req - Objeto de solicitud.
 * @param {import('express').Response} res - Objeto de respuesta.
 * @param {import('express').NextFunction} next - Función para pasar al siguiente.
 */
export const logger = (req, res, next) => {
    // Si está en producción, NO loguea (salta el middleware)
    // Verifica la variable de entorno para evitar logs innecesarios en un servidor en vivo.
    if (process.env.NODE_ENV === "production") return next();

    // Define códigos de color ANSI para la salida de la consola.
    const c = {
        red: "\x1b[91m",    // Código para color rojo.
        yellow: "\x1b[93m", // Código para color amarillo.
        cyan: "\x1b[96m",   // Código para color cian.
        green: "\x1b[92m",  // Código para color verde.
        reset: "\x1b[0m"    // Código para restaurar el color predeterminado de la terminal.
    };

    // Almacena el tiempo actual antes de procesar la solicitud.
    const start = Date.now(); 

    // Define un listener para el evento 'finish' de la respuesta.
    // Esto asegura que el log se imprima *después* de que se haya enviado la respuesta al cliente.
    res.on("finish", () => { 
        // Calcula la duración total de la solicitud (tiempo de respuesta).
        const duration = Date.now() - start;
        
        // Imprime el bloque de log formateado usando los códigos de color ANSI.
        console.log(`
        ${c.yellow}▨▨▨▨▨▨▨▨▨▨▨▨  PETICIÓN FINALIZADA  ▨▨▨▨▨▨▨▨▨▨▨▨
        ${c.cyan}⚙ Método: ${c.green}${req.method}          // Muestra el método HTTP (GET, POST, PUT, DELETE).
        ${c.red}⚙ Ruta: ${c.yellow}${req.originalUrl}      // Muestra la URL completa solicitada.
        ${c.green}⚙ Hora: ${c.cyan}${new Date().toISOString()} // Muestra la hora de finalización en formato ISO.
        ${c.yellow}⚙ Content-Type:${c.red} ${req.headers["content-type"] || "No especificado"} // Muestra el tipo de contenido enviado en la solicitud.
        ${c.green}⚙ Estado:${c.cyan} ${res.statusCode}     // Muestra el código de estado HTTP de la respuesta (ej. 200, 404, 500).
        ${c.yellow}================================================${c.reset}
        `);
        // Línea comentada para mostrar la duración si fuera necesario: 
        // ${c.red}⚙ Duración:${c.yellow} ${duration}ms 
    });

    // Llama a next() para pasar el control al siguiente middleware o a la función de la ruta.
    // Es crucial que 'next()' se llame antes de que finalice la función 'logger'.
    next();
};