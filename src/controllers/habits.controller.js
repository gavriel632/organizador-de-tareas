// Importa todas las funciones del modelo de hábitos (habits.model.js) para interactuar con Firestore.
import * as model from "../models/habits.model.js";

////////////////////////////////////////////////////
// 📌 OBTENER TODOS LOS HÁBITOS (GET /habits)
////////////////////////////////////////////////////
// Función controladora para obtener todos los hábitos.
export const getAllHabits = async (req, res) => {
    try {
        // Llama a la función del modelo para obtener todos los hábitos.
        const habits = await model.getAllHabits();
        // Responde con un código 200 (OK) y el array de hábitos.
        res.json(habits);
    } catch (error) {
        // Manejo de errores 500 (Internal Server Error).
        res.status(500).json({ error: "Error al obtener los hábitos" });
    }
};

////////////////////////////////////////////////////
// 🔍 BUSCAR HÁBITOS POR NOMBRE (GET /habits/search?nombre=...)
////////////////////////////////////////////////////
// Función controladora para filtrar hábitos por un término de búsqueda en el nombre.
export const searchHabit = async (req, res) => {
    try {
        // Obtiene el parámetro de consulta 'nombre' de la URL (ej: ?nombre=correr).
        const { nombre } = req.query;
        // Obtiene todos los hábitos de la base de datos.
        const habits = await model.getAllHabits();

        // Filtra los hábitos en memoria (en el servidor).
        const filtered = habits.filter(h =>
            // Asegura que 'nombre' no sea nulo, convierte a minúsculas, y busca la coincidencia.
            (h.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        // Responde con el subconjunto filtrado.
        res.json(filtered);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al buscar hábitos" });
    }
};

////////////////////////////////////////////////////
// 📌 OBTENER HÁBITO POR ID (GET /habits/:id)
////////////////////////////////////////////////////
// Función controladora para obtener un hábito específico por su ID.
export const getHabitById = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta (req.params).
        const { id } = req.params;
        // Llama al modelo para buscar el hábito.
        const habit = await model.getHabitById(id);

        // Si el hábito no se encuentra, responde con 404 (Not Found).
        if (!habit) return res.status(404).json({ error: "Hábito no encontrado" });

        // Responde con el objeto hábito.
        res.json(habit);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al obtener el hábito" });
    }
};

////////////////////////////////////////////////////
// ➕ CREAR HÁBITO (POST /habits)
////////////////////////////////////////////////////
// Función controladora para crear un nuevo hábito.
export const createHabit = async (req, res) => {
    try {
        // Obtiene los datos del cuerpo de la solicitud (req.body).
        const { nombre, periodo, id_usuario, id_recordatorio } = req.body;

        // Validación de datos: El nombre del hábito es obligatorio.
        if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

        // Llama al modelo para guardar el nuevo hábito en Firestore.
        const newHabit = await model.createHabit({ nombre, periodo, id_usuario, id_recordatorio });

        // Responde con un código 201 (Created) y el objeto del nuevo hábito.
        res.status(201).json(newHabit);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al crear el hábito" });
    }
};

////////////////////////////////////////////////////
// ✏️ ACTUALIZAR HÁBITO (PUT/PATCH /habits/:id)
////////////////////////////////////////////////////
// Función controladora para actualizar los datos de un hábito existente.
export const updateHabit = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Llama al modelo para actualizar el documento con los datos del cuerpo (req.body).
        const updated = await model.updateHabit(id, req.body);

        // Si el modelo retorna null (hábito no encontrado).
        if (!updated) return res.status(404).json({ error: "Hábito no encontrado" });

        // Responde con el objeto hábito ya actualizado.
        res.json(updated);
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al actualizar el hábito" });
    }
};

////////////////////////////////////////////////////
// 🗑️ ELIMINAR HÁBITO (DELETE /habits/:id)
////////////////////////////////////////////////////
// Función controladora para eliminar un hábito.
export const deleteHabit = async (req, res) => {
    try {
        // Obtiene el ID del parámetro de la ruta.
        const { id } = req.params;
        // Llama al modelo para eliminar el documento.
        const deleted = await model.deleteHabit(id);

        // Si el modelo retorna null (hábito no encontrado).
        if (!deleted) return res.status(404).json({ error: "Hábito no encontrado" });

        // Responde con un código 204 (No Content), indicando que la eliminación fue exitosa sin retornar cuerpo.
        res.status(204).send();
    } catch (error) {
        // Manejo de errores 500.
        res.status(500).json({ error: "Error al eliminar el hábito" });
    }
};