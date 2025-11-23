import * as model from "../models/tasks.model.js";
import { Timestamp } from "firebase/firestore";

////////////////////////////////////////////////////
// 🔓 OBTENER TODAS LAS TAREAS (modo admin temporal)
////////////////////////////////////////////////////
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await model.getAllTasks();  // no está filtrado por usuario
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las tareas." });
    }
};

////////////////////////////////////////////////////
// 🔓 BUSCAR TAREAS POR TÍTULO (modo admin temporal)
////////////////////////////////////////////////////
export const searchTask = async (req, res) => {
    try {
        const { titulo } = req.query;
        const tasks = await model.getAllTasks();

        const filteredTasks = tasks.filter(task =>
            (task.titulo ?? "").toLowerCase().includes((titulo ?? "").toLowerCase())
        );

        res.json(filteredTasks);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar tareas." });
    }
};

////////////////////////////////////////////////////
// 🔓 OBTENER TAREA POR ID (modo admin temporal)
////////////////////////////////////////////////////
export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await model.getTaskById(id);

        if (!task) return res.status(404).json({ error: "Tarea no encontrada" });

        // ⚠️ Temporal: no se valida dueño (modo admin)
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener la tarea" });
    }
};

////////////////////////////////////////////////////
// CREAR TAREA (asociada al usuario logueado)
////////////////////////////////////////////////////
export const createTask = async (req, res) => {
    try {
        const userId = null; // 🔓 MODO ADMIN TEMPORAL SIN JWT
        const { titulo, descripcion, estado, prioridad, fecha_vencimiento, id_categoria } = req.body;

        const newTask = await model.createTask({
            titulo,
            descripcion,
            estado: estado || "pendiente",
            prioridad: prioridad || "normal",
            fecha_creacion: Timestamp.now(),
            fecha_vencimiento: fecha_vencimiento ? Timestamp.fromDate(new Date(fecha_vencimiento)) : null,
            id_categoria: id_categoria || null,
            id_usuario: userId  // 👈 dejar guardado para uso futuro
        });

        res.status(201).json(newTask);
    } catch (error) {
        console.error("CREATE TASK ERROR:", error);
        res.status(500).json({ error: "Error al crear la tarea", detalle: error.message });
    }
};


////////////////////////////////////////////////////
// 🔓 ACTUALIZAR TAREA (modo admin temporal)
////////////////////////////////////////////////////
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await model.updateTask(id, req.body);

        if (!updated) return res.status(404).json({ error: "Tarea no encontrada" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
};

////////////////////////////////////////////////////
// 🔓 ELIMINAR TAREA (modo admin temporal)
////////////////////////////////////////////////////
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.deleteTask(id);

        if (!deleted) return res.status(404).json({ error: "Tarea no encontrada" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
};
