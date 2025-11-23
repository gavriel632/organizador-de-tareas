// Importa todas las funciones del modelo de recordatorios (reminders.model.js) para interactuar con Firestore.
import * as model from "../models/reminders.model.js";
// Importa el objeto Timestamp de Firebase para manejar correctamente las fechas y horas en Firestore.
import { Timestamp } from "firebase/firestore";

////////////////////////////////////////////////////
// Obtener TODOS los recordatorios (GET /reminders)
////////////////////////////////////////////////////
// Función controladora para obtener todos los recordatorios.
export const getAllReminders = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los documentos.
        const reminders = await model.getAllReminders();
        // Responde con un código 200 (OK) y el array de recordatorios.
        res.json(reminders);
    } catch (error) {
        // Manejo de errores 500 (Internal Server Error).
        res.status(500).json({ error: "Error al obtener los recordatorios" });
    }
};

////////////////////////////////////////////////////
// Buscar recordatorios por nombre (GET /reminders/search?nombre=...)
////////////////////////////////////////////////////
// Función controladora para filtrar recordatorios por un término de búsqueda en el nombre.
export const searchReminder = async (req, res) => {
    try {
        // Obtiene el parámetro de consulta 'nombre' de la URL.
        const { nombre } = req.query;
        // Obtiene todos los recordatorios (se asume que la consulta se filtra en memoria).
        const reminders = await model.getAllReminders();

        // Filtra los recordatorios en el servidor.
        const filtered = reminders.filter(rem =>
            // Asegura que 'nombre' no sea nulo, convierte a minúsculas, y busca la coincidencia.
            (rem.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        // Responde con el subconjunto filtrado.
        res.json(filtered);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al buscar recordatorios" });
    }
};

////////////////////////////////////////////////////
// Obtener recordatorio por ID (GET /reminders/:id)
////////////////////////////////////////////////////
// Función controladora para obtener un recordatorio específico por su ID.
export const getReminderById = async (req, res) => {
    try {
        // Llama al modelo para buscar el recordatorio usando el ID del parámetro de la ruta.
        const reminder = await model.getReminderById(req.params.id);

        // Si el recordatorio no se encuentra.
        if (!reminder) return res.status(404).json({ error: "Recordatorio no encontrado" });

        // Responde con el objeto recordatorio.
        res.json(reminder);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al obtener el recordatorio" });
    }
};

////////////////////////////////////////////////////
// Crear recordatorio (POST /reminders)
////////////////////////////////////////////////////
// Función controladora para crear un nuevo recordatorio.
export const createReminder = async (req, res) => {
    try {
        // Desestructura los datos del cuerpo de la solicitud (req.body).
        const { nombre, cuerpo, fecha_hora, id_usuario, id_habito } = req.body;

        // Llama al modelo para guardar el nuevo recordatorio.
        const newReminder = await model.createReminder({
            nombre,
            cuerpo,
            // Convierte la cadena de fecha/hora de entrada a un objeto Date, y luego a un Timestamp de Firestore.
            // Si fecha_hora es nulo, se guarda como null en Firestore.
            fecha_hora: fecha_hora ? Timestamp.fromDate(new Date(fecha_hora)) : null,
            // Establece la fecha de creación automáticamente usando Timestamp.now().
            fecha_creacion: Timestamp.now(),
            // Asigna un valor nulo si los IDs no están presentes en el cuerpo.
            id_usuario: id_usuario ?? null,
            id_habito: id_habito ?? null
        });

        // Responde con un código 201 (Created) y el objeto del nuevo recordatorio.
        res.status(201).json(newReminder);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al crear el recordatorio" });
    }
};

////////////////////////////////////////////////////
// Actualizar recordatorio (PUT/PATCH /reminders/:id)
////////////////////////////////////////////////////
// Función controladora para actualizar un recordatorio existente.
export const updateReminder = async (req, res) => {
    try {
        // Llama al modelo para actualizar el documento usando el ID del parámetro de la ruta y los datos del cuerpo.
        const updated = await model.updateReminder(req.params.id, req.body);

        // Si el modelo retorna null (recordatorio no encontrado).
        if (!updated) return res.status(404).json({ error: "Recordatorio no encontrado" });

        // Responde con el objeto recordatorio ya actualizado.
        res.json(updated);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al actualizar el recordatorio" });
    }
};

////////////////////////////////////////////////////
// Eliminar recordatorio (DELETE /reminders/:id)
////////////////////////////////////////////////////
// Función controladora para eliminar un recordatorio.
export const deleteReminder = async (req, res) => {
    try {
        // Llama al modelo para eliminar el documento usando el ID del parámetro de la ruta.
        const deleted = await model.deleteReminder(req.params.id);

        // Si el modelo retorna null (recordatorio no encontrado).
        if (!deleted) return res.status(404).json({ error: "Recordatorio no encontrado" });

        // Responde con un código 204 (No Content), indicando que la eliminación fue exitosa.
        res.status(204).send();
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al eliminar el recordatorio" });
    }
};