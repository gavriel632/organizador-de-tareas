import * as model from "../models/categories.model.js";

////////////////////////////////////////////////////
// 📌 OBTENER TODAS LAS CATEGORÍAS
////////////////////////////////////////////////////
export const getAllCategories = async (req, res) => {
    try {
        const categories = await model.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las categorías" });
    }
};

////////////////////////////////////////////////////
// 🔍 BUSCAR CATEGORÍAS POR NOMBRE
////////////////////////////////////////////////////
export const searchCategory = async (req, res) => {
    try {
        const { nombre } = req.query;
        const categories = await model.getAllCategories();

        const filteredCategories = categories.filter(cat =>
            (cat.nombre ?? "").toLowerCase().includes((nombre ?? "").toLowerCase())
        );

        res.json(filteredCategories);
    } catch (error) {
        res.status(500).json({ error: "Error al buscar categorías" });
    }
};

////////////////////////////////////////////////////
// 📌 OBTENER CATEGORÍA POR ID
////////////////////////////////////////////////////
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await model.getCategoryById(id);

        if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

        res.json(category);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categoría" });
    }
};

////////////////////////////////////////////////////
// ➕ CREAR CATEGORÍA
////////////////////////////////////////////////////
export const createCategory = async (req, res) => {
    try {
        const { nombre, color, icono } = req.body;

        if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

        const newCategory = await model.createCategory({ nombre, color, icono });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la categoría" });
    }
};

////////////////////////////////////////////////////
// ✏️ ACTUALIZAR CATEGORÍA
////////////////////////////////////////////////////
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await model.updateCategory(id, req.body);

        if (!updated) return res.status(404).json({ error: "Categoría no encontrada" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la categoría" });
    }
};

////////////////////////////////////////////////////
// 🗑️ ELIMINAR CATEGORÍA
////////////////////////////////////////////////////
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await model.deleteCategory(id);

        if (!deleted) return res.status(404).json({ error: "Categoría no encontrada" });

        res.status(204).send(); // No body
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la categoría" });
    }
};
