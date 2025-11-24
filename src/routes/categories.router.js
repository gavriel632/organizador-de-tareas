import { Router } from "express"; // Desestructuramos Router de Expres para utilizarlo

const router = Router(); // Es una instancia del Router

//////////////////////////////////////////////
import {
    getAllCategories,
    getCategoryById,
    searchCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/categories.controller.js"

//////////////////////////////////////////////

/// Rutas ///
router.get('/categories', getAllCategories);
router.get('/categories/search', searchCategory);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

//////////////////////////////////////////////
export default router;