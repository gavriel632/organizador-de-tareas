import * as model from "../models/habits.model.js";

////////////////////////////////////////////////////
// 📌 OBTENER TODOS LOS HÁBITOS
////////////////////////////////////////////////////
export const getAllHabits = async (req, res) => {
    try {
        const habits = await model.getAllHabits(); // 👈 await
        res.json(habits);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los hábitos" });
    }
};

////////////////////////////////////////////////////
// 🔍 BUSCAR HÁBITOS POR NOMBRE
////////////////////////////////////////////////////
export const searchHabit = async (req, res) => {
    try {
        const { nombre } = req.query;
        const habits = await model.getAllHabits();

        const filtered = habits.filter(h =>
            (h.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar hábitos" });
    }
};

////////////////////////////////////////////////////
// 📌 OBTENER HÁBITO POR ID
////////////////////////////////////////////////////
export const getHabitById = async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await model.getHabitById(id);

        if (!habit) return res.status(404).json({ error: "Hábito no encontrado" });

        res.json(habit);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el hábito" });
    }
};

////////////////////////////////////////////////////
// ➕ CREAR HÁBITO
////////////////////////////////////////////////////
export const createHabit = async (req, res) => {
    try {
        const { nombre, periodo, id_usuario, id_recordatorio } = req.body;

        if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

        const newHabit = await model.createHabit({ nombre, periodo, id_usuario, id_recordatorio });

        res.status(201).json(newHabit);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el hábito" });
    }
};

////////////////////////////////////////////////////
// ✏️ ACTUALIZAR HÁBITO
////////////////////////////////////////////////////
export const updateHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await model.updateHabit(id, req.body);

        if (!updated) return res.status(404).json({ error: "Hábito no encontrado" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el hábito" });
    }
};

////////////////////////////////////////////////////
// 🗑️ ELIMINAR HÁBITO
////////////////////////////////////////////////////
export const deleteHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.deleteHabit(id);

        if (!deleted) return res.status(404).json({ error: "Hábito no encontrado" });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el hábito" });
    }
};
