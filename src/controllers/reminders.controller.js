import * as model from "../models/reminders.model.js";
import { Timestamp } from "firebase/firestore";

////////////////////////////////////////////////////
// Obtener TODOS los recordatorios
////////////////////////////////////////////////////
export const getAllReminders = async (req, res) => {
    try {
        const reminders = await model.getAllReminders();
        res.json(reminders);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los recordatorios" });
    }
};

////////////////////////////////////////////////////
// Buscar recordatorios por nombre
////////////////////////////////////////////////////
export const searchReminder = async (req, res) => {
    try {
        const { nombre } = req.query;
        const reminders = await model.getAllReminders();

        const filtered = reminders.filter(rem =>
            (rem.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar recordatorios" });
    }
};

////////////////////////////////////////////////////
// Obtener recordatorio por ID
////////////////////////////////////////////////////
export const getReminderById = async (req, res) => {
    try {
        const reminder = await model.getReminderById(req.params.id);

        if (!reminder) return res.status(404).json({ error: "Recordatorio no encontrado" });

        res.json(reminder);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el recordatorio" });
    }
};

////////////////////////////////////////////////////
// Crear recordatorio
////////////////////////////////////////////////////
export const createReminder = async (req, res) => {
    try {
        const { nombre, cuerpo, fecha_hora, id_usuario, id_habito } = req.body;

        const newReminder = await model.createReminder({
            nombre,
            cuerpo,
            fecha_hora: fecha_hora ? Timestamp.fromDate(new Date(fecha_hora)) : null,
            fecha_creacion: Timestamp.now(),
            id_usuario: id_usuario ?? null,
            id_habito: id_habito ?? null
        });

        res.status(201).json(newReminder);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el recordatorio" });
    }
};

////////////////////////////////////////////////////
// Actualizar recordatorio
////////////////////////////////////////////////////
export const updateReminder = async (req, res) => {
    try {
        const updated = await model.updateReminder(req.params.id, req.body);

        if (!updated) return res.status(404).json({ error: "Recordatorio no encontrado" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el recordatorio" });
    }
};

////////////////////////////////////////////////////
// Eliminar recordatorio
////////////////////////////////////////////////////
export const deleteReminder = async (req, res) => {
    try {
        const deleted = await model.deleteReminder(req.params.id);

        if (!deleted) return res.status(404).json({ error: "Recordatorio no encontrado" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el recordatorio" });
    }
};
