// Importa todas las funciones del modelo de subtareas (subtasks.model.js) para interactuar con Firestore.
import * as model from '../models/subtasks.model.js';

////////////////////////////////////////////////////
// 📌 OBTENER TODAS LAS SUBTAREAS (GET /subtasks)
////////////////////////////////////////////////////
// Función controladora para obtener todas las subtareas.
export const getAllSubtasks = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los documentos.
        const subtasks = await model.getAllSubtasks();
        // Responde con un código 200 (OK) y el array de subtareas.
        res.json(subtasks);
    } catch (error) {
        // Captura y maneja errores internos.
        res.status(500).json({ error: "Error al obtener las subtareas" });
    }
};

////////////////////////////////////////////////////
// 🔍 BUSCAR SUBTAREAS POR NOMBRE (GET /subtasks/search?nombre=...)
////////////////////////////////////////////////////
// Función controladora para filtrar subtareas por un término de búsqueda en el nombre.
export const searchSubtask = async (req, res) => {
    try {
        // Obtiene el parámetro de consulta 'nombre' de la URL.
        const { nombre } = req.query;
        // Obtiene todas las subtareas para filtrar en el servidor.
        const subtasks = await model.getAllSubtasks();

        // Filtra las subtareas en memoria.
        const filtered = subtasks.filter(sub =>
            // Busca coincidencias insensibles a mayúsculas/minúsculas.
            (sub.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        // Responde con el subconjunto filtrado.
        res.json(filtered);
    } catch (error) { // Variable 'error' añadida.
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al buscar las subtareas" });
    }
};

////////////////////////////////////////////////////
// 📌 OBTENER UNA SUBTAREA POR ID (GET /subtasks/:id)
////////////////////////////////////////////////////
// Función controladora para obtener una subtarea específica por su ID.
export const getSubtaskById = async (req, res) => { 
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Llama al modelo para buscar la subtarea.
        const subtask = await model.getSubtaskById(id);

        // Si la subtarea no se encuentra, responde con 404 (Not Found).
        if (!subtask) return res.status(404).json({ error: "Subtarea no encontrada" });

        // Responde con el objeto subtarea.
        res.json(subtask);
    } catch (error) { // Variable 'error' añadida.
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al obtener la subtarea" });
    }
};

////////////////////////////////////////////////////
// ➕ CREAR SUBTAREA (POST /subtasks)
////////////////////////////////////////////////////
// Función controladora para crear una nueva subtarea.
export const createSubtask = async (req, res) => {
    try {
        // Desestructura los datos del cuerpo de la solicitud.
        const { nombre, id_tarea, completado } = req.body;

        // Validación de datos: Nombre e ID de la tarea padre son obligatorios.
        if (!nombre || !id_tarea) {
            return res.status(400).json({ error: "nombre e id_tarea son obligatorios" });
        }

        // Llama al modelo para guardar la nueva subtarea en Firestore.
        const newSubtask = await model.createSubtask({ nombre, id_tarea, completado });

        // Responde con un código 201 (Created) y el objeto de la nueva subtarea.
        res.status(201).json(newSubtask);
    } catch (error) { // Variable 'error' añadida.
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al crear la subtarea" });
    }
};

////////////////////////////////////////////////////
// ✏️ ACTUALIZAR SUBTAREA (PUT/PATCH /subtasks/:id)
////////////////////////////////////////////////////
// Función controladora para actualizar los datos de una subtarea existente.
export const updateSubtask = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Llama al modelo para actualizar el documento con los datos del cuerpo.
        const updated = await model.updateSubtask(id, req.body);

        // Si el modelo retorna null (subtarea no encontrada).
        if (!updated) return res.status(404).json({ error: "Subtarea no encontrada" });

        // Responde con el objeto subtarea ya actualizado.
        res.json(updated);
    } catch (error) { // Variable 'error' añadida.
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al actualizar la subtarea" });
    }
};

////////////////////////////////////////////////////
// 🗑️ ELIMINAR SUBTAREA (DELETE /subtasks/:id)
////////////////////////////////////////////////////
// Función controladora para eliminar una subtarea.
export const deleteSubtask = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Llama al modelo para eliminar el documento.
        const deleted = await model.deleteSubtask(id);

        // Si el modelo retorna null (subtarea no encontrada).
        if (!deleted) return res.status(404).json({ error: "Subtarea no encontrada" });

        // Responde con un código 204 (No Content), indicando éxito sin retornar cuerpo.
        res.status(204).send();
    } catch (error) { // Variable 'error' añadida.
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al eliminar la subtarea" });
    }
};