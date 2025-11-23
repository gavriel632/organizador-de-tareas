import * as model from '../models/subtasks.model.js';

////////////////////////////////////////////////////
// 📌 OBTENER TODAS LAS SUBTAREAS
////////////////////////////////////////////////////
export const getAllSubtasks = async (req, res) => {
    try {
        const subtasks = await model.getAllSubtasks();
        res.json(subtasks);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las subtareas" });
    }
};

////////////////////////////////////////////////////
// 🔍 BUSCAR SUBTAREAS POR NOMBRE
////////////////////////////////////////////////////
export const searchSubtask = async (req, res) => {
    try {
        const { nombre } = req.query;
        const subtasks = await model.getAllSubtasks();

        const filtered = subtasks.filter(sub =>
            (sub.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        res.json(filtered);
    } catch {
        res.status(500).json({ error: "Error al buscar las subtareas" });
    }
};

////////////////////////////////////////////////////
// 📌 OBTENER UNA SUBTAREA POR ID
////////////////////////////////////////////////////
export const getSubtaskById = async (req, res) => { 
    try {
        const { id } = req.params;
        const subtask = await model.getSubtaskById(id);

        if (!subtask) return res.status(404).json({ error: "Subtarea no encontrada" });

        res.json(subtask);
    } catch {
        res.status(500).json({ error: "Error al obtener la subtarea" });
    }
};

////////////////////////////////////////////////////
// ➕ CREAR SUBTAREA
////////////////////////////////////////////////////
export const createSubtask = async (req, res) => {
    try {
        const { nombre, id_tarea, completado } = req.body;

        if (!nombre || !id_tarea) {
            return res.status(400).json({ error: "nombre e id_tarea son obligatorios" });
        }

        const newSubtask = await model.createSubtask({ nombre, id_tarea, completado });

        res.status(201).json(newSubtask);
    } catch {
        res.status(500).json({ error: "Error al crear la subtarea" });
    }
};

////////////////////////////////////////////////////
// ✏️ ACTUALIZAR SUBTAREA
////////////////////////////////////////////////////
export const updateSubtask = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await model.updateSubtask(id, req.body);

        if (!updated) return res.status(404).json({ error: "Subtarea no encontrada" });

        res.json(updated);
    } catch {
        res.status(500).json({ error: "Error al actualizar la subtarea" });
    }
};

////////////////////////////////////////////////////
// 🗑️ ELIMINAR SUBTAREA
////////////////////////////////////////////////////
export const deleteSubtask = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.deleteSubtask(id);

        if (!deleted) return res.status(404).json({ error: "Subtarea no encontrada" });

        res.status(204).send(); // No contenido
    } catch {
        res.status(500).json({ error: "Error al eliminar la subtarea" });
    }
};
